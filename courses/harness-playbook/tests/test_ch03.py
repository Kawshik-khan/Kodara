"""Chapter 03 behaviour. Run from courses/harness-playbook: python -m unittest"""
import unittest

from harness.ch03.context_compiler import (
    Package, Unit, case_9182_pool, compile_briefing, consume, naive_rag,
)


class ContextCompilerTest(unittest.TestCase):
    def test_stale_policy_and_lookalike_case_block_the_first_build(self):
        pkg = Package(case_version=41)
        status = compile_briefing(pkg, case_9182_pool(policy_age=2820, policy_id="policy-v31"))
        self.assertEqual(status, "BLOCKED")
        self.assertEqual(pkg.diagnostics, {"policy": "STALE_REQUIRED_EVIDENCE"})
        self.assertEqual(pkg.rejected["crm-match-1"], "not_authoritative")
        self.assertEqual(pkg.rejected["case-8100"], "not_authoritative")
        self.assertEqual(pkg.rejected["policy-v31"], "stale_evidence")
        self.assertEqual(pkg.untrusted_data, ["attachment-1"])
        self.assertEqual(pkg.capabilities, [])

    def test_refreshed_policy_builds_ready_package_and_preserves_conflict(self):
        pkg = Package(case_version=41)
        status = compile_briefing(pkg, case_9182_pool(policy_age=12, policy_id="policy-v32"))
        self.assertEqual(status, "READY")
        self.assertEqual(pkg.admitted["identity"], ["id-binding-7"])
        self.assertEqual(pkg.admitted["policy"], ["policy-v32"])
        self.assertEqual(pkg.conflicts["settlement"], ["charges-991", "sub-events-4"])
        self.assertEqual(pkg.capabilities, ["billing.preview_resolution"])
        self.assertNotIn("billing.commit_refund", pkg.capabilities)

    def test_case_version_change_invalidates_ready_package(self):
        pkg = Package(case_version=41)
        compile_briefing(pkg, case_9182_pool(policy_age=12, policy_id="policy-v32"))
        with self.assertRaises(RuntimeError):
            consume(pkg, live_case_version=42)
        self.assertEqual(pkg.status, "STALE")
        self.assertEqual(pkg.diagnostics["version"], "DEPENDENCY_CHANGED")

    def test_blocked_package_cannot_be_consumed(self):
        pkg = Package(case_version=41)
        compile_briefing(pkg, case_9182_pool(policy_age=2820, policy_id="policy-v31"))
        with self.assertRaises(RuntimeError):
            consume(pkg, live_case_version=41)

    def test_naive_rag_admits_untrusted_stale_and_non_authoritative_units(self):
        prompt = naive_rag([], case_9182_pool())
        self.assertEqual(len(prompt), 7)
        self.assertTrue(any("attachment-1" in item for item in prompt))
        self.assertTrue(any("policy-v31" in item for item in prompt))
        self.assertTrue(any("case-8100" in item for item in prompt))


class ExerciseTest(unittest.TestCase):
    """The chapter exercise: reserve token budget for output, tools and recovery (pp. 84-86)."""

    @unittest.expectedFailure
    def test_exceeding_token_budget_after_reserves_blocks_the_build(self):
        pkg = Package(case_version=41)
        pool = [
            Unit("id-binding-7", "identity", "identity_service", 40, tokens=200),
            Unit("charges-991", "settlement", "billing_ledger", 5, tokens=200),
            Unit("policy-v32", "policy", "policy_registry", 12, tokens=200),
        ]
        status = compile_briefing(pkg, pool, max_tokens=700, reserve_tokens=200)
        self.assertEqual(status, "BLOCKED")
        self.assertEqual(pkg.diagnostics.get("budget"), "BUDGET_UNSATISFIABLE")


if __name__ == "__main__":
    unittest.main()


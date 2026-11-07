"""Chapter 00 behaviour. Run from courses/harness-playbook: python -m unittest"""
import unittest

from harness.ch00.control_loop import (
    GRANT, TOOLS, Grant, Run, Stop, control_loop, ledger_was_read, scripted,
)

READ = ("read_ledger", {"case": "882"})
REFUND = ("refund", {"case": "882", "amount": 42.0})


def run_loop(task, budget, *moves, grant=GRANT, tools=TOOLS):
    run = Run(task, budget)
    return control_loop(run, scripted(*moves), grant, tools, ledger_was_read), run


class ControlLoopTest(unittest.TestCase):
    def test_completion_needs_evidence_in_state(self):
        stop, run = run_loop("explain_charge", 4, READ, ("done", {}))
        self.assertEqual(stop, Stop.COMPLETE)
        self.assertEqual(run.state["read_ledger"], [42.0, 42.0])

    def test_saying_done_without_evidence_exhausts_the_budget(self):
        stop, run = run_loop("explain_charge", 2, ("done", {}), ("done", {}))
        self.assertEqual(stop, Stop.BUDGET_EXHAUSTED)
        self.assertEqual(run.state, {})
        self.assertEqual(run.trail.count("claimed done without evidence"), 2)

    def test_irreversible_action_escalates_and_never_executes(self):
        called = []
        tools = {**TOOLS, "refund": lambda **kw: called.append(kw)}
        stop, run = run_loop("resolve_duplicate", 4, READ, REFUND, tools=tools)
        self.assertEqual(stop, Stop.ESCALATE)
        self.assertEqual(called, [])
        self.assertNotIn("refund", run.state)

    def test_unqualified_task_abstains(self):
        stop, _ = run_loop("rewrite_policy", 4, READ)
        self.assertEqual(stop, Stop.ABSTAIN)

    def test_action_outside_permissions_is_denied(self):
        stop, _ = run_loop("explain_charge", 4, ("delete_account", {"case": "882"}))
        self.assertEqual(stop, Stop.POLICY_DENIED)

    def test_unverified_conditions_abstain(self):
        stale = Grant(GRANT.qualified_tasks, GRANT.permissions, False, GRANT.recoverable)
        stop, _ = run_loop("explain_charge", 4, READ, grant=stale)
        self.assertEqual(stop, Stop.ABSTAIN)


class ExerciseTest(unittest.TestCase):
    """The chapter exercise. It fails until the learner adds the stop state."""

    @unittest.expectedFailure
    def test_tool_crash_ends_as_failed_recoverably(self):
        def broken(case):
            raise ConnectionError("ledger service down")

        stop, run = run_loop("explain_charge", 4, READ, tools={**TOOLS, "read_ledger": broken})
        self.assertEqual(stop, Stop.FAILED_RECOVERABLY)
        self.assertEqual(run.trail[-1], "STOP failed_recoverably")


if __name__ == "__main__":
    unittest.main()

import unittest
from harness.ch20.skill_linker import (
    ActivationRecord,
    Skill,
    admit_skill,
    promote_candidate_skill,
    resume_skill_run,
)

GRANT = ("billing_read", "policy_read", "case_proposal_write")


class SkillLinkerTest(unittest.TestCase):
    def test_admitted_skill_intersects_tools_with_run_grant_and_records_bom(self):
        rec = ActivationRecord()
        status = admit_skill(rec, Skill(), ("authenticated_customer", "two_charges"), GRANT)
        self.assertEqual(status, "ADMITTED")
        self.assertNotIn("refund_create", rec.effective_tools)
        self.assertEqual(rec.effective_tools, ["billing_read", "policy_read", "case_proposal_write"])
        self.assertEqual(rec.bom[0], "duplicate-charge-investigation@4.2.0")

    def test_excluded_chargeback_signal_rejects_activation(self):
        rec = ActivationRecord()
        status = admit_skill(rec, Skill(), ("authenticated_customer", "active_chargeback"), GRANT)
        self.assertEqual(status, "REJECTED")
        self.assertEqual(rec.reason, "EXCLUDED:active_chargeback")

    def test_unavailable_policy_service_suspends_instead_of_using_embedded_example(self):
        rec = ActivationRecord()
        status = admit_skill(rec, Skill(), ("authenticated_customer", "two_charges"), GRANT, policy_healthy=False)
        self.assertEqual(status, "SUSPENDED")
        self.assertEqual(rec.reason, "POLICY_DEPENDENCY_UNAVAILABLE")

    def test_mid_run_revocation_blocks_resuming_suspended_run(self):
        rec = ActivationRecord()
        skill = Skill()
        admit_skill(rec, skill, ("authenticated_customer", "two_charges"), GRANT, policy_healthy=False)
        skill.assurance = "REVOKED"
        self.assertEqual(resume_skill_run(rec, skill), "REVOKED_STOPPED")
        self.assertEqual(rec.reason, "STOP_AND_RECONCILE")

    def test_untested_compatibility_tuple_is_denied(self):
        rec = ActivationRecord()
        status = admit_skill(rec, Skill(compat="UNTESTED"), ("authenticated_customer",), GRANT)
        self.assertEqual(status, "DENIED")
        self.assertEqual(rec.reason, "COMPAT_UNTESTED")


class ExerciseTest(unittest.TestCase):
    @unittest.expectedFailure
    def test_self_authored_or_overactivating_candidate_cannot_publish(self):
        # Invariant 19: model-authored skill remains candidate-only until independently released
        self.assertEqual(promote_candidate_skill("model", 0), "CANDIDATE_ONLY")
        # Invariant 18 & Worked Case 4.2.1: any active_chargeback false activation vetoes release
        self.assertEqual(promote_candidate_skill("release_board", 3), "REJECT_NO_RELEASE")
        self.assertEqual(promote_candidate_skill("release_board", 0), "PUBLISHED")


if __name__ == "__main__":
    unittest.main()


"""Chapter 02 behaviour. Run from courses/harness-playbook: python -m unittest"""
import unittest

from harness.ch02.aci_refund import (
    S, Harness, Operation, PaymentProvider, naive_retry,
)


class AciRefundTest(unittest.TestCase):
    def test_lost_ack_is_reconciled_into_exactly_one_refund(self):
        provider = PaymentProvider(lose_first_ack=True)
        op = Operation(case="882", amount=42.0)
        Harness(provider).run(op)
        self.assertEqual(op.state, S.COMMITTED)
        self.assertEqual(provider.ledger, {"refund-case-882-v17": 42.0})
        self.assertIn("UNKNOWN_EFFECT", "\n".join(op.log))

    def test_clean_run_observes_then_commits(self):
        provider = PaymentProvider()
        op = Operation(case="882", amount=42.0)
        Harness(provider).run(op)
        self.assertEqual(op.state, S.COMMITTED)
        self.assertNotIn("UNKNOWN_EFFECT", "\n".join(op.log))

    def test_amount_at_ceiling_waits_for_approval_and_sends_nothing(self):
        provider = PaymentProvider(lose_first_ack=True)
        op = Operation(case="882", amount=140.0)
        Harness(provider).run(op)
        self.assertEqual(op.state, S.WAITING_APPROVAL)
        self.assertEqual(provider.ledger, {})

    def test_same_key_never_refunds_twice(self):
        provider = PaymentProvider()
        provider.refund("refund-case-882-v17", 42.0)
        provider.refund("refund-case-882-v17", 42.0)
        self.assertEqual(len(provider.ledger), 1)

    def test_naive_retry_duplicates_the_refund(self):
        provider = PaymentProvider(lose_first_ack=True)
        naive_retry(provider, "882", 42.0)
        self.assertEqual(len(provider.ledger), 2)

    def test_illegal_transition_is_rejected(self):
        op = Operation(case="882", amount=42.0)
        with self.assertRaises(RuntimeError):
            op.move(S.COMMITTED)
        self.assertEqual(op.state, S.PROPOSED)
        self.assertEqual(op.log, [])


class ExerciseTest(unittest.TestCase):
    """The chapter exercise. It fails until the learner adds the version check."""

    @unittest.expectedFailure
    def test_stale_case_version_raises_version_conflict_before_dispatch(self):
        provider = PaymentProvider()
        op = Operation(case="882", amount=42.0)
        harness = Harness(provider)
        harness.current_case_version = lambda case: 18  # a human changed the case
        with self.assertRaisesRegex(RuntimeError, "version_conflict"):
            harness.run(op, case_version=17)
        self.assertEqual(provider.ledger, {})


if __name__ == "__main__":
    unittest.main()

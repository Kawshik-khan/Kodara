"""Chapter 04 behaviour. Run from courses/harness-playbook: python -m unittest"""
import unittest

from harness.ch04.budgeted_controller import Controller, delegate, step


class BudgetedControllerTest(unittest.TestCase):
    def test_timeout_suspends_reconciles_and_completes_without_duplicate_dispatch(self):
        ctrl = Controller()
        self.assertEqual(step(ctrl, "dispatch_refund", outcome="timeout"), "RECOVERING")
        self.assertEqual(ctrl.effect, "UNKNOWN_EFFECT")
        self.assertEqual(ctrl.calls_left, 4)

        self.assertEqual(step(ctrl, "wait_window"), "WAITING_EXTERNAL")
        self.assertEqual(ctrl.calls_left, 4)  # waiting burns 0 model calls

        self.assertEqual(step(ctrl, "reconcile", outcome="found"), "VERIFYING")
        self.assertEqual(ctrl.obligations, ["verify"])

        self.assertEqual(step(ctrl, "verify"), "COMPLETED")
        self.assertEqual(ctrl.obligations, [])
        self.assertEqual(ctrl.calls_left, 2)

    def test_unknown_effect_blocks_non_reconcile_actions(self):
        ctrl = Controller()
        step(ctrl, "dispatch_refund", outcome="timeout")
        self.assertEqual(step(ctrl, "dispatch_refund"), "RECOVERING")
        self.assertEqual(ctrl.calls_left, 4)

    def test_unavailable_reconciliation_terminates_as_unresolved_effect(self):
        ctrl = Controller()
        step(ctrl, "dispatch_refund", outcome="timeout")
        self.assertEqual(step(ctrl, "reconcile", outcome="unavailable"), "UNRESOLVED_EFFECT")
        self.assertIn("refund", ctrl.obligations)

    def test_repeated_fingerprint_with_no_progress_abstains(self):
        ctrl = Controller()
        step(ctrl, "probe_ledger")
        self.assertEqual(step(ctrl, "probe_ledger"), "ABSTAINED")
        self.assertEqual(ctrl.calls_left, 4)

    def test_action_that_would_violate_recovery_reserve_is_blocked(self):
        ctrl = Controller(calls_left=1, reserve=1)
        self.assertEqual(step(ctrl, "dispatch_refund"), "BUDGET_EXHAUSTED")
        self.assertEqual(ctrl.calls_left, 1)
        self.assertEqual(ctrl.effect, "NONE")


class ExerciseTest(unittest.TestCase):
    """The chapter exercise: prevent budget laundering by delegation (p. 98)."""

    @unittest.expectedFailure
    def test_delegation_deducts_from_parent_and_protects_reserve(self):
        parent = Controller(calls_left=5, reserve=1)
        child = delegate(parent, 3)
        self.assertEqual(child.calls_left, 3)
        self.assertEqual(parent.calls_left, 2)
        with self.assertRaises(ValueError):
            delegate(parent, 2)  # would leave 0 calls, violating parent.reserve == 1


if __name__ == "__main__":
    unittest.main()


"""Chapter 01 behaviour. Run from courses/harness-playbook: python -m unittest"""
import unittest
from dataclasses import replace

from harness.ch01.event_log import (
    Crash, EventLog, Provider, materialize, resume_from_log, resume_from_transcript, worker,
)


def crashed():
    """A worker that dies after the provider accepted the refund."""
    log, transcript, provider = EventLog(), [], Provider()
    try:
        worker(log, transcript, provider, crash=True)
    except Crash:
        pass
    else:
        raise AssertionError("worker should have crashed")
    return log, transcript, provider


class EventLogTest(unittest.TestCase):
    def test_crash_leaves_an_unresolved_effect_on_record(self):
        log, transcript, provider = crashed()
        self.assertEqual([e.kind for e in log.events], ["effect_dispatched"])
        self.assertEqual(transcript, [])
        self.assertEqual(materialize(log.events)["unresolved"], ["refund-case-882"])
        self.assertEqual(len(provider.ledger), 1)

    def test_resuming_from_the_transcript_refunds_twice(self):
        _, transcript, provider = crashed()
        resume_from_transcript(transcript, provider)
        self.assertEqual(len(provider.ledger), 2)

    def test_resuming_from_the_log_reconciles_and_completes(self):
        log, _, provider = crashed()
        state = resume_from_log(log, provider)
        self.assertEqual(state["phase"], "COMPLETED")
        self.assertEqual(state["evidence"], ["refund-case-882"])
        self.assertEqual(len(provider.ledger), 1)
        self.assertEqual([e.kind for e in log.events], ["effect_dispatched", "effect_reconciled", "completed"])

    def test_materialize_is_deterministic(self):
        log, _, provider = crashed()
        resume_from_log(log, provider)
        self.assertEqual(materialize(log.events), materialize(list(log.events)))

    def test_editing_history_breaks_the_chain(self):
        log, transcript, provider = EventLog(), [], Provider()
        worker(log, transcript, provider)
        self.assertTrue(log.intact())
        log.events[0] = replace(log.events[0], data={"key": "refund-case-882", "amount": 4.2})
        self.assertFalse(log.intact())
        with self.assertRaises(RuntimeError):
            resume_from_log(log, provider)

    def test_missing_effect_is_not_completed(self):
        log, provider = EventLog(), Provider()
        log.append("effect_dispatched", key="refund-case-882", amount=42.0)  # crash before the provider saw it
        state = resume_from_log(log, provider)
        self.assertNotEqual(state["phase"], "COMPLETED")
        self.assertEqual(log.events[-1].kind, "effect_escalated")


class ExerciseTest(unittest.TestCase):
    """The chapter exercise. It fails until the learner handles escalation in materialize()."""

    @unittest.expectedFailure
    def test_escalated_effect_gets_its_own_phase_and_owner(self):
        log, provider = EventLog(), Provider()
        log.append("effect_dispatched", key="refund-case-882", amount=42.0)
        state = resume_from_log(log, provider)
        self.assertEqual(state["phase"], "ESCALATED")
        self.assertEqual(state["escalated"], ["refund-case-882"])


if __name__ == "__main__":
    unittest.main()

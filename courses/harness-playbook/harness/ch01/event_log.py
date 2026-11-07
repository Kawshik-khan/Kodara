"""Chapter 01: operational truth lives in an append-only event log, not the transcript."""
import hashlib
import json
from dataclasses import dataclass


@dataclass(frozen=True)
class Event:
    seq: int
    kind: str
    data: dict
    prev_hash: str

    def digest(self):
        body = json.dumps([self.seq, self.kind, self.data, self.prev_hash], sort_keys=True)
        return hashlib.sha256(body.encode()).hexdigest()[:12]


class EventLog:
    """Append-only. Corrections are new events; history is never rewritten."""

    def __init__(self):
        self.events = []

    def append(self, kind, **data):
        prev = self.events[-1].digest() if self.events else "genesis"
        self.events.append(Event(len(self.events) + 1, kind, data, prev))

    def intact(self):
        prev = "genesis"
        for event in self.events:
            if event.prev_hash != prev:
                return False
            prev = event.digest()
        return True


def materialize(events):
    """Task state is a projection of the events, rebuilt the same way every time."""
    state = {"phase": "RECEIVED", "unresolved": [], "evidence": []}
    for event in events:
        if event.kind == "effect_dispatched":
            state["phase"] = "EXECUTING"
            state["unresolved"].append(event.data["key"])
        elif event.kind in ("effect_observed", "effect_reconciled"):
            state["unresolved"].remove(event.data["key"])
            state["evidence"].append(event.data["key"])
        elif event.kind == "completed":
            state["phase"] = "COMPLETED"
    return state


class Provider:
    """The payment system: the authoritative record of refunds."""

    def __init__(self):
        self.ledger = {}

    def refund(self, key, amount):
        self.ledger.setdefault(key, amount)

    def lookup(self, key):
        return self.ledger.get(key)


class Crash(Exception):
    """The worker dies after the provider accepted the refund."""


def worker(log, transcript, provider, crash=False):
    key = "refund-case-882"
    log.append("effect_dispatched", key=key, amount=42.0)   # intent recorded first
    provider.refund(key, 42.0)
    if crash:
        raise Crash("worker died before the response was written")
    log.append("effect_observed", key=key)
    transcript.append("refund confirmed")


def resume_from_transcript(transcript, provider):
    """Narrative reconstruction: no confirmation in the chat, so refund again."""
    if "refund confirmed" not in transcript:
        provider.refund(f"retry-{len(transcript) + 1}", 42.0)  # a new id, a second refund
        transcript.append("refund confirmed")


def resume_from_log(log, provider):
    """Rebuild state from events, reconcile unresolved effects, then finish."""
    if not log.intact():
        raise RuntimeError("event log was edited: refuse to resume")
    state = materialize(log.events)
    for key in list(state["unresolved"]):
        if provider.lookup(key) is not None:
            log.append("effect_reconciled", key=key)
        else:
            log.append("effect_escalated", key=key)
    state = materialize(log.events)
    if not state["unresolved"]:
        log.append("completed", evidence=state["evidence"])
    return materialize(log.events)


if __name__ == "__main__":
    for name, resume in [("resume from transcript", "transcript"), ("resume from event log", "log")]:
        log, transcript, provider = EventLog(), [], Provider()
        try:
            worker(log, transcript, provider, crash=True)
        except Crash:
            pass
        if resume == "transcript":
            resume_from_transcript(transcript, provider)
        else:
            print(f"# {name}: {resume_from_log(log, provider)}")
        print(f"# {name}: refunds={len(provider.ledger)} {provider.ledger}")

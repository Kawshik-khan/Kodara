"""Scenarios the trace recorder runs for event_log.py."""
from dataclasses import replace

from harness.ch01.event_log import Crash, EventLog, Provider, resume_from_log, resume_from_transcript, worker

SOURCE = "harness/ch01/event_log.py"


def crashed_worker():
    log, transcript, provider = EventLog(), [], Provider()
    try:
        worker(log, transcript, provider, crash=True)
    except Crash:
        pass
    return log, transcript, provider


def from_log():
    log, transcript, provider = crashed_worker()
    return (lambda: resume_from_log(log, provider)), {"log": log, "provider": provider}


def from_transcript():
    log, transcript, provider = crashed_worker()
    return (lambda: resume_from_transcript(transcript, provider)), {"transcript": transcript, "provider": provider}


def edited_history():
    log, transcript, provider = EventLog(), [], Provider()
    worker(log, transcript, provider)
    log.events[0] = replace(log.events[0], data={"key": "refund-case-882", "amount": 4.2})

    def run():
        try:
            resume_from_log(log, provider)
        except RuntimeError:
            pass

    return run, {"log": log}


def crash():
    log, transcript, provider = EventLog(), [], Provider()

    def run():
        try:
            worker(log, transcript, provider, crash=True)
        except Crash:
            pass

    return run, {"log": log, "transcript": transcript, "provider": provider}


SCENARIOS = {"crash": crash, "log": from_log, "transcript": from_transcript, "edited": edited_history}

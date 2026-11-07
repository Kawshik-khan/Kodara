"""Scenarios the trace recorder runs for budgeted_controller.py."""
from harness.ch04.budgeted_controller import Controller, step

SOURCE = "harness/ch04/budgeted_controller.py"


def governed_recovery():
    ctrl = Controller()

    def run():
        step(ctrl, "dispatch_refund", outcome="timeout")
        step(ctrl, "wait_window")
        step(ctrl, "reconcile", outcome="found")
        return step(ctrl, "verify")

    return run, {"ctrl": ctrl}


def unresolved_at_deadline():
    ctrl = Controller()

    def run():
        step(ctrl, "dispatch_refund", outcome="timeout")
        return step(ctrl, "reconcile", outcome="unavailable")

    return run, {"ctrl": ctrl}


def no_progress_cycle():
    ctrl = Controller()

    def run():
        step(ctrl, "probe_ledger")
        return step(ctrl, "probe_ledger")

    return run, {"ctrl": ctrl}


def reserve_protected():
    ctrl = Controller(calls_left=1, reserve=1)
    return (lambda: step(ctrl, "dispatch_refund")), {"ctrl": ctrl}


SCENARIOS = {
    "governed": governed_recovery,
    "unresolved": unresolved_at_deadline,
    "cycle": no_progress_cycle,
    "reserve": reserve_protected,
}


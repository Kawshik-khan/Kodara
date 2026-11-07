"""Scenarios the trace recorder runs for control_loop.py."""
from harness.ch00.control_loop import GRANT, TOOLS, Run, control_loop, ledger_was_read, scripted

SOURCE = "harness/ch00/control_loop.py"

READ = ("read_ledger", {"case": "882"})


def verified():
    run = Run("explain_charge", 4)
    model = scripted(READ, ("done", {}))
    return (lambda: control_loop(run, model, GRANT, TOOLS, ledger_was_read)), {"run": run}


def premature():
    run = Run("explain_charge", 2)
    model = scripted(("done", {}), ("done", {}))
    return (lambda: control_loop(run, model, GRANT, TOOLS, ledger_was_read)), {"run": run}


def payment():
    run = Run("resolve_duplicate", 4)
    model = scripted(READ, ("refund", {"case": "882", "amount": 42.0}))
    return (lambda: control_loop(run, model, GRANT, TOOLS, ledger_was_read)), {"run": run}


SCENARIOS = {"verified": verified, "premature": premature, "payment": payment}

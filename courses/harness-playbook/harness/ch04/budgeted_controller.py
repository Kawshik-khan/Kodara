"""Chapter 04: an agent earns another turn only when the next transition is permitted, affordable, and progresses state."""
from dataclasses import dataclass, field


@dataclass
class Controller:
    state: str = "RUNNING"
    calls_left: int = 5
    reserve: int = 1
    effect: str = "NONE"
    obligations: list = field(default_factory=lambda: ["refund", "verify"])
    history: list = field(default_factory=list)
    log: list = field(default_factory=list)


def step(ctrl, action, target="op-7391", outcome="ok"):
    """Admit and execute one governed controller transition."""
    if ctrl.effect == "UNKNOWN_EFFECT" and action not in ("reconcile", "wait_window"):
        ctrl.state = "RECOVERING"
        return ctrl.state

    if action == "wait_window":
        ctrl.state = "WAITING_EXTERNAL"
        ctrl.log.append("suspended: 0 model calls burned")
        return ctrl.state

    if action not in ("reconcile", "verify") and ctrl.calls_left - 1 < ctrl.reserve:
        ctrl.state = "BUDGET_EXHAUSTED"
        ctrl.log.append("blocked: would dip into recovery reserve")
        return ctrl.state

    fp = f"{action}:{target}:{ctrl.effect}:{len(ctrl.obligations)}"
    if fp in ctrl.history:
        ctrl.state = "ABSTAINED"
        ctrl.log.append(f"cycle detected on {fp}")
        return ctrl.state
    ctrl.history.append(fp)

    ctrl.calls_left -= 1
    if action == "dispatch_refund":
        if outcome == "timeout":
            ctrl.effect = "UNKNOWN_EFFECT"
            ctrl.state = "RECOVERING"
        else:
            ctrl.effect = "CONFIRMED"
            ctrl.obligations.remove("refund")
    elif action == "reconcile":
        if outcome == "found":
            ctrl.effect = "CONFIRMED"
            ctrl.obligations.remove("refund")
            ctrl.state = "VERIFYING"
        else:
            ctrl.state = "UNRESOLVED_EFFECT"
    elif action == "verify" and "refund" not in ctrl.obligations:
        ctrl.obligations.remove("verify")
        ctrl.state = "COMPLETED"
    return ctrl.state


def delegate(ctrl, child_calls):
    """Allocate a sub-budget to a child worker (exercise: deduct from parent and protect reserve)."""
    return Controller(calls_left=child_calls, reserve=0)


if __name__ == "__main__":
    c = Controller()
    for act, out in [("dispatch_refund", "timeout"), ("wait_window", "ok"), ("reconcile", "found"), ("verify", "ok")]:
        step(c, act, outcome=out)
    print(f"# governed recovery: state={c.state} effect={c.effect} calls_left={c.calls_left} obligations={c.obligations}")

    u = Controller()
    for act, out in [("dispatch_refund", "timeout"), ("reconcile", "unavailable")]:
        step(u, act, outcome=out)
    print(f"# reconciliation unavailable: state={u.state} effect={u.effect} obligations={u.obligations}")

    loop = Controller()
    for _ in range(2):
        step(loop, "probe_ledger")
    print(f"# semantic repeat: state={loop.state} log={loop.log}")


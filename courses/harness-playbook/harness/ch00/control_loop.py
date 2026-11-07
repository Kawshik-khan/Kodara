"""Chapter 00: the harness as a control loop with a gate and typed stops."""
from dataclasses import dataclass, field
from enum import Enum


class Stop(Enum):
    COMPLETE = "complete"
    ABSTAIN = "abstain"
    ESCALATE = "escalate"
    BUDGET_EXHAUSTED = "budget_exhausted"
    POLICY_DENIED = "policy_denied"


@dataclass(frozen=True)
class Grant:
    """Warranted autonomy: qualified tasks, permissions, conditions, recoverability."""
    qualified_tasks: frozenset
    permissions: frozenset
    conditions_ok: bool
    recoverable: frozenset

    def admits(self, task, action):
        if task not in self.qualified_tasks:
            return Stop.ABSTAIN
        if action not in self.permissions:
            return Stop.POLICY_DENIED
        if not self.conditions_ok:
            return Stop.ABSTAIN
        if action not in self.recoverable:
            return Stop.ESCALATE
        return None


@dataclass
class Run:
    task: str
    budget: int
    state: dict = field(default_factory=dict)
    trail: list = field(default_factory=list)


def control_loop(run, model, grant, tools, verify):
    while run.budget > 0:
        context = {"task": run.task, "facts": dict(run.state)}  # c_t = Context(s_t)
        action, args = model(context)                         # z_t ~ Model(c_t)
        if action == "done":
            if verify(run.state):                             # check the world, not the sentence
                return finish(run, Stop.COMPLETE)
            run.trail.append("claimed done without evidence")
            run.budget -= 1
            continue
        verdict = grant.admits(run.task, action)              # a_t = Gate(z_t)
        if verdict is not None:
            return finish(run, verdict)
        observation = tools[action](**args)                   # o_t = Execute(a_t)
        run.state[action] = observation                       # s_t+1 = Update(s_t, a_t, o_t)
        run.trail.append(f"{action} -> {observation}")
        run.budget -= 1
    return finish(run, Stop.BUDGET_EXHAUSTED)


def finish(run, stop):
    run.trail.append(f"STOP {stop.value}")
    return stop


def scripted(*moves):
    """A stand-in for the model: proposes the given moves in order."""
    queue = list(moves)
    return lambda context: queue.pop(0) if queue else ("done", {})


LEDGER = {"882": [42.0, 42.0]}
TOOLS = {
    "read_ledger": lambda case: LEDGER[case],
    "refund": lambda case, amount: f"refunded {amount}",
}
GRANT = Grant(
    qualified_tasks=frozenset({"explain_charge", "resolve_duplicate"}),
    permissions=frozenset({"read_ledger", "refund"}),
    conditions_ok=True,
    recoverable=frozenset({"read_ledger"}),
)


def ledger_was_read(state):
    return "read_ledger" in state


if __name__ == "__main__":
    runs = {
        "verified": (Run("explain_charge", 4), scripted(("read_ledger", {"case": "882"}), ("done", {}))),
        "premature": (Run("explain_charge", 2), scripted(("done", {}), ("done", {}))),
        "payment": (Run("resolve_duplicate", 4), scripted(("read_ledger", {"case": "882"}),
                                                          ("refund", {"case": "882", "amount": 42.0}))),
    }
    for name, (run, model) in runs.items():
        stop = control_loop(run, model, GRANT, TOOLS, ledger_was_read)
        print(f"# {name}: {stop.name}")
        print("\n".join(f"  {line}" for line in run.trail))

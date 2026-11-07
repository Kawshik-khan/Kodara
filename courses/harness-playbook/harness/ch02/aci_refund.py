"""Chapter 02: a tool call is a proposal; an action is an authorized transition."""
from dataclasses import dataclass, field
from enum import Enum


class S(Enum):
    PROPOSED = "PROPOSED"
    VALIDATED = "VALIDATED"
    AUTHORIZED = "AUTHORIZED"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    PREPARED = "PREPARED"
    DISPATCHED = "DISPATCHED"
    UNKNOWN_EFFECT = "UNKNOWN_EFFECT"
    OBSERVED = "OBSERVED"
    RECONCILED = "RECONCILED"
    VERIFIED = "VERIFIED"
    COMMITTED = "COMMITTED"
    ESCALATED = "ESCALATED"


LEGAL = {
    S.PROPOSED: {S.VALIDATED},
    S.VALIDATED: {S.AUTHORIZED, S.WAITING_APPROVAL},
    S.AUTHORIZED: {S.PREPARED},
    S.PREPARED: {S.DISPATCHED},
    S.DISPATCHED: {S.OBSERVED, S.UNKNOWN_EFFECT},
    S.OBSERVED: {S.RECONCILED},
    S.UNKNOWN_EFFECT: {S.RECONCILED, S.ESCALATED},
    S.RECONCILED: {S.VERIFIED},
    S.VERIFIED: {S.COMMITTED},
}


class Timeout(Exception):
    """Dispatch happened; the response did not come back."""


class PaymentProvider:
    """The authoritative external system. It owns the truth about refunds."""

    def __init__(self, lose_first_ack=False):
        self.ledger = {}                 # key -> amount
        self.lose_ack = lose_first_ack

    def refund(self, key, amount):
        self.ledger.setdefault(key, amount)   # same key, one effect
        if self.lose_ack:
            self.lose_ack = False
            raise Timeout("connection reset after commit")
        return "refunded"

    def lookup(self, key):
        return self.ledger.get(key)


@dataclass
class Operation:
    case: str
    amount: float
    state: S = S.PROPOSED
    key: str | None = None
    log: list = field(default_factory=list)

    def move(self, to, note=""):
        if to not in LEGAL.get(self.state, set()):
            raise RuntimeError(f"illegal {self.state.value} -> {to.value}")
        self.log.append(f"{self.state.value:>14} -> {to.value:<16} {note}")
        self.state = to


class Harness:
    CEILING = 100.0   # autonomous refunds must stay below EUR 100

    def __init__(self, provider):
        self.provider = provider

    def run(self, op, case_version=17):
        op.move(S.VALIDATED, "schema, bound account, ledger match")
        if op.amount >= self.CEILING:
            return op.move(S.WAITING_APPROVAL, "approval_required: frozen preview to human")
        op.move(S.AUTHORIZED, "grant refund.write < EUR 100")

        op.key = f"refund-case-{op.case}-v{case_version}"  # persisted before dispatch
        op.move(S.PREPARED, f"key={op.key}")
        op.move(S.DISPATCHED)
        try:
            self.provider.refund(op.key, op.amount)
            op.move(S.OBSERVED, "200 OK is transport status only")
        except Timeout as err:
            op.move(S.UNKNOWN_EFFECT, f"{err}: reconcile, do not retry")

        found = self.provider.lookup(op.key)              # same key, authoritative read
        if found is None:
            return op.move(S.ESCALATED, "no effect after finality window")
        op.move(S.RECONCILED, f"ledger holds 1 refund of EUR {found:.2f}")
        op.move(S.VERIFIED, "effect + message + case version bound")
        op.move(S.COMMITTED)


def naive_retry(provider, case, amount):
    """'Retry three times': every attempt mints a fresh id."""
    for attempt in range(1, 4):
        try:
            return provider.refund(f"{case}-attempt-{attempt}", amount)
        except Timeout:
            continue


if __name__ == "__main__":
    for title, amount in [("harness, ack lost", 42.0), ("harness, EUR 140", 140.0)]:
        provider = PaymentProvider(lose_first_ack=True)
        op = Operation(case="882", amount=amount)
        Harness(provider).run(op)
        print(f"# {title}\n" + "\n".join(op.log))
        print(f"final={op.state.value} refunds={len(provider.ledger)}\n")

    provider = PaymentProvider(lose_first_ack=True)
    naive_retry(provider, "882", 42.0)
    print(f"# naive retry, ack lost\nrefunds={len(provider.ledger)} {provider.ledger}")

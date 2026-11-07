"""Scenarios the trace recorder runs for aci_refund.py.

Each scenario returns (run, watched): `run` is called under sys.settrace,
`watched` names the objects whose attributes are captured at every step.
"""
from harness.ch02.aci_refund import Harness, Operation, PaymentProvider, naive_retry

SOURCE = "harness/ch02/aci_refund.py"


def ack_lost():
    provider = PaymentProvider(lose_first_ack=True)
    op = Operation(case="882", amount=42.0)
    return (lambda: Harness(provider).run(op)), {"op": op, "provider": provider}


def over_limit():
    provider = PaymentProvider(lose_first_ack=True)
    op = Operation(case="882", amount=140.0)
    return (lambda: Harness(provider).run(op)), {"op": op, "provider": provider}


def naive():
    provider = PaymentProvider(lose_first_ack=True)
    return (lambda: naive_retry(provider, "882", 42.0)), {"provider": provider}


SCENARIOS = {"ack": ack_lost, "limit": over_limit, "naive": naive}

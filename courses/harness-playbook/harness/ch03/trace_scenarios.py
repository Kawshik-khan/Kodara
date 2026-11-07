"""Scenarios the trace recorder runs for context_compiler.py."""
from harness.ch03.context_compiler import (
    Package, case_9182_pool, compile_briefing, consume, naive_rag,
)

SOURCE = "harness/ch03/context_compiler.py"


def blocked_build():
    pkg = Package(case_version=41)
    pool = case_9182_pool(policy_age=2820, policy_id="policy-v31")
    return (lambda: compile_briefing(pkg, pool)), {"pkg": pkg}


def ready_build():
    pkg = Package(case_version=41)
    pool = case_9182_pool(policy_age=12, policy_id="policy-v32")
    return (lambda: compile_briefing(pkg, pool)), {"pkg": pkg}


def stale_invalidation():
    pkg = Package(case_version=41)
    compile_briefing(pkg, case_9182_pool(policy_age=12, policy_id="policy-v32"))

    def run():
        try:
            consume(pkg, live_case_version=42)
        except RuntimeError:
            pass

    return run, {"pkg": pkg}


def naive_dump():
    prompt = []
    pool = case_9182_pool(policy_age=2820, policy_id="policy-v31")
    return (lambda: naive_rag(prompt, pool)), {"prompt": prompt}


SCENARIOS = {
    "blocked": blocked_build,
    "ready": ready_build,
    "stale": stale_invalidation,
    "naive": naive_dump,
}


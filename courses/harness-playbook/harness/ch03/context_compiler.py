"""Chapter 03: retrieval finds candidates; compilation decides what this invocation may rely upon."""
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Unit:
    id: str
    claim: str
    source: str
    age: int
    zone: str = "trusted"
    tokens: int = 120


OBLIGATIONS = {
    "identity": ({"identity_service"}, 300),
    "settlement": ({"billing_ledger", "subscription_log"}, 30),
    "policy": ({"policy_registry"}, 600),
}


@dataclass
class Package:
    case_version: int = 41
    status: str = "VALIDATING"
    admitted: dict = field(default_factory=dict)
    conflicts: dict = field(default_factory=dict)
    untrusted_data: list = field(default_factory=list)
    rejected: dict = field(default_factory=dict)
    diagnostics: dict = field(default_factory=dict)
    capabilities: list = field(default_factory=list)


def compile_briefing(pkg, pool, max_tokens=1000, reserve_tokens=300):
    """Compile a bounded, phase-specific context package for resolution_proposal."""
    for unit in pool:
        if unit.zone == "untrusted_data":
            pkg.untrusted_data.append(unit.id)   # data-only; never instruction or authority
            continue
        sources, max_age = OBLIGATIONS[unit.claim]
        if unit.source not in sources:
            pkg.rejected[unit.id] = "not_authoritative"
        elif unit.age > max_age:
            pkg.rejected[unit.id] = "stale_evidence"
        else:
            pkg.admitted.setdefault(unit.claim, []).append(unit.id)

    for claim in OBLIGATIONS:
        units = pkg.admitted.get(claim, [])
        if not units:
            pkg.diagnostics[claim] = "STALE_REQUIRED_EVIDENCE"
        elif len(units) > 1:
            pkg.conflicts[claim] = list(units)   # preserve disagreement; do not smooth over

    if pkg.diagnostics:
        pkg.status = "BLOCKED"
        return pkg.status
    pkg.status = "READY"
    pkg.capabilities = ["billing.preview_resolution"]   # commit_refund withheld in proposal phase
    return pkg.status


def consume(pkg, live_case_version):
    """Consume a READY package only if its bound dependencies still match the world."""
    if pkg.status != "READY":
        raise RuntimeError(f"build is {pkg.status}: cannot invoke model")
    if pkg.case_version != live_case_version:
        pkg.status = "STALE"
        pkg.diagnostics["version"] = "DEPENDENCY_CHANGED"
        raise RuntimeError("case version changed after READY: recompile")
    pkg.status = "CONSUMED"
    return pkg.status


def naive_rag(prompt, pool):
    """Top-k accumulation: dumps untrusted, stale and non-authoritative items into one prompt."""
    for unit in pool:
        prompt.append(f"{unit.id} ({unit.source}, {unit.zone})")
    return prompt


def case_9182_pool(policy_age=2820, policy_id="policy-v31"):
    return [
        Unit("attachment-1", "complaint", "customer_upload", 10, zone="untrusted_data"),
        Unit("crm-match-1", "identity", "crm_search", 20),
        Unit("id-binding-7", "identity", "identity_service", 40),
        Unit("charges-991", "settlement", "billing_ledger", 5),
        Unit("sub-events-4", "settlement", "subscription_log", 5),
        Unit("case-8100", "policy", "case_archive", 100),
        Unit(policy_id, "policy", "policy_registry", policy_age),
    ]


if __name__ == "__main__":
    for label, age, pid in [("first build (stale policy)", 2820, "policy-v31"), ("rebuilt (fresh policy)", 12, "policy-v32")]:
        pkg = Package(case_version=41)
        compile_briefing(pkg, case_9182_pool(policy_age=age, policy_id=pid))
        print(f"# {label}: status={pkg.status} admitted={pkg.admitted} conflicts={pkg.conflicts} rejected={pkg.rejected}")
    try:
        consume(pkg, live_case_version=42)
    except RuntimeError as err:
        print(f"# after case edit v41->v42: status={pkg.status} ({err})")


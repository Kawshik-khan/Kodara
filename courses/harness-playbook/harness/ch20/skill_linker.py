"""Chapter 20: a skill is executable organizational judgment with a probabilistic linker."""
from dataclasses import dataclass, field


@dataclass
class Skill:
    id: str = "duplicate-charge-investigation"
    version: str = "4.2.0"
    digest: str = "sha256:420a"
    excluded: tuple = ("active_chargeback", "fraud_claim")
    tools: tuple = ("billing_read", "policy_read", "case_proposal_write", "refund_create")
    compat: str = "QUALIFIED"
    assurance: str = "ACTIVE"


@dataclass
class ActivationRecord:
    status: str = "NOMINATED"
    reason: str = "OK"
    effective_tools: list = field(default_factory=list)
    bom: list = field(default_factory=list)


def admit_skill(rec, skill, signals, run_grant, policy_healthy=True):
    """Deterministic admission gate: discovery or nomination never authorizes loading by itself."""
    if skill.assurance != "ACTIVE":
        rec.status = "DENIED"
        rec.reason = "SKILL_REVOKED"
        return rec.status
    if skill.compat != "QUALIFIED":
        rec.status = "DENIED"
        rec.reason = f"COMPAT_{skill.compat}"
        return rec.status
    for sig in signals:
        if sig in skill.excluded:
            rec.status = "REJECTED"
            rec.reason = f"EXCLUDED:{sig}"
            return rec.status
    if not policy_healthy:
        rec.status = "SUSPENDED"
        rec.reason = "POLICY_DEPENDENCY_UNAVAILABLE"
        return rec.status

    rec.effective_tools = [t for t in skill.tools if t in run_grant]
    rec.bom = [f"{skill.id}@{skill.version}", skill.digest, "example:policy@31(non-authoritative)"]
    rec.status = "ADMITTED"
    rec.reason = "PROPOSAL_ONLY_GRANT"
    return rec.status


def resume_skill_run(rec, skill):
    """Re-verify assurance state before resuming a suspended skill run."""
    if skill.assurance != "ACTIVE":
        rec.status = "REVOKED_STOPPED"
        rec.reason = "STOP_AND_RECONCILE"
        return rec.status
    rec.status = "RESUMED"
    return rec.status


def promote_candidate_skill(author_role, chargeback_false_activations):
    """Gate skill publication on independent qualification and zero consequential false activations (exercise)."""
    return "PUBLISHED"


if __name__ == "__main__":
    grant = ("billing_read", "policy_read", "case_proposal_write")
    s = Skill()
    r1 = ActivationRecord()
    admit_skill(r1, s, ("authenticated_customer", "two_charges"), grant)
    print(f"# admitted: status={r1.status} tools={r1.effective_tools} bom={r1.bom}")

    r2 = ActivationRecord()
    admit_skill(r2, s, ("authenticated_customer", "active_chargeback"), grant)
    print(f"# chargeback exclusion: status={r2.status} reason={r2.reason}")


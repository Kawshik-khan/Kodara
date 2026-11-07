"""Scenarios the trace recorder runs for skill_linker.py."""
from harness.ch20.skill_linker import ActivationRecord, Skill, admit_skill, resume_skill_run

SOURCE = "harness/ch20/skill_linker.py"
GRANT = ("billing_read", "policy_read", "case_proposal_write")


def admitted_scoped():
    rec = ActivationRecord()
    skill = Skill()
    return (
        lambda: admit_skill(rec, skill, ("authenticated_customer", "two_charges"), GRANT),
        {"rec": rec},
    )


def chargeback_excluded():
    rec = ActivationRecord()
    skill = Skill()
    return (
        lambda: admit_skill(rec, skill, ("authenticated_customer", "active_chargeback"), GRANT),
        {"rec": rec},
    )


def stale_policy_suspended_then_revoked():
    rec = ActivationRecord()
    skill = Skill()

    def run():
        admit_skill(rec, skill, ("authenticated_customer", "two_charges"), GRANT, policy_healthy=False)
        skill.assurance = "REVOKED"
        return resume_skill_run(rec, skill)

    return run, {"rec": rec}


def untested_stack_denied():
    rec = ActivationRecord()
    skill = Skill(compat="UNTESTED")
    return (
        lambda: admit_skill(rec, skill, ("authenticated_customer", "two_charges"), GRANT),
        {"rec": rec},
    )


SCENARIOS = {
    "admitted": admitted_scoped,
    "excluded": chargeback_excluded,
    "revoked": stale_policy_suspended_then_revoked,
    "untested": untested_stack_denied,
}


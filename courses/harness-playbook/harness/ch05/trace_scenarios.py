"""Scenarios the trace recorder runs for qualification_gate.py."""
from harness.ch05.qualification_gate import QualificationReport, Trial, qualify_run

SOURCE = "harness/ch05/qualification_gate.py"


def worked_case_vetoed():
    rpt = QualificationReport()
    trials = [
        Trial("c1", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c2", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c3", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c4", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c5", "VALID_PASS", ("identity.verify", "billing.read"), ("refund.created",)),
    ]
    return (lambda: qualify_run(rpt, trials)), {"rpt": rpt}


def missing_output_attrition():
    rpt = QualificationReport()
    trials = [
        Trial("c1", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c2", "MISSING_OUTPUT"),
    ]
    return (lambda: qualify_run(rpt, trials)), {"rpt": rpt}


def trajectory_identity_bypass():
    rpt = QualificationReport()
    trials = [
        Trial("c1", "VALID_PASS", ("billing.read", "identity.verify")),
    ]
    return (lambda: qualify_run(rpt, trials)), {"rpt": rpt}


def repaired_scoped_approval():
    rpt = QualificationReport()
    trials = [
        Trial("c1", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c2", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c3", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c4", "VALID_PASS", ("identity.verify", "billing.read")),
        Trial("c5", "VALID_PASS", ("identity.verify", "billing.read")),
    ]
    return (lambda: qualify_run(rpt, trials)), {"rpt": rpt}


SCENARIOS = {
    "vetoed": worked_case_vetoed,
    "missing": missing_output_attrition,
    "trajectory": trajectory_identity_bypass,
    "approved": repaired_scoped_approval,
}

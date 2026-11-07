import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  conditionHolds,
  fillTemplate,
  initialStepIndex,
  missingNotes,
  noteKey,
  resolveNote,
} from "@/features/code-trace/core/explain";
import { TraceStep } from "@/features/code-trace/types/trace.types";
import { ACI_REFUND_TRACE } from "@/content/courses/harness-playbook/ch02/aciRefund.trace";
import { defaultTraceRegistry } from "@/features/code-trace/core/registry";
import { CONTROL_LOOP_TRACE } from "@/content/courses/harness-playbook/ch00/controlLoop.trace";
import { EVENT_LOG_TRACE } from "@/content/courses/harness-playbook/ch01/eventLog.trace";
import { CONTEXT_COMPILER_TRACE } from "@/content/courses/harness-playbook/ch03/contextCompiler.trace";
import { BUDGETED_CONTROLLER_TRACE } from "@/content/courses/harness-playbook/ch04/budgetedController.trace";
import { QUALIFICATION_GATE_TRACE } from "@/content/courses/harness-playbook/ch05/qualificationGate.trace";
import { SKILL_LINKER_TRACE } from "@/content/courses/harness-playbook/ch20/skillLinker.trace";

const step = (over: Partial<TraceStep> = {}): TraceStep => ({
  line: 10,
  event: "line",
  frames: [{ fn: "move", line: 10, locals: { to: "S.VALIDATED", attempt: "2" } }],
  objects: { op: { state: "S.PROPOSED", amount: 42, log: [] }, provider: { ledger: {} } },
  ...over,
});

describe("trace explanation resolver", () => {
  it("builds note keys from line and event", () => {
    expect(noteKey(step())).toBe("10");
    expect(noteKey(step({ event: "exception" }))).toBe("10!");
    expect(noteKey(step({ event: "return" }))).toBe("10^");
  });

  it("fills locals, object paths, detail and line, and leaves unknown braces alone", () => {
    const s = step({ detail: "42.0" });
    expect(fillTemplate("{object.op.state} → {local.to}", s)).toBe("S.PROPOSED → S.VALIDATED");
    expect(fillTemplate("€{object.op.amount} at {line}, got {detail}", s)).toBe("€42 at 10, got 42.0");
    expect(fillTemplate('f"refund-case-{op.case}-v{case_version}"', s)).toBe('f"refund-case-{op.case}-v{case_version}"');
  });

  it("evaluates generic conditions", () => {
    const a = step();
    const b = step({ objects: { ...a.objects, provider: { ledger: { k: 42 } } } });
    expect(conditionHolds({ localPresent: "attempt" }, a, b)).toBe(true);
    expect(conditionHolds({ localPresent: "found" }, a, b)).toBe(false);
    expect(conditionHolds({ changesNext: "provider.ledger" }, a, b)).toBe(true);
    expect(conditionHolds({ changesNext: "provider.ledger" }, b, b)).toBe(false);
    expect(conditionHolds({ changesNext: "provider.ledger" }, a, undefined)).toBe(false);
  });

  it("picks the setdefault variant only when the ledger grows on the next step", () => {
    const steps = ACI_REFUND_TRACE.trace.scenarios.ack;
    const i = steps.findIndex((s) => s.line === 46);
    const note = resolveNote(ACI_REFUND_TRACE, steps, i);
    expect(note?.what.en).toContain("is not in the ledger");
    // the base text applies when the ledger does not change afterwards
    const unchanged = [steps[i], { ...steps[i], line: 47 }];
    expect(resolveNote(ACI_REFUND_TRACE, unchanged, 0)?.what.en).toContain("already exists");
  });

  it("opens the ack-lost scenario where the Timeout reaches run()", () => {
    const steps = ACI_REFUND_TRACE.trace.scenarios.ack;
    const i = initialStepIndex(steps, "firstCaughtException");
    expect(steps[i].event).toBe("exception");
    expect(steps[i].frames.map((f) => f.fn)).toEqual(["Harness.run"]);
    expect(steps[i].objects.provider.ledger).toEqual({ "refund-case-882-v17": 42 });
  });
});

describe("Chapter 02 recorded trace content", () => {
  it("is registered", () => {
    expect(defaultTraceRegistry.get(ACI_REFUND_TRACE.id)).toBe(ACI_REFUND_TRACE);
  });

  it.each(defaultTraceRegistry.getAll().map((d) => [d.id, d] as const))(
    "%s has a filled note with a why for every recorded step",
    (_, definition) => {
      expect(missingNotes(definition)).toEqual([]);
      for (const [scenario, steps] of Object.entries(definition.trace.scenarios)) {
        steps.forEach((_, i) => {
          const note = resolveNote(definition, steps, i);
          expect(note?.why, `${scenario} step ${i + 1}`).toBeDefined();
          for (const text of [note?.what.bn, note?.what.en, note?.why?.bn, note?.why?.en]) {
            expect(text, `${scenario} step ${i + 1}`).not.toMatch(/\{(local|object)\.[^}]*\}/);
          }
        });
      }
    }
  );

  it.each(defaultTraceRegistry.getAll().map((d) => [d.id, d] as const))(
    "%s embeds exactly the source of the course file it was recorded from",
    (_, definition) => {
      const file = path.resolve(process.cwd(), "courses/harness-playbook", definition.trace.sourcePath);
      const source = fs.readFileSync(file, "utf-8").replace(/\r\n/g, "\n").replace(/\n+$/, "");
      expect(definition.trace.source).toBe(source);
    }
  );

  it("records the outcomes the Python tests assert", () => {
    const { ack, limit, naive } = ACI_REFUND_TRACE.trace.scenarios;
    expect(ack.at(-1)?.objects.op.state).toBe("S.VERIFIED"); // last step is the COMMITTED move
    expect(Object.keys(ack.at(-1)!.objects.provider.ledger as object)).toHaveLength(1);
    expect(Object.keys(limit.at(-1)!.objects.provider.ledger as object)).toHaveLength(0);
    expect(Object.keys(naive.at(-1)!.objects.provider.ledger as object)).toHaveLength(2);
  });
});

describe("Chapter 01 recorded trace content", () => {
  it("shows the crash outcome each resume path leads to", () => {
    const { crash, transcript, log, edited } = EVENT_LOG_TRACE.trace.scenarios;
    expect(crash.at(-1)?.event).toBe("exception");
    expect(crash.at(-1)?.objects.provider.ledger).toEqual({ "refund-case-882": 42 });
    expect(Object.keys(transcript.at(-1)!.objects.provider.ledger as object)).toHaveLength(2);
    expect(log.at(-1)?.detail).toContain("'phase': 'COMPLETED'");
    expect(Object.keys(log.at(-1)!.objects.provider.ledger as object)).toHaveLength(1);
    expect(edited.at(-1)?.event).toBe("exception");
    expect(edited.at(-1)?.detail).toContain("event log was edited");
  });
});

describe("Chapter 00 recorded trace content", () => {
  it("ends each scenario with the stop the Python tests assert", () => {
    const { verified, premature, payment } = CONTROL_LOOP_TRACE.trace.scenarios;
    expect(verified.at(-1)?.detail).toBe("Stop.COMPLETE");
    expect(premature.at(-1)?.detail).toBe("Stop.BUDGET_EXHAUSTED");
    expect(payment.at(-1)?.detail).toBe("Stop.ESCALATE");
    // the refund was proposed but never executed
    expect(payment.at(-1)?.objects.run.state).toEqual({ "read_ledger": [42, 42] });
  });

  it("fills the gate note with the recorded action", () => {
    const steps = CONTROL_LOOP_TRACE.trace.scenarios.payment;
    const i = steps.findIndex((s) => s.line === 29 && s.frames.at(-1)?.locals.action === "'refund'");
    expect(resolveNote(CONTROL_LOOP_TRACE, steps, i)?.what.en).toBe("Gate 4: is the action `'refund'` recoverable?");
  });
});

describe("Chapter 03 recorded trace content", () => {
  it("records the Case 9182 blocked, ready, stale and naive outcomes", () => {
    const { blocked, ready, stale, naive } = CONTEXT_COMPILER_TRACE.trace.scenarios;
    expect(blocked.at(-1)?.detail).toBe("'BLOCKED'");
    expect(blocked.at(-1)?.objects.pkg.diagnostics).toEqual({ policy: "STALE_REQUIRED_EVIDENCE" });
    expect(ready.at(-1)?.detail).toBe("'READY'");
    expect(ready.at(-1)?.objects.pkg.conflicts).toEqual({ settlement: ["charges-991", "sub-events-4"] });
    expect(stale.at(-1)?.event).toBe("exception");
    expect(stale.at(-1)?.objects.pkg.status).toBe("STALE");
    expect((naive.at(-1)?.objects.prompt.items as unknown[]).length).toBe(7);
  });
});

describe("Chapter 04 recorded trace content", () => {
  it("records the governed, unresolved, cycle and reserve outcomes", () => {
    const { governed, unresolved, cycle, reserve } = BUDGETED_CONTROLLER_TRACE.trace.scenarios;
    expect(governed.at(-1)?.detail).toBe("'COMPLETED'");
    expect(governed.at(-1)?.objects.ctrl.obligations).toEqual([]);
    expect(unresolved.at(-1)?.detail).toBe("'UNRESOLVED_EFFECT'");
    expect(unresolved.at(-1)?.objects.ctrl.effect).toBe("UNKNOWN_EFFECT");
    expect(cycle.at(-1)?.detail).toBe("'ABSTAINED'");
    expect(cycle.at(-1)?.objects.ctrl.state).toBe("ABSTAINED");
    expect(reserve.at(-1)?.detail).toBe("'BUDGET_EXHAUSTED'");
    expect(reserve.at(-1)?.objects.ctrl.calls_left).toBe(1);
  });
});

describe("Chapter 05 recorded trace content", () => {
  it("records the vetoed, missing, trajectory and approved outcomes", () => {
    const { vetoed, missing, trajectory, approved } = QUALIFICATION_GATE_TRACE.trace.scenarios;
    expect(vetoed.at(-1)?.detail).toBe("'REJECT_SAFETY_FLOOR'");
    expect(vetoed.at(-1)?.objects.rpt.completion_pp).toBe(80.0);
    expect(vetoed.at(-1)?.objects.rpt.vetoes).toEqual(["c5:VETO:UNAUTHORIZED_EFFECT"]);
    expect(missing.at(-1)?.detail).toBe("'REQUEST_MORE_EVIDENCE'");
    expect(missing.at(-1)?.objects.rpt.attrition).toBe(1);
    expect(trajectory.at(-1)?.detail).toBe("'REJECT_SAFETY_FLOOR'");
    expect(trajectory.at(-1)?.objects.rpt.vetoes).toEqual(["c1:VETO:IDENTITY_BYPASSED"]);
    expect(approved.at(-1)?.detail).toBe("'APPROVE_AS_SCOPED'");
    expect(approved.at(-1)?.objects.rpt.completion_pp).toBe(100.0);
  });
});

describe("Chapter 20 recorded trace content", () => {
  it("records the admitted, excluded, revoked and untested skill linker outcomes", () => {
    const { admitted, excluded, revoked, untested } = SKILL_LINKER_TRACE.trace.scenarios;
    expect(admitted.at(-1)?.detail).toBe("'ADMITTED'");
    expect(admitted.at(-1)?.objects.rec.effective_tools).toEqual([
      "billing_read",
      "policy_read",
      "case_proposal_write",
    ]);
    expect(excluded.at(-1)?.detail).toBe("'REJECTED'");
    expect(excluded.at(-1)?.objects.rec.reason).toBe("EXCLUDED:active_chargeback");
    expect(revoked.at(-1)?.detail).toBe("'REVOKED_STOPPED'");
    expect(revoked.at(-1)?.objects.rec.reason).toBe("STOP_AND_RECONCILE");
    expect(untested.at(-1)?.detail).toBe("'DENIED'");
    expect(untested.at(-1)?.objects.rec.reason).toBe("COMPAT_UNTESTED");
  });
});

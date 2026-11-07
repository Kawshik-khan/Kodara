import { CodeTraceDefinition } from "../types/trace.types";
import { ACI_REFUND_TRACE } from "@/content/courses/harness-playbook/ch02/aciRefund.trace";
import { CONTROL_LOOP_TRACE } from "@/content/courses/harness-playbook/ch00/controlLoop.trace";
import { EVENT_LOG_TRACE } from "@/content/courses/harness-playbook/ch01/eventLog.trace";
import { CONTEXT_COMPILER_TRACE } from "@/content/courses/harness-playbook/ch03/contextCompiler.trace";
import { BUDGETED_CONTROLLER_TRACE } from "@/content/courses/harness-playbook/ch04/budgetedController.trace";
import { QUALIFICATION_GATE_TRACE } from "@/content/courses/harness-playbook/ch05/qualificationGate.trace";
import { SKILL_LINKER_TRACE } from "@/content/courses/harness-playbook/ch20/skillLinker.trace";

export class TraceRegistry {
  private traces = new Map<string, CodeTraceDefinition>();

  constructor(definitions: CodeTraceDefinition[] = []) {
    definitions.forEach((d) => this.register(d));
  }

  register(definition: CodeTraceDefinition): void {
    if (!definition.id) throw new Error("Trace definition must have a non-empty id.");
    this.traces.set(definition.id, definition);
  }

  get(id: string): CodeTraceDefinition | undefined {
    return this.traces.get(id);
  }

  getAll(): CodeTraceDefinition[] {
    return [...this.traces.values()];
  }
}

export const defaultTraceRegistry = new TraceRegistry([
  CONTROL_LOOP_TRACE,
  EVENT_LOG_TRACE,
  ACI_REFUND_TRACE,
  CONTEXT_COMPILER_TRACE,
  BUDGETED_CONTROLLER_TRACE,
  QUALIFICATION_GATE_TRACE,
  SKILL_LINKER_TRACE,
]);

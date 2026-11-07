import {
  VisualizationCategory,
  VisualizationDefinition,
} from "../types/visualization.types";
import { VARIABLES_BASIC_VISUALIZATION } from "../visualizations/typescript/variablesBasic";
import { CALL_STACK_BASIC_VISUALIZATION } from "../visualizations/javascript/callStackBasic";
import { SCOPE_LOOKUP_VISUALIZATION } from "../visualizations/typescript/scopeLookup";
import { REFERENCES_OBJECT_VISUALIZATION } from "../visualizations/typescript/referencesObject";
import { TYPE_NARROWING_VISUALIZATION } from "../visualizations/typescript/typeNarrowing";
import {
  ACI_REFUND_ACK_LOST_VISUALIZATION,
  ACI_REFUND_NAIVE_VISUALIZATION,
} from "../visualizations/aiEngineering/aciRefundFlow";
import { CONTROL_LOOP_VISUALIZATION } from "../visualizations/aiEngineering/controlLoopFlow";
import { EVENT_LOG_VISUALIZATION } from "../visualizations/aiEngineering/eventLogFlow";
import { CONTEXT_COMPILER_VISUALIZATION } from "../visualizations/aiEngineering/contextCompilerFlow";
import { BUDGETED_CONTROLLER_VISUALIZATION } from "../visualizations/aiEngineering/budgetedControllerFlow";
import { EVALUATION_CONTROL_PLANE_VISUALIZATION } from "../visualizations/aiEngineering/evaluationControlPlaneFlow";
import { SKILL_LIFECYCLE_VISUALIZATION } from "../visualizations/aiEngineering/skillLifecycleFlow";

export class VisualizationRegistry {
  private registry: Map<string, VisualizationDefinition> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register(VARIABLES_BASIC_VISUALIZATION);
    this.register(CALL_STACK_BASIC_VISUALIZATION);
    this.register(SCOPE_LOOKUP_VISUALIZATION);
    this.register(REFERENCES_OBJECT_VISUALIZATION);
    this.register(TYPE_NARROWING_VISUALIZATION);
    this.register(CONTROL_LOOP_VISUALIZATION);
    this.register(EVENT_LOG_VISUALIZATION);
    this.register(ACI_REFUND_ACK_LOST_VISUALIZATION);
    this.register(ACI_REFUND_NAIVE_VISUALIZATION);
    this.register(CONTEXT_COMPILER_VISUALIZATION);
    this.register(BUDGETED_CONTROLLER_VISUALIZATION);
    this.register(EVALUATION_CONTROL_PLANE_VISUALIZATION);
    this.register(SKILL_LIFECYCLE_VISUALIZATION);
  }

  public register(definition: VisualizationDefinition): void {
    if (!definition.id) {
      throw new Error("Visualization definition must have a valid non-empty id.");
    }
    this.registry.set(definition.id, definition);
  }

  public get(id: string): VisualizationDefinition | undefined {
    return this.registry.get(id);
  }

  public getAll(): VisualizationDefinition[] {
    return Array.from(this.registry.values());
  }

  public getByCategory(category: VisualizationCategory): VisualizationDefinition[] {
    return this.getAll().filter((item) => item.category === category);
  }
}

export const defaultVisualizationRegistry = new VisualizationRegistry();

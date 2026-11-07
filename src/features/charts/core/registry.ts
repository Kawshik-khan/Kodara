import { ChartDefinition } from "../types/chart.types";
import { DUPLICATE_REFUNDS_CHART } from "../charts/aiEngineering/duplicateRefunds";
import { VERIFICATION_BUDGET_CHART } from "../charts/aiEngineering/verificationBudget";
import { SILENT_FAILURE_CHART } from "../charts/aiEngineering/silentFailure";
import { POST_FILTER_RECALL_CHART } from "../charts/aiEngineering/postFilterRecall";
import { RETRY_AMPLIFICATION_CHART } from "../charts/aiEngineering/retryAmplification";
import { PASS_POWER_K_CHART } from "../charts/aiEngineering/passPowerK";
import { SKILL_ACTIVATION_PRECISION_CHART } from "../charts/aiEngineering/skillActivationPrecision";

export class ChartRegistry {
  private charts = new Map<string, ChartDefinition>();

  constructor(definitions: ChartDefinition[] = []) {
    definitions.forEach((d) => this.register(d));
  }

  register(definition: ChartDefinition): void {
    if (!definition.id) throw new Error("Chart definition must have a non-empty id.");
    this.charts.set(definition.id, definition);
  }

  get(id: string): ChartDefinition | undefined {
    return this.charts.get(id);
  }

  getAll(): ChartDefinition[] {
    return [...this.charts.values()];
  }
}

export const defaultChartRegistry = new ChartRegistry([
  VERIFICATION_BUDGET_CHART,
  SILENT_FAILURE_CHART,
  DUPLICATE_REFUNDS_CHART,
  POST_FILTER_RECALL_CHART,
  RETRY_AMPLIFICATION_CHART,
  PASS_POWER_K_CHART,
  SKILL_ACTIVATION_PRECISION_CHART,
]);

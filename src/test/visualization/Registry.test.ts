import { describe, it, expect } from "vitest";
import {
  VisualizationRegistry,
  defaultVisualizationRegistry,
} from "@/features/visualization/core/registry";

describe("VisualizationRegistry", () => {
  it("initializes with default core visualizations", () => {
    const all = defaultVisualizationRegistry.getAll();
    expect(all.length).toBeGreaterThanOrEqual(4);

    const varVis = defaultVisualizationRegistry.get("typescript.variables.basic");
    expect(varVis).toBeDefined();
    expect(varVis?.category).toBe("runtime");

    const stackVis = defaultVisualizationRegistry.get("javascript.call-stack.basic");
    expect(stackVis).toBeDefined();
    expect(stackVis?.category).toBe("execution");

    const scopeVis = defaultVisualizationRegistry.get("typescript.scope.lookup");
    expect(scopeVis).toBeDefined();
    expect(scopeVis?.category).toBe("scope");

    const refVis = defaultVisualizationRegistry.get("typescript.references.object");
    expect(refVis).toBeDefined();
    expect(refVis?.category).toBe("memory");
  });

  it("filters definitions by category", () => {
    const runtimeVis = defaultVisualizationRegistry.getByCategory("runtime");
    expect(runtimeVis.some((v) => v.id === "typescript.variables.basic")).toBe(true);

    const memoryVis = defaultVisualizationRegistry.getByCategory("memory");
    expect(memoryVis.some((v) => v.id === "typescript.references.object")).toBe(true);
  });

  it("registers new visualization and prevents invalid registrations", () => {
    const registry = new VisualizationRegistry();

    expect(() => {
      registry.register({} as any);
    }).toThrow();
  });
});

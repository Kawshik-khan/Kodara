import { describe, it, expect } from "vitest";
import { diffScene } from "@/features/visualization/core/sceneDiff";
import { Scene } from "@/features/visualization/types/scene.types";

describe("Visualization Scene Diffing", () => {
  const baseScene: Scene = {
    viewBox: { width: 600, height: 400 },
    nodes: [
      {
        id: "node-1",
        type: "binding",
        label: "count",
        x: 50,
        y: 50,
        width: 100,
        height: 50,
        state: "created",
      },
    ],
    edges: [],
  };

  it("handles initial scene where previous scene is null", () => {
    const patch = diffScene(null, baseScene);
    expect(patch.createdNodeIds).toEqual(["node-1"]);
    expect(patch.updatedNodeIds).toEqual([]);
    expect(patch.removedNodeIds).toEqual([]);
  });

  it("identifies added and updated nodes across steps", () => {
    const nextScene: Scene = {
      viewBox: { width: 600, height: 400 },
      nodes: [
        {
          id: "node-1",
          type: "binding",
          label: "count",
          x: 50,
          y: 50,
          width: 100,
          height: 50,
          state: "active", // state changed
        },
        {
          id: "node-2",
          type: "memory-slot",
          label: "10",
          x: 200,
          y: 50,
          width: 80,
          height: 50,
        },
      ],
      edges: [
        {
          id: "edge-1",
          fromNodeId: "node-1",
          toNodeId: "node-2",
          type: "pointer",
        },
      ],
    };

    const patch = diffScene(baseScene, nextScene);
    expect(patch.createdNodeIds).toEqual(["node-2"]);
    expect(patch.updatedNodeIds).toEqual(["node-1"]);
    expect(patch.removedNodeIds).toEqual([]);
    expect(patch.createdEdgeIds).toEqual(["edge-1"]);
    expect(patch.removedEdgeIds).toEqual([]);
  });

  it("identifies removed nodes when stack frames pop", () => {
    const nextScene: Scene = {
      viewBox: { width: 600, height: 400 },
      nodes: [],
      edges: [],
    };

    const patch = diffScene(baseScene, nextScene);
    expect(patch.removedNodeIds).toEqual(["node-1"]);
  });
});

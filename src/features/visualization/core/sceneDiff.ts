import { Scene, ScenePatch } from "../types/scene.types";

/**
 * Computes declarative diff between two scenes to support targeted transitions.
 */
export function diffScene(prevScene: Scene | null, nextScene: Scene): ScenePatch {
  if (!prevScene) {
    return {
      createdNodeIds: nextScene.nodes.map((n) => n.id),
      updatedNodeIds: [],
      removedNodeIds: [],
      createdEdgeIds: nextScene.edges.map((e) => e.id),
      removedEdgeIds: [],
    };
  }

  const prevNodeMap = new Map(prevScene.nodes.map((n) => [n.id, n]));
  const nextNodeMap = new Map(nextScene.nodes.map((n) => [n.id, n]));

  const createdNodeIds: string[] = [];
  const updatedNodeIds: string[] = [];
  const removedNodeIds: string[] = [];

  for (const [id, nextNode] of nextNodeMap.entries()) {
    const prevNode = prevNodeMap.get(id);
    if (!prevNode) {
      createdNodeIds.push(id);
    } else {
      const hasChanged =
        prevNode.x !== nextNode.x ||
        prevNode.y !== nextNode.y ||
        prevNode.label !== nextNode.label ||
        prevNode.state !== nextNode.state ||
        JSON.stringify(prevNode.data) !== JSON.stringify(nextNode.data);

      if (hasChanged) {
        updatedNodeIds.push(id);
      }
    }
  }

  for (const id of prevNodeMap.keys()) {
    if (!nextNodeMap.has(id)) {
      removedNodeIds.push(id);
    }
  }

  const prevEdgeMap = new Map(prevScene.edges.map((e) => [e.id, e]));
  const nextEdgeMap = new Map(nextScene.edges.map((e) => [e.id, e]));

  const createdEdgeIds: string[] = [];
  const removedEdgeIds: string[] = [];

  for (const id of nextEdgeMap.keys()) {
    if (!prevEdgeMap.has(id)) {
      createdEdgeIds.push(id);
    }
  }

  for (const id of prevEdgeMap.keys()) {
    if (!nextEdgeMap.has(id)) {
      removedEdgeIds.push(id);
    }
  }

  return {
    createdNodeIds,
    updatedNodeIds,
    removedNodeIds,
    createdEdgeIds,
    removedEdgeIds,
  };
}

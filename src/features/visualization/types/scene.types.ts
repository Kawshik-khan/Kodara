export type SceneNodeType =
  | "environment-record"
  | "binding"
  | "memory-slot"
  | "stack-frame"
  | "heap-object"
  | "scope-box"
  | "ast-node"
  | "generic-card";

export type SceneNodeState =
  | "idle"
  | "active"
  | "changed"
  | "created"
  | "removed"
  | "error"
  | "warning";

export interface SceneNode {
  id: string;
  type: SceneNodeType;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state?: SceneNodeState;
  data?: Record<string, unknown>;
  parentId?: string;
}

export type SceneEdgeType =
  | "pointer"
  | "lexical-parent"
  | "scope-lookup"
  | "call"
  | "return";

export type SceneEdgeState =
  | "idle"
  | "active"
  | "traversing"
  | "highlighted"
  | "error";

export interface SceneEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: SceneEdgeType;
  label?: string;
  state?: SceneEdgeState;
  dashed?: boolean;
  controlPointOffset?: { x: number; y: number };
}

export interface SceneAnnotation {
  id: string;
  targetNodeId: string;
  textEn: string;
  textBn: string;
  position?: "top" | "bottom" | "left" | "right";
  badgeType?: "info" | "warning" | "success" | "error";
}

export interface Scene {
  viewBox: {
    width: number;
    height: number;
  };
  nodes: SceneNode[];
  edges: SceneEdge[];
  annotations?: SceneAnnotation[];
}

export interface ScenePatch {
  createdNodeIds: string[];
  updatedNodeIds: string[];
  removedNodeIds: string[];
  createdEdgeIds: string[];
  removedEdgeIds: string[];
}

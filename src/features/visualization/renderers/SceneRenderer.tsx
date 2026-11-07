import React from "react";
import { Scene } from "../types/scene.types";
import { GridBackground } from "./GridBackground";
import { SvgLayer } from "./SvgLayer";
import { DomLayer } from "./DomLayer";
import "./SceneRenderer.css";

export interface SceneRendererProps {
  scene: Scene;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  selectedNodeId,
  onSelectNode,
}) => {
  const { viewBox, nodes, edges, annotations } = scene;
  const { width, height } = viewBox;

  return (
    <div
      className="kodara-scene-renderer"
      data-testid="scene-renderer"
      onClick={() => onSelectNode(null)}
    >
      <div
        className="kodara-scene-renderer__viewport"
        style={{
          aspectRatio: `${width} / ${height}`,
        }}
      >
        {/* SVG Canvas for Grid & Connections */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="kodara-scene-renderer__svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <GridBackground width={width} height={height} />
          <SvgLayer edges={edges} nodes={nodes} width={width} height={height} />
        </svg>

        {/* DOM Layer for Interactive Nodes & Labels */}
        <DomLayer
          nodes={nodes}
          annotations={annotations}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          viewBoxWidth={width}
          viewBoxHeight={height}
        />
      </div>
    </div>
  );
};

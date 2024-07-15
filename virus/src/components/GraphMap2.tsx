import { ForceGraph3D } from "react-force-graph";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Graph, Pessoa } from "../types/GraphTypes";
import { useGraph2 } from "../contexts/GraphContext2";
import MinHeap from "../utils/MinHeap";

export function GraphMap2() {
  const {
    graphData,
    showNames,
    startingNode,
    endingNode,
    setIsRunning,
    setStartingNode,
    setEndingNode,
  } = useGraph2();
  const graphRef = useRef<any>(null);

  const extraRenderers = [new CSS2DRenderer() as any];
  const [pessoas, setPessoas] = useState<Graph>(graphData);

  const handleSelectNode = (node: Pessoa) => {
    if (!startingNode) {
      setStartingNode(node);
    } else if (!endingNode) {
      setEndingNode(node);
    } else {
      setStartingNode(node);
      setEndingNode(null);
    }
  };

  const handleClick = useCallback(
    (node: Pessoa) => {
      setIsRunning(true);
      handleSelectNode(node);
      setIsRunning(false);
    },
    [pessoas, startingNode, endingNode]
  );

  const updateGraph = (nodes: Pessoa[]) => {
    const newNodes = [...nodes];

    newNodes.forEach((n) => {
      n.fx = n.x;
      n.fy = n.y;
      n.fz = n.z;
    });

    setPessoas((prevPessoas) => ({
      ...prevPessoas,
      nodes: newNodes,
    }));
  };

  useEffect(() => {
    setPessoas(graphData);

    graphRef.current.d3Force("link").distance(240);
  }, [graphData]);

  function Dijkstra(
    graph: Graph,
    source: Pessoa,
    end: Pessoa
  ): [Map<Pessoa, number>, Map<Pessoa, Pessoa | null>] {
    const Q = new MinHeap();
    const dist = new Map<Pessoa, number>();
    const prev = new Map<Pessoa, Pessoa | null>();

    graph.nodes.forEach((node) => {
      dist.set(node, Infinity);
      prev.set(node, null);
    });

    dist.set(source, 0);
    Q.insert(source, 0);

    while (!Q.isEmpty()) {}

    return [dist, prev];
  }

  function extractPath(
    prev: Map<Pessoa, Pessoa | null>,
    target: Pessoa
  ): Pessoa[] {
    const path: Pessoa[] = [];
    let u: Pessoa | null = target;

    while (u !== null) {
      path.unshift(u);
      u = prev.get(u)!;
    }

    return path;
  }

  return (
    <ForceGraph3D
      ref={graphRef}
      graphData={pessoas}
      onNodeClick={handleClick}
      nodeVal={15}
      linkLabel={(link) => `${link.weightLabel} contatos no mês`}
      linkThreeObjectExtend={true}
      linkThreeObject={(link) => {
        const containerEl = document.createElement("div");
        containerEl.style.position = "relative";
        containerEl.style.width = "32px";
        containerEl.style.height = "32px";

        const triangleEl = document.createElement("div");
        triangleEl.style.width = "0";
        triangleEl.style.height = "0";
        triangleEl.style.borderLeft = "16px solid transparent";
        triangleEl.style.borderRight = "16px solid transparent";
        triangleEl.style.borderBottom = "28px solid #8a72ea";
        containerEl.appendChild(triangleEl);

        const textEl = document.createElement("div");
        textEl.textContent = `${link.weightLabel}`;
        textEl.style.position = "absolute";
        textEl.style.top = "55%";
        textEl.style.left = "50%";
        textEl.style.transform = "translate(-50%, -50%)";
        textEl.style.color = "#fff";
        textEl.style.fontSize = "12px";
        textEl.style.fontWeight = "500";
        textEl.style.textAlign = "center";

        containerEl.appendChild(textEl);

        return new CSS2DObject(containerEl);
      }}
      linkPositionUpdate={(sprite: any, { start, end }: any) => {
        const middlePos = ["x", "y", "z"].reduce((acc, c) => {
          acc[c] = start[c] + (end[c] - start[c]) / 2;
          return acc;
        }, {} as { [key: string]: number });

        Object.assign(sprite.position, middlePos);
      }}
      linkOpacity={0.5}
      nodeColor={(node) => {
        if (startingNode && node.id === startingNode.id) {
          return "#FFCA80";
        } else if (endingNode && node.id === endingNode.id) {
          return "#FFCA80";
        } else if (node.isInfected) {
          return "#FF9580";
        } else if (node.isPath) {
          return "#FF80D5";
        } else {
          return "#80FFEA";
        }
      }}
      nodeLabel={(node) => `[${node.id}] ${node.name}`}
      nodeOpacity={0.9}
      nodeThreeObject={(node) => {
        if (showNames) {
          const nodeEl = document.createElement("div");
          nodeEl.textContent = `[${node.id}] ${node.name}`;
          nodeEl.style.color = "#fff";
          nodeEl.style.fontSize = "12px";
          nodeEl.style.fontWeight = "600";
          nodeEl.className = "node-label";
          return new CSS2DObject(nodeEl);
        }

        return new CSS2DObject(document.createElement("div"));
      }}
      nodeThreeObjectExtend={true}
      extraRenderers={extraRenderers}
      backgroundColor="#22212C"
    />
  );
}

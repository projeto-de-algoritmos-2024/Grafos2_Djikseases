import { ForceGraph3D } from "react-force-graph";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { useCallback, useEffect, useState } from "react";
import { Graph, Pessoa } from "../types/GraphTypes";
import { useGraph } from "../contexts/GraphContext";

interface GraphMapProps {
  hasSelectedInfection: boolean;
}

export function GraphMap({ hasSelectedInfection }: GraphMapProps) {
  const {
    graphData,
    setStartingNode,
    setEndingNode,
    startingNode,
    endingNode,
    selectedAlgorithm,
    showNames,
    triggerBFS,
    setTriggerBFS,
    setIsRunning,
  } = useGraph();

  const extraRenderers = [new CSS2DRenderer() as any];
  const [pessoas, setPessoas] = useState<Graph>(graphData);

  function getAdjacentNodes(
    adjacencyList: Record<
      number,
      {
        outgoing: { target: number; value: number }[];
        incoming: { source: number; value: number }[];
      }
    >,
    targetNodeId: any
  ): number[] {
    const adjacentNodes = new Set<number>();

    adjacencyList[targetNodeId].outgoing.forEach((connection) => {
      adjacentNodes.add(connection.target);
    });

    adjacencyList[targetNodeId].incoming.forEach((connection) => {
      adjacentNodes.add(connection.source);
    });

    return Array.from(adjacentNodes);
  }

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

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

  const BFS_GERAL = (nodeId: number) => {
    const queue = [nodeId];
    const newNodes = [...pessoas.nodes];
    newNodes[nodeId].isInfected = true;

    updateGraph(newNodes);

    const startInfection = () => {
      setTimeout(() => {
        processNode();
      }, 500);
    };

    const processNode = () => {
      if (queue.length === 0) {
        return;
      }

      const u = queue.shift();

      const adjNodes = getAdjacentNodes(pessoas.adjacencyList, u);
      let index = 0;

      const infectNode = () => {
        if (index < adjNodes.length) {
          const v = adjNodes[index];
          if (!newNodes[v].isInfected) {
            newNodes[v].isInfected = true;
            queue.push(v);

            index++;
            infectNode();
          } else {
            index++;
            infectNode();
          }
        } else {
          setTimeout(processNode, 100);
        }
      };

      infectNode();
      updateGraph(newNodes);
    };

    startInfection();
  };

  const BFS = (startNodeId: number, endNodeId: number) => {
    const queue = [startNodeId];
    const visited = new Set();
    const parent = Array(pessoas.nodes.length).fill(null);
    const newNodes = [...pessoas.nodes];

    visited.add(startNodeId);
    newNodes[startNodeId].isInfected = true;
    updateGraph(newNodes);

    const processQueue = async () => {
      while (queue.length > 0) {
        const currentNode = queue.shift();

        if (currentNode === endNodeId) {
          await delay(250);
          updateGraph(newNodes);
          return reconstructPath(parent, startNodeId, endNodeId);
        }

        const adjNodes = getAdjacentNodes(pessoas.adjacencyList, currentNode);
        for (const nextNode of adjNodes) {
          if (!visited.has(nextNode)) {
            visited.add(nextNode);
            queue.push(nextNode);
            parent[nextNode] = currentNode;
            newNodes[nextNode].isInfected = true;

            await delay(250);
            updateGraph(newNodes);
          }
        }
      }
      return [];
    };

    return processQueue();
  };

  const reconstructPath = (
    parent: number[],
    startNodeId: number,
    endNodeId: number
  ) => {
    let path = [];
    for (let at = endNodeId; at !== null; at = parent[at]) {
      if (at === undefined) return [];
      path.push(at);
    }
    path.reverse();

    if (path[0] === startNodeId) {
      return path.map((nodeId) => pessoas.nodes[nodeId]);
    } else {
      return [];
    }
  };

  const DFS_VISIT = async (node: Pessoa, newNodes: Pessoa[]) => {
    node.isInfected = true;
    updateGraph(newNodes);

    await delay(100);
    const adjNodes = getAdjacentNodes(pessoas.adjacencyList, node.id);

    for (const v of adjNodes) {
      if (!newNodes[v].isInfected) {
        await DFS_VISIT(newNodes[v], newNodes);
      }
    }
  };

  const DFS_GERAL = async (nodeId: number) => {
    const newNodes = [...pessoas.nodes];
    newNodes[nodeId].isInfected = true;
    updateGraph(newNodes);

    await delay(100);

    const adjNodes = getAdjacentNodes(pessoas.adjacencyList, nodeId);
    for (const v of adjNodes) {
      if (!newNodes[v].isInfected) {
        await DFS_VISIT(newNodes[v], newNodes);
      }
    }
  };

  const handleClick = useCallback(
    (node: Pessoa) => {
      if (!hasSelectedInfection) {
        setIsRunning(true);

        switch (selectedAlgorithm) {
          case "BFS":
            BFS_GERAL(node.id);
            break;
          case "DFS":
            DFS_GERAL(node.id);
            break;
          default:
            break;
        }

        setIsRunning(false);
      } else {
        handleSelectNode(node);
      }
    },
    [pessoas, selectedAlgorithm, hasSelectedInfection, startingNode, endingNode]
  );

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

  useEffect(() => {
    setPessoas(graphData);
  }, [graphData]);

  useEffect(() => {
    if (triggerBFS && startingNode && endingNode) {
      BFS(startingNode.id, endingNode.id).then(async (path) => {
        const newNodes = [...pessoas.nodes];

        newNodes.forEach((node) => {
          node.isInfected = false;
        });

        for (const node of path) {
          newNodes[node.id].isPath = true;
          await delay(250);
          updateGraph(newNodes);
        }
      });

      setTriggerBFS(false);
    }
  }, [triggerBFS, startingNode, endingNode]);

  return (
    <ForceGraph3D
      graphData={pessoas}
      onNodeClick={handleClick}
      nodeVal={15}
      linkLabel={(link) => `${link.weight}`}
      linkThreeObjectExtend={true}
      linkThreeObject={(link) => {
        const nodeEl = document.createElement("div");
        nodeEl.textContent = `${link.weight}`;
        nodeEl.style.color = "#fff";
        nodeEl.style.fontSize = "16px";
        nodeEl.style.fontWeight = "600";
        nodeEl.className = "node-label";
        return new CSS2DObject(nodeEl);
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

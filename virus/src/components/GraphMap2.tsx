import { ForceGraph3D } from 'react-force-graph';
import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Graph2, Pessoa } from '../types/GraphTypes';
import { useGraph2 } from '../contexts/GraphContext2';
import MinHeap from '../utils/MinHeap';

export function GraphMap2() {
  const {
    graphData,
    showNames,
    startingNode,
    endingNode,
    setIsRunning,
    setStartingNode,
    setEndingNode,
    triggerDijkstra,
    setTriggerDijkstra,
  } = useGraph2();
  const graphRef = useRef<any>(null);

  const extraRenderers = [new CSS2DRenderer() as any];
  const [pessoas, setPessoas] = useState<Graph2>(graphData);

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

  function getAdjacentNodes(
    connections: Record<
      number,
      {
        outgoing: { target: number; value: number }[];
        incoming: { source: number; value: number }[];
      }
    >,
    targetNodeId: number
  ): { node: Pessoa; value: number }[] {
    const adjacentNodes: { node: Pessoa; value: number }[] = [];

    connections[targetNodeId].outgoing.forEach((connection) => {
      const node = graphData.nodes.find((n) => n.id === connection.target);
      if (node) {
        adjacentNodes.push({ node, value: connection.value });
      }
    });

    connections[targetNodeId].incoming.forEach((connection) => {
      const node = graphData.nodes.find((n) => n.id === connection.source);
      if (node) {
        adjacentNodes.push({ node, value: connection.value });
      }
    });

    return adjacentNodes;
  }

  const handleClick = useCallback(
    (node: Pessoa) => {
      setIsRunning(true);

      if (startingNode && endingNode) {
        setIsRunning(false);
      } else {
        handleSelectNode(node);
      }
    },
    [graphData, startingNode, endingNode]
  );

  const updateGraph = (nodes: Pessoa[], links: any[]) => {
    const newNodes = [...nodes];
    const newLinks = [...links];

    newNodes.forEach((n) => {
      n.fx = n.x;
      n.fy = n.y;
      n.fz = n.z;
    });

    setPessoas((prevPessoas) => ({
      ...prevPessoas,
      nodes: newNodes,
      links: newLinks,
    }));
  };

  useEffect(() => {
    setPessoas(graphData);

    if (graphRef.current) {
      graphRef.current.d3Force('link').distance(240);
    }
  }, [graphData]);

  function Dijkstra(
    graph: Graph2,
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

    while (!Q.isEmpty()) {
      const u = Q.extractMin();
      if (u === null) break;

      const adjNodes = getAdjacentNodes(graph.connections, u.id);

      adjNodes.forEach((neighbor) => {
        const v = neighbor.node;
        const alt = dist.get(u)! + neighbor.value;
        if (alt < dist.get(v)!) {
          dist.set(v, alt);
          prev.set(v, u);

          if (Q.find(v) === null) {
            Q.insert(v, dist.get(v)!);
          } else {
            Q.decreaseKey(v, dist.get(v)!);
          }
        }
      });

      if (u.id === end.id) break;
    }

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

  function getPathLinks(path: Pessoa[], graph: Graph2) {
    const pathLinks: any[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const sourceNode = path[i];
      const targetNode = path[i + 1];
      const link = graph.links.find(
        (l) =>
          (l.source.id === sourceNode.id && l.target.id === targetNode.id) ||
          (l.source.id === targetNode.id && l.target.id === sourceNode.id)
      );
      if (link) {
        pathLinks.push(link);
      }
    }
    return pathLinks;
  }

  useEffect(() => {
    if (triggerDijkstra && startingNode && endingNode) {
      const [dist, prev] = Dijkstra(graphData, startingNode, endingNode);

      const path = extractPath(prev, endingNode);

      const newNodes = graphData.nodes.map((n) => ({
        ...n,
        isPath: path.includes(n),
      }));

      const pathLinks = getPathLinks(path, graphData);

      const newLinks = graphData.links.map((link) => ({
        ...link,
        isPathLink: pathLinks.includes(link),
      }));

      updateGraph(newNodes, newLinks);
      setTriggerDijkstra(false);
    }
  }, [triggerDijkstra, startingNode, endingNode]);

  return (
    <ForceGraph3D
      ref={graphRef}
      graphData={pessoas}
      onNodeClick={handleClick}
      nodeVal={15}
      linkLabel={(link) => `${link.weightLabel} contatos no mês`}
      linkThreeObjectExtend={true}
      linkThreeObject={(link) => {
        const containerEl = document.createElement('div');
        containerEl.style.position = 'relative';
        containerEl.style.width = '18px';
        containerEl.style.height = '18px';

        const triangleEl = document.createElement('div');
        triangleEl.style.width = '0';
        triangleEl.style.height = '0';
        triangleEl.style.borderLeft = '9px solid transparent';
        triangleEl.style.borderRight = '9px solid transparent';

        if (link.isPathLink) {
          triangleEl.style.borderBottom = '16px solid #FF80D5';
        } else {
          triangleEl.style.borderBottom = '16px solid #8a72ea';
        }

        containerEl.appendChild(triangleEl);

        const textEl = document.createElement('div');
        textEl.textContent = `${link.weightLabel}`;
        textEl.style.position = 'absolute';
        textEl.style.top = '55%';
        textEl.style.left = '50%';
        textEl.style.transform = 'translate(-50%, -50%)';
        textEl.style.color = '#fff';
        textEl.style.fontSize = '8px';
        textEl.style.fontWeight = '500';
        textEl.style.textAlign = 'center';

        containerEl.appendChild(textEl);

        return new CSS2DObject(containerEl);
      }}
      linkPositionUpdate={(sprite: any, { start, end }: any) => {
        const middlePos = ['x', 'y', 'z'].reduce((acc, c) => {
          acc[c] = start[c] + (end[c] - start[c]) / 2;
          return acc;
        }, {} as { [key: string]: number });

        Object.assign(sprite.position, middlePos);
      }}
      linkOpacity={0.5}
      linkColor={(link) => (link.isPathLink ? '#FF80D5' : '#8a72ea')}
      linkWidth={(link) => (link.isPathLink ? 2 : 0.2)}
      nodeColor={(node) => {
        if (startingNode && node.id === startingNode.id) {
          return '#f65252';
        } else if (endingNode && node.id === endingNode.id) {
          return '#f65252';
        } else if (node.isInfected) {
          return '#FF9580';
        } else if (node.isPath) {
          return '#FF80D5';
        } else {
          return '#80FFEA';
        }
      }}
      nodeLabel={(node) => `[${node.id}] ${node.name}`}
      nodeOpacity={0.9}
      nodeThreeObject={(node) => {
        if (showNames) {
          const nodeEl = document.createElement('div');
          nodeEl.textContent = `[${node.id}] ${node.name}`;
          nodeEl.style.color = '#fff';
          nodeEl.style.fontSize = '12px';
          nodeEl.style.fontWeight = '600';
          nodeEl.className = 'node-label';
          return new CSS2DObject(nodeEl);
        }

        return new CSS2DObject(document.createElement('div'));
      }}
      nodeThreeObjectExtend={true}
      extraRenderers={extraRenderers}
      backgroundColor="#22212C"
    />
  );
}

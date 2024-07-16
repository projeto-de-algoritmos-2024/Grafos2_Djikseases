import { Graph, Graph2 } from "../types/GraphTypes";

const names = [
  "Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gustavo", "Helena",
  "Igor", "Julia", "Kauê", "Letícia", "Marcelo", "Natalia", "Otávio", "Patrícia",
  "Quentin", "Rafaela", "Samuel", "Tatiane", "Umberto", "Vitória", "Wagner", "Xuxa",
  "Yasmin", "Zacarias"
];

export function getRandomAdjacencyList({ N = 10, maxConnectionFactor = 1, isolatedFactor = 0.5 } = {}): Graph {
  const nodes = Array.from({ length: N }, (_, id) => ({
    id,
    name: names[Math.floor(Math.random() * names.length)],
    val: Math.round(Math.random() * 10),
    isInfected: false,
    group: Math.floor(Math.random() * (1 / isolatedFactor))
  }));

  const groups = nodes.reduce((acc: any, node) => {
    acc[node.group] = acc[node.group] || [];
    acc[node.group].push(node.id);
    return acc;
  }, {});

  const adjacencyList = nodes.reduce((acc: any, node) => {
    acc[node.id] = { outgoing: [], incoming: [] };
    return acc;
  }, {});

  Object.values(groups).forEach((group: any) => {
    group.forEach((sourceId: any) => {
      const targetIds = group.filter((id: any) => id !== sourceId);
      const shuffleArray = (array: number[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };
      shuffleArray(targetIds);
      targetIds.slice(0, maxConnectionFactor).forEach((targetId: any) => {
        const value = Math.round(Math.random() * 10);
        adjacencyList[sourceId].outgoing.push({ target: targetId, value });
        adjacencyList[targetId].incoming.push({ source: sourceId, value });
      });
    });
  });

  const links = nodes.flatMap(node => adjacencyList[node.id].outgoing.map((link: any) => ({
    source: node.id,
    target: link.target,
    value: link.value,
    weight: link.value
  })));

  return { nodes, adjacencyList, links };
}

export function getConnectedGraph(N = 10): Graph2 {
  const nodes = Array.from({ length: N }, (_, id) => ({
    id,
    name: names[Math.floor(Math.random() * names.length)],
    val: Math.round(Math.random() * 10),
    isInfected: false,
    group: 0  // Todos os nós no mesmo grupo para garantir conexão
  }));

  const connections = nodes.reduce((acc: any, node) => {
    acc[node.id] = { outgoing: [], incoming: [] };
    return acc;
  }, {});

  // Adicionar conexões aleatórias para manter a conectividade parcial
  for (let i = 0; i < N; i++) {
    const numConnections = Math.floor(Math.random() * 2); // 0 a 1 conexões extras
    for (let j = 0; j < numConnections; j++) {
      const target = Math.floor(Math.random() * N);
      if (target !== i && !connections[i].outgoing.some((link: any) => link.target === target)) {
        const weight = Math.floor(Math.random() * 30) + 1;
        const complementaryWeight = 31 - weight;
        connections[i].outgoing.push({ target, value: complementaryWeight });
        connections[target].incoming.push({ source: i, value: complementaryWeight });
      }
    }
  }

  // Adicionar uma conexão para garantir que todos os nós estejam conectados indiretamente
  for (let i = 0; i < N - 1; i++) {
    if (!connections[i].outgoing.some((link: any) => link.target === i + 1)) {
      const weight = Math.floor(Math.random() * 30) + 1;
      const complementaryWeight = 31 - weight;
      connections[i].outgoing.push({ target: i + 1, value: complementaryWeight });
      connections[i + 1].incoming.push({ source: i, value: complementaryWeight });
    }
  }

  const links = nodes.flatMap(node => connections[node.id].outgoing.map((link: any) => ({
    source: node.id,
    target: link.target,
    value: 31 - link.value, // Valor complementar para algoritmo
    weightLabel: link.value // Valor original para label
  })));

  return { nodes, connections, links };
}

export interface Link {
  source: number;
  target: number;
  weightLabel: number;
  isPath?: boolean;
}

export interface Pessoa {
  id: number;
  name: string;
  val: number;
  isInfected?: boolean;
  x?: number;
  y?: number;
  z?: number;
  fx?: number;
  fy?: number;
  fz?: number;
  childLinks?: Link[];
  isPath?: boolean;
}
export interface Graph {
  nodes: Pessoa[];
  links: Link[];
  adjacencyList: Record<
    number,
    {
      outgoing: { target: number; value: number }[];
      incoming: { source: number; value: number }[];
    }
  >
}
export interface Graph2 {
  nodes: Pessoa[];
  links: Link[];
  connections: Record<
    number,
    {
      outgoing: { target: number; value: number }[];
      incoming: { source: number; value: number }[];
    }
  >
}

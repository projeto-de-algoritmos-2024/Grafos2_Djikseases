export interface Link {
  source: number;
  target: number;
}

export interface Pessoa {
  id: number;
  name: string;
  val: number;
  isInfected: boolean;
  x: number;
  y: number;
  z: number;
  fx: number;
  fy: number;
  fz: number;
  childLinks: Link[];
  isPath: boolean;
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

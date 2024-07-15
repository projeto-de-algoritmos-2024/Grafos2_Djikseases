import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getConnectedGraph } from '../utils/seed';
import { Graph, Pessoa } from '../types/GraphTypes';

interface GraphContextType {
  graphData: Graph;
  getGraphData: (N: number) => void;
  showNames: boolean;
  setShowNames: (value: boolean) => void;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  startingNode?: Pessoa | null;
  setStartingNode: (node: Pessoa | null) => void;
  endingNode?: Pessoa | null;
  setEndingNode: (node: Pessoa | null) => void;
}

const GraphContext2 = createContext<GraphContextType | undefined>(undefined);

export const GraphProvider2: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [graphData, setGraphData] = useState<Graph>(getConnectedGraph());
  const [showNames, setShowNames] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState(false);
  const [startingNode, setStartingNode] = useState<Pessoa | null>(null);
  const [endingNode, setEndingNode] = useState<Pessoa | null>(null);

  function getGraphData(N: number) {
    setGraphData(getConnectedGraph(N));
  }

  return (
    <GraphContext2.Provider
      value={{
        graphData,
        getGraphData,
        showNames,
        setShowNames,
        isRunning,
        setIsRunning,
        startingNode,
        setStartingNode,
        endingNode,
        setEndingNode,
      }}
    >
      {children}
    </GraphContext2.Provider>
  );
};

export function useGraph2(): GraphContextType {
  const context = useContext(GraphContext2);

  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider2');
  }

  const {
    graphData,
    getGraphData,
    showNames,
    setShowNames,
    isRunning,
    setIsRunning,
    startingNode,
    setStartingNode,
    endingNode,
    setEndingNode,
  } = context;

  return {
    graphData,
    getGraphData,
    showNames,
    setShowNames,
    isRunning,
    setIsRunning,
    startingNode,
    setStartingNode,
    endingNode,
    setEndingNode,
  };
}

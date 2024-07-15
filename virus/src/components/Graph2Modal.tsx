import { useEffect, useState } from 'react';
import { getConnectedGraph } from '../utils/seed';
import { useGraph2 } from '../contexts/GraphContext2';

interface IModelProps {
  hasSelectedInfection: boolean;
  setHasSelectedInfection: (value: boolean) => void;
  setSelectedGraph: (value: string) => void;
}

export function Graph2Modal({
  setHasSelectedInfection,
  setSelectedGraph,
}: IModelProps) {
  const {
    getGraphData,
    setShowNames,
    showNames,
    isRunning,
    startingNode,
    endingNode,
  } = useGraph2();
  const [components, setComponents] = useState(20);

  function handleClick() {
    if (components < 1) {
      alert('Número de pessoas deve ser um inteiro maior que 0');
      return;
    }

    getGraphData(components);
  }

  useEffect(() => {
    getConnectedGraph(components);
  }, []);

  return (
    <div className="w-[250px] bg-stone-800 absolute top-4 left-4 z-[1000] rounded-lg p-4 text-white border-violet-900 border-2 flex flex-col gap-4">
      <button
        onClick={() => setSelectedGraph('')}
        className=" bg-stone-900 text-white p-2 rounded-lg hover:bg-white hover:text-stone-900 transition-colors font-semibold"
      >
        Voltar
      </button>
      <h1 className="text-2xl font-semibold">
        Bem-Vindo(a) ao Grafo2 de Vírus
      </h1>
      <p className="text-xs text-stone-400 mt-2">
        Qual o caminho mais curto para que uma pessoa infecte outra de acordo
        com o contato diário?
      </p>
      <p className="text-xs text-stone-400">
        Os números nas arestas indicam quantas dias as pessoas envolvidas
        tiveram contato num período de 1 mês
      </p>

      <div className="mt-2 flex flex-col gap-2">
        <div className="flex gap-2 mb-2">
          <input
            type="checkbox"
            checked={showNames}
            onChange={() => setShowNames(!showNames)}
          />
          <label className="text-xs text-stone-300">Mostrar nomes</label>
        </div>
        <h1>Pessoas</h1>
        <input
          className="w-full p-2 rounded-lg bg-stone-700 focus:outline-none"
          placeholder="Número de pessoas"
          onChange={(e) => {
            setComponents(Number(e.target.value));
          }}
          value={components}
        />
        <button
          className="bg-stone-900 text-white p-2 rounded-lg mt-2 hover:bg-white hover:text-stone-900 transition-colors font-semibold disabled:bg-stone-700 disabled:text-stone-900 disabled:cursor-not-allowed"
          onClick={handleClick}
          disabled={isRunning}
        >
          Gerar Grafo
        </button>

        <div className="p-2 bg-stone-700 rounded mt-4">
          <h1 className="">Clique na pessoa que começará a infecção</h1>
          <input
            type="text"
            disabled
            className="mt-2 rounded p-1 w-full"
            value={startingNode?.name}
          />
        </div>
        <div className="p-2 bg-stone-700 rounded mt-2">
          <h1 className="">Clique na pessoa que deseja matar</h1>
          <input
            type="text"
            disabled
            className="mt-2 rounded p-1 w-full"
            value={endingNode?.name}
          />
        </div>

        <button
          className="bg-stone-900 text-white p-2 rounded-lg mt-4 hover:bg-white hover:text-stone-900 transition-colors font-semibold"
          // onClick={}
        >
          Infectar
        </button>
      </div>
    </div>
  );
}

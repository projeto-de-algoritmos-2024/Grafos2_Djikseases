import { useEffect, useState } from "react";
import { useGraph } from "../contexts/GraphContext";

interface IModelProps {
  hasSelectedInfection: boolean;
  setHasSelectedInfection: (value: boolean) => void;
}

export function Graph1Modal({ setHasSelectedInfection }: IModelProps) {
  const {
    getGraphData,
    selectedAlgorithm,
    setSelectedAlgorithm,
    showNames,
    setShowNames,
    isRunning,
  } = useGraph();
  const [components, setComponents] = useState(20);
  const [maxConnectionFactor, setMaxConnectionFactor] = useState(1);
  const [isolatedFactor, setIsolatedFactor] = useState(0.5);

  function handleClick() {
    if (components < 1) {
      alert("Número de pessoas deve ser um inteiro maior que 0");
      return;
    }

    if (maxConnectionFactor < 1) {
      alert("Fator de conexões máximas deve ser um inteiro maior que 0");
      return;
    }

    if (maxConnectionFactor > components - 1) {
      alert("Fator de conexões máximas deve ser menor que o número de pessoas");
      return;
    }

    if (isolatedFactor < 0 || isolatedFactor > 1) {
      alert("Fator de isolamento deve ser um número entre 0 e 1");
      return;
    }

    getGraphData(components, maxConnectionFactor, isolatedFactor);
  }

  return (
    <div className="w-[250px] bg-stone-800 absolute top-4 left-4 z-[1000] rounded-lg p-4 text-white border-violet-900 border-2">
      <h1 className="text-2xl font-semibold">Bem-Vindo(a) ao Grafo de Vírus</h1>
      <p className="text-xs text-stone-400 mt-2">
        O quão longe um vírus pode se espalhar por um grupo de pessoas?
      </p>
      <div className="p-2 bg-stone-700 mt-2 rounded">
        <p className="text-xs text-stone-300">
          Selecione um algoritmo e clique em qualquer pessoa para simular uma
          infecção:
        </p>
        <div className="flex gap-2 mt-2">
          <div
            className={
              selectedAlgorithm === "BFS"
                ? "text-xs font-bold px-2 bg-green-600 rounded cursor-pointer"
                : "text-xs font-bold px-2 bg-stone-600 rounded cursor-pointer"
            }
            onClick={() => setSelectedAlgorithm("BFS")}
          >
            BFS
          </div>
          <div
            className={
              selectedAlgorithm === "DFS"
                ? "text-xs font-bold px-2 bg-green-600 rounded cursor-pointer"
                : "text-xs font-bold px-2 bg-stone-600 rounded cursor-pointer"
            }
            onClick={() => setSelectedAlgorithm("DFS")}
          >
            DFS
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
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
        <h1>Fator de Conexões Máximas</h1>
        <input
          className="w-full p-2 rounded-lg bg-stone-700 focus:outline-none"
          placeholder="Número máximo de conexões"
          onChange={(e) => {
            setMaxConnectionFactor(Number(e.target.value));
          }}
          value={maxConnectionFactor}
        />
        <h1>Fator de Isolamento</h1>
        <input
          className="w-full p-2 rounded-lg bg-stone-700 focus:outline-none"
          placeholder="Probabilidade de isolamento"
          onChange={(e) => {
            setIsolatedFactor(e.target.value as any);
          }}
          value={isolatedFactor}
        />
        <button
          className="bg-stone-900 text-white p-2 rounded-lg mt-2 hover:bg-white hover:text-stone-900 transition-colors font-semibold disabled:bg-stone-700 disabled:text-stone-900 disabled:cursor-not-allowed"
          onClick={handleClick}
          disabled={isRunning}
        >
          Gerar Grafo
        </button>
        <p className="text-xs text-stone-300">
          Ou, caso deseja infectar uma pessoa a partir de outra:
        </p>
        <button
          className="bg-stone-900 text-white p-2 rounded-lg mt-2 hover:bg-white hover:text-stone-900 transition-colors font-semibold"
          onClick={() => setHasSelectedInfection(true)}
        >
          Infectar
        </button>
      </div>
    </div>
  );
}

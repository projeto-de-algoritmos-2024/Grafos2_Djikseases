import { useGraph } from '../contexts/GraphContext';

interface IInfectionModalProps {
  hasSelectedInfection: boolean;
  setHasSelectedInfection: (value: boolean) => void;
}

export function InfectionModal({
  setHasSelectedInfection,
}: IInfectionModalProps) {
  const {
    setStartingNode,
    startingNode,
    setEndingNode,
    endingNode,
    setTriggerBFS,
  } = useGraph();

  const handleReturn = () => {
    setStartingNode(null);
    setEndingNode(null);
    setHasSelectedInfection(false);
  };

  return (
    <div className="w-[250px] bg-stone-800 absolute top-4 left-4 z-[1000] rounded-lg p-4 text-white border-violet-900 border-2">
      <h1 className="text-2xl font-semibold">Vírus</h1>
      <div className="mt-4 flex flex-col gap-2">
        {/* <div className="mb-4">
          <p className="text-xs text-stone-300">
            Selecione um algoritmo e clique em qualquer pessoa para simular uma
            infecção:
          </p>
          <div className="flex gap-2 mt-2">
            <div
              className={
                selectedAlgorithm === 'BFS'
                  ? 'text-xs font-bold px-2 bg-green-600 rounded cursor-pointer'
                  : 'text-xs font-bold px-2 bg-stone-600 rounded cursor-pointer'
              }
              onClick={() => setSelectedAlgorithm('BFS')}
            >
              BFS
            </div>
            <div
              className={
                selectedAlgorithm === 'DFS'
                  ? 'text-xs font-bold px-2 bg-green-600 rounded cursor-pointer'
                  : 'text-xs font-bold px-2 bg-stone-600 rounded cursor-pointer'
              }
              onClick={() => setSelectedAlgorithm('DFS')}
            >
              DFS
            </div>
          </div>
        </div> */}
        <div className="p-2 bg-stone-700 rounded">
          <h1 className="">Clique na pessoa que começará a infecção</h1>
          <input
            type="text"
            disabled
            className="mt-2 rounded p-1 w-full"
            value={startingNode?.name}
          />
        </div>
        <div className="p-2 bg-stone-700 rounded">
          <h1 className="">Clique na pessoa que deseja matar</h1>
          <input
            type="text"
            disabled
            className="mt-2 rounded p-1 w-full"
            value={endingNode?.name}
          />
        </div>

        <button
          className="bg-stone-900 text-white p-2 rounded-lg mt-2 hover:bg-white hover:text-stone-900 transition-colors font-semibold"
          onClick={() => setTriggerBFS(true)}
        >
          Infectar
        </button>
        <button
          className="bg-stone-900 text-white p-2 rounded-lg mt-2 hover:bg-white hover:text-stone-900 transition-colors font-semibold"
          onClick={handleReturn}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

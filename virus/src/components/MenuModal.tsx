interface IMenuModalProps {
  selectedGraph?: string;
  setSelectedGraph: (value: string) => void;
}

export function MenuModal({ setSelectedGraph }: IMenuModalProps) {
  return (
    <div className="w-[250px] bg-stone-800 absolute top-4 left-4 z-[1000] rounded-lg p-4 text-white border-violet-900 border-2">
      <h1 className="text-2xl font-semibold">Bem-Vindo(a) ao Grafo de Vírus</h1>
      <p className="text-xs text-stone-400 mt-2">
        O quão longe um vírus pode se espalhar por um grupo de pessoas?
      </p>
      <div className="p-2 bg-stone-700 mt-2 rounded">
        <p className="text-xs text-stone-300">
          Selecione qual conteudo deseja visualizar:
        </p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setSelectedGraph("grafos1")}>Grafos 1</button>
          <button onClick={() => setSelectedGraph("grafos2")}>Grafos 2</button>
        </div>
      </div>
    </div>
  );
}

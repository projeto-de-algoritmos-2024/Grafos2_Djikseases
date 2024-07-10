import "./App.css";
import { Graph1Modal } from "./components/Graph1Modal";
import { Graph2Modal } from "./components/Graph2Modal";
import { GraphMap } from "./components/GraphMap";
import { GraphProvider } from "./contexts/GraphContext";
import { useState } from "react";
import { InfectionModal } from "./components/InfectionModal";
import { MenuModal } from "./components/MenuModal";

function App() {
  const [hasSelectedInfection, setHasSelectedInfection] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState("");

  return (
    <GraphProvider>
      <div className="w-screen h-screen overflow-hidden">
        <MenuModal setSelectedGraph={setSelectedGraph} />
        {selectedGraph === "grafos1" ? (
          hasSelectedInfection ? (
            <InfectionModal
              hasSelectedInfection={hasSelectedInfection}
              setHasSelectedInfection={setHasSelectedInfection}
            />
          ) : (
            <Graph1Modal
              hasSelectedInfection={hasSelectedInfection}
              setHasSelectedInfection={setHasSelectedInfection}
              setSelectedGraph={setSelectedGraph}
            />
          )
        ) : selectedGraph === "grafos2" ? (
          <Graph2Modal
            hasSelectedInfection={hasSelectedInfection}
            setHasSelectedInfection={setHasSelectedInfection}
            setSelectedGraph={setSelectedGraph}
          />
        ) : null}
        <GraphMap hasSelectedInfection={hasSelectedInfection} />
      </div>
    </GraphProvider>
  );
}

export default App;

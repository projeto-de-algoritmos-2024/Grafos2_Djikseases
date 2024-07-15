import './App.css';
import { Graph1Modal } from './components/Graph1Modal';
import { Graph2Modal } from './components/Graph2Modal';
import { GraphMap } from './components/GraphMap';
import { GraphProvider } from './contexts/GraphContext';
import { useState } from 'react';
import { InfectionModal } from './components/InfectionModal';
import { MenuModal } from './components/MenuModal';
import { GraphMap2 } from './components/GraphMap2';
import { GraphProvider2 } from './contexts/GraphContext2';

function App() {
  const [hasSelectedInfection, setHasSelectedInfection] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState('');

  return (
    <GraphProvider>
      <GraphProvider2>
        <div className="w-screen h-screen overflow-hidden">
          <MenuModal setSelectedGraph={setSelectedGraph} />
          {selectedGraph === 'grafos1' ? (
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
          ) : selectedGraph === 'grafos2' ? (
            <Graph2Modal
              hasSelectedInfection={hasSelectedInfection}
              setHasSelectedInfection={setHasSelectedInfection}
              setSelectedGraph={setSelectedGraph}
            />
          ) : null}
          {selectedGraph === 'grafos2' ? (
            <GraphMap2 />
          ) : (
            <GraphMap hasSelectedInfection={hasSelectedInfection} />
          )}
        </div>
      </GraphProvider2>
    </GraphProvider>
  );
}

export default App;

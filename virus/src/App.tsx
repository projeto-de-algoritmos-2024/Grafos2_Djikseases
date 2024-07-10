import './App.css';
import { Modal } from './components/Modal';
import { GraphMap } from './components/GraphMap';
import { GraphProvider } from './contexts/GraphContext';
import { useState } from 'react';
import { InfectionModal } from './components/InfectionModal';

function App() {
  const [hasSelectedInfection, setHasSelectedInfection] = useState(false);

  return (
    <GraphProvider>
      <div className="w-screen h-screen overflow-hidden">
        {hasSelectedInfection ? (
          <InfectionModal
            hasSelectedInfection={hasSelectedInfection}
            setHasSelectedInfection={setHasSelectedInfection}
          />
        ) : (
          <Modal
            hasSelectedInfection={hasSelectedInfection}
            setHasSelectedInfection={setHasSelectedInfection}
          />
        )}
        <GraphMap hasSelectedInfection={hasSelectedInfection} />
      </div>
    </GraphProvider>
  );
}

export default App;

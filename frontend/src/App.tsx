import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InventoryPanel } from './components/InventoryPanel';
import { MapPanel } from './components/MapPanel';
import { DecisionPanel } from './components/DecisionPanel';
import { Footer } from './components/Footer';

// Mock data
const mockInventory = [
  {
    id: '1',
    name: 'Electronics Components',
    location: 'Warehouse A',
    currentStock: 50,
    maxStock: 500,
    minStock: 100,
    replenishmentTriggered: true
  },
  {
    id: '2',
    name: 'Automotive Parts',
    location: 'Store 1',
    currentStock: 250,
    maxStock: 400,
    minStock: 80,
    replenishmentTriggered: false
  },
  {
    id: '3',
    name: 'Medical Supplies',
    location: 'Store 2',
    currentStock: 15,
    maxStock: 200,
    minStock: 50,
    replenishmentTriggered: true
  },
  {
    id: '4',
    name: 'Consumer Goods',
    location: 'Warehouse B',
    currentStock: 180,
    maxStock: 300,
    minStock: 60,
    replenishmentTriggered: false
  }
];

const mockDecisions = [
  {
    id: '1',
    agent: 'Inventory Agent',
    action: 'Triggered emergency replenishment for Medical Supplies',
    timestamp: '2 mins ago',
    confidence: 95,
    reasoning: 'Stock level dropped below critical threshold (7.5% remaining). Historical demand patterns indicate 3-day lead time required.',
    impact: 'Prevents stockout scenario. Estimated cost: $2,400. Revenue protection: $18,000.'
  },
  {
    id: '2',
    agent: 'Routing Agent',
    action: 'Rerouted delivery truck T2 due to weather disruption',
    timestamp: '5 mins ago',
    confidence: 78,
    reasoning: 'Weather alert detected on primary route. Alternative route adds 15 minutes but maintains delivery schedule.',
    impact: 'Maintains on-time delivery. Additional fuel cost: $12. Customer satisfaction preserved.'
  },
  {
    id: '3',
    agent: 'Demand Agent',
    action: 'Adjusted demand forecast for Electronics Components',
    timestamp: '12 mins ago',
    confidence: 85,
    reasoning: 'Detected 23% increase in local demand based on recent sales patterns and competitor analysis.',
    impact: 'Proactive inventory adjustment. Prevents potential stockout. Estimated revenue capture: $5,200.'
  },
  {
    id: '4',
    agent: 'Inventory Agent',
    action: 'Optimized stock levels for Consumer Goods',
    timestamp: '18 mins ago',
    confidence: 72,
    reasoning: 'Seasonal demand pattern analysis suggests reducing safety stock by 15% to optimize storage costs.',
    impact: 'Reduces holding costs by $890/month. Maintains 99.2% service level.'
  }
];

function App() {
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleSimulation = () => {
    setSimulationRunning(!simulationRunning);
  };

  const handleTriggerDisruption = () => {
    // Mock disruption trigger
    console.log('Disruption triggered');
  };

  const handleFastForward = () => {
    // Mock fast forward
    console.log('Fast forward activated');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <Header
        simulationRunning={simulationRunning}
        activeAgents={3}
        lastAction={formatTime(currentTime)}
        darkMode={darkMode}
      />
      
      <main className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="xl:col-span-1">
            <InventoryPanel inventory={mockInventory} darkMode={darkMode} />
          </div>
          
          <div className="xl:col-span-1">
            <MapPanel routes={[]} disruptions={[]} darkMode={darkMode} />
          </div>
          
          <div className="xl:col-span-1">
            <DecisionPanel decisions={mockDecisions} darkMode={darkMode} />
          </div>
        </div>
      </main>
      
      <Footer
        simulationRunning={simulationRunning}
        onToggleSimulation={handleToggleSimulation}
        onTriggerDisruption={handleTriggerDisruption}
        onFastForward={handleFastForward}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    </div>
  );
}

export default App;
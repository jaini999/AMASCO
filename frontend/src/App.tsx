import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InventoryPanel } from './components/InventoryPanel';
import { MapPanel } from './components/MapPanel';
import { DecisionPanel } from './components/DecisionPanel';
import { Footer } from './components/Footer';

const BACKEND_URL = "http://localhost:8000"; // Change if backend runs on a different port

interface InventoryItem {
  id: string;
  name: string;
  location: string;
  currentStock: number;
  maxStock: number;
  minStock: number;
  replenishmentTriggered: boolean;
  recentlyDisrupted: boolean;
}

interface RouteItem {
  truck: string;
  from: string;
  to: string;
  route: string;
}

interface DisruptionItem {
  type: string;
  location: string;
  severity: string;
  timestamp: string;
}

interface DecisionItem {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  reasoning: string;
  impact: string;
}

function App() {
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [disruptions, setDisruptions] = useState<DisruptionItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);

  // Poll backend for data every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Inventory
        const invRes = await fetch(`${BACKEND_URL}/inventory`);
        const invData = await invRes.json();

        // Logs/Decisions (fetch once)
        const logsRes = await fetch(`${BACKEND_URL}/logs`);
        const logs = await logsRes.json();
        // Find recently disrupted stores from the last 10 logs, but clear highlight if a restock happened after the disruption
        const recentLogs = logs.slice(-20).reverse(); // Most recent first
        const disruptedStores = new Set<string>();
        const restockedStores = new Set<string>();
        for (const log of recentLogs) {
          if (log.action === 'restock' && log.agent === 'InventoryAgent') {
            restockedStores.add(log.target);
          }
          if (log.action === 'inventory_disruption' && !restockedStores.has(log.target)) {
            disruptedStores.add(log.target);
          }
        }
        // Map backend inventory to InventoryPanel format, add recentlyDisrupted
        const invArr: InventoryItem[] = Object.entries(invData).map(([store, data], idx) => {
          const d = data as { stock: number; threshold: number };
          return {
            id: String(idx + 1),
            name: store,
            location: store,
            currentStock: d.stock,
            maxStock: d.threshold * 2, // Assume max is double threshold for demo
            minStock: d.threshold,
            replenishmentTriggered: d.stock < d.threshold,
            recentlyDisrupted: disruptedStores.has(store)
          };
        });
        setInventory(invArr);

        // Routes
        const routesRes = await fetch(`${BACKEND_URL}/routes`);
        setRoutes(await routesRes.json());

        // Disruptions
        const disruptionsRes = await fetch(`${BACKEND_URL}/disruptions`);
        setDisruptions(await disruptionsRes.json());

        // Map logs to DecisionPanel format, filtering out 'disruption_check' actions and all DisruptionAgent logs
        const mappedDecisions: DecisionItem[] = logs
          .filter((log: any) => log.action !== 'disruption_check' && log.agent !== 'DisruptionAgent')
          .slice(-20)
          .reverse()
          .map((log: any, idx: number) => ({
            id: String(idx + 1),
            agent: log.agent || 'Agent',
            action: log.action === 'reroute' ? 'ReRouting' : log.action === 'restock' ? 'ReStock' : (log.action || ''),
            timestamp: log.timestamp ? new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
            reasoning: log.explanation || log.details || ''
          }));
        setDecisions(mappedDecisions);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSimulation = async () => {
    await fetch(`${BACKEND_URL}/pause`, { method: "POST" });
    setSimulationRunning((prev) => !prev);
  };

  const handleTriggerDisruption = async () => {
    await fetch(`${BACKEND_URL}/trigger-disruption`, { method: "POST" });
  };

  const handleFastForward = async () => {
    await fetch(`${BACKEND_URL}/fast-forward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n: 5 }),
    });
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
            <InventoryPanel inventory={inventory} darkMode={darkMode} />
          </div>
          
          <div className="xl:col-span-1">
            <MapPanel routes={routes} disruptions={disruptions} darkMode={darkMode} />
          </div>
          
          <div className="xl:col-span-1">
            <DecisionPanel decisions={decisions} darkMode={darkMode} />
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
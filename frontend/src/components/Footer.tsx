import React from 'react';
import { Play, Pause, FastForward, Zap, Moon, Sun } from 'lucide-react';

interface FooterProps {
  simulationRunning: boolean;
  onToggleSimulation: () => void;
  onTriggerDisruption: () => void;
  onFastForward: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  simulationRunning,
  onToggleSimulation,
  onTriggerDisruption,
  onFastForward,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <footer className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border-t px-6 py-4`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              simulationRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {simulationRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Simulation
              </>
            )}
          </button>
          
          <button
            onClick={onTriggerDisruption}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-amber-500 hover:bg-amber-600 text-white transition-all"
          >
            <Zap className="w-4 h-4" />
            Trigger Disruption
          </button>
          
          <button
            onClick={onFastForward}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
          >
            <FastForward className="w-4 h-4" />
            Fast Forward
          </button>
        </div>
        
        <button
          onClick={onToggleDarkMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            darkMode 
              ? 'bg-zinc-700 hover:bg-zinc-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Dark Mode
            </>
          )}
        </button>
      </div>
    </footer>
  );
};
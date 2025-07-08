import React from 'react';
import { Activity, Users, Clock } from 'lucide-react';

interface HeaderProps {
  simulationRunning: boolean;
  activeAgents: number;
  lastAction: string;
  darkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ simulationRunning, activeAgents, lastAction, darkMode = true }) => {
  return (
    <header className={`${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AMASCO
          </h1>
          <p className={`text-sm lg:text-base ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
            Autonomous Multi-Agent Supply Chain Orchestrator
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            simulationRunning 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <Activity className="w-4 h-4" />
            Simulation: {simulationRunning ? 'Running' : 'Stopped'}
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Users className="w-4 h-4" />
            Agents Active: {activeAgents}
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
            darkMode 
              ? 'bg-zinc-800 text-zinc-300 border-zinc-700' 
              : 'bg-gray-100 text-gray-700 border-gray-300'
          }`}>
            <Clock className="w-4 h-4" />
            Last Action: {lastAction}
          </div>
        </div>
      </div>
    </header>
  );
};
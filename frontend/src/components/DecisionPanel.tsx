import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Bot } from 'lucide-react';

interface Decision {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  reasoning: string;
  impact: string;
  isNew?: boolean;
}

interface DecisionPanelProps {
  decisions: Decision[];
  darkMode?: boolean;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ decisions, darkMode = true }) => {
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);

  const toggleExpanded = (decisionId: string) => {
    setExpandedDecision(expandedDecision === decisionId ? null : decisionId);
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'Inventory Agent': return 'bg-blue-500/20 text-blue-400';
      case 'Routing Agent': return 'bg-purple-500/20 text-purple-400';
      case 'Demand Agent': return 'bg-emerald-500/20 text-emerald-400';
      default: return darkMode ? 'bg-zinc-500/20 text-zinc-400' : 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} rounded-lg p-6 h-full border`}>
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Decision Log</h2>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {decisions.map((decision) => (
          <div key={decision.id} className={`${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'} rounded-lg border overflow-hidden transition-all duration-300 ${
            decision.isNew 
              ? 'ring-2 ring-blue-400 ring-opacity-75 animate-pulse bg-blue-500/10 border-blue-400/50' 
              : ''
          }`}>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAgentColor(decision.agent)}`}>
                      {decision.agent}
                    </span>
                    {decision.isNew && (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{decision.timestamp}</span>
              </div>
              
              <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{decision.action}</p>
              
              <div className="flex items-center justify-between">
                
                <button
                  onClick={() => toggleExpanded(decision.id)}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Explain
                  {expandedDecision === decision.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {expandedDecision === decision.id && (
              <div className={`border-t p-4 ${darkMode ? 'border-zinc-700 bg-black/50' : 'border-gray-200 bg-gray-100/50'}`}>
                <div className="space-y-3">
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>Agent:</h4>
                    <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{decision.reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
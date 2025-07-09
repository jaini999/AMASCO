import React from 'react';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  location: string;
  currentStock: number;
  maxStock: number;
  minStock: number;
  replenishmentTriggered: boolean;
  recentlyDisrupted?: boolean;
}

interface InventoryPanelProps {
  inventory: InventoryItem[];
  darkMode?: boolean;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, darkMode = true }) => {
  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 30) return 'warning';
    return 'healthy';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500/10 border-red-500/30';
      case 'warning': return 'bg-amber-500/10 border-amber-500/30';
      default: return 'bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} rounded-lg p-6 h-full border`}>
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Inventory Dashboard</h2>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {inventory.map((item) => {
          const status = getStockStatus(item);
          const percentage = (item.currentStock / item.maxStock) * 100;
          const highlight = item.recentlyDisrupted;
          return (
            <div key={item.id} className={`p-4 rounded-lg border ${getStatusBg(status)} ${highlight ? 'border-amber-400 ring-2 ring-amber-300 animate-pulse' : ''} ${darkMode ? 'hover:bg-zinc-700/50' : 'hover:bg-gray-50'} transition-colors`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{item.location}</p>
                </div>
                {highlight && (
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
                )}
                {status === 'critical' && !highlight && (
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                {item.replenishmentTriggered && (
                  <div className="flex items-center gap-1 text-xs text-blue-400">
                    <TrendingUp className="w-3 h-3" />
                    Replenishing
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-zinc-300' : 'text-gray-700'}>Stock Level</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.currentStock} / {item.maxStock}
                  </span>
                </div>
                
                <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(status)}`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
                
                <div className={`flex justify-between text-xs ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                  <span>Min: {item.minStock}</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
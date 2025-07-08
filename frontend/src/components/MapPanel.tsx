import React from 'react';
import { Map, Truck, AlertCircle, Route, MapPin } from 'lucide-react';

interface MapPanelProps {
  routes: any[];
  disruptions: any[];
  darkMode?: boolean;
}

export const MapPanel: React.FC<MapPanelProps> = ({ routes, disruptions, darkMode = true }) => {
  return (
    <div className={`${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} rounded-lg p-6 h-full border`}>
      <div className="flex items-center gap-3 mb-6">
        <Map className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Supply Chain Map</h2>
      </div>
      
      {/* Map Container */}
      <div className={`${darkMode ? 'bg-black border-zinc-700' : 'bg-gray-50 border-gray-200'} rounded-lg border h-64 relative overflow-hidden mb-6`}>
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className={`border ${darkMode ? 'border-zinc-600' : 'border-gray-300'}`} />
            ))}
          </div>
        </div>
        
        {/* Routes */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
          </defs>
          
          {/* Active Route */}
          <path 
            d="M 50 50 Q 150 100 250 80 Q 350 60 450 120" 
            stroke="#3B82F6" 
            strokeWidth="3" 
            fill="none"
            markerEnd="url(#arrowhead)"
            className="animate-pulse"
          />
          
          {/* Disrupted Route */}
          <path 
            d="M 100 180 Q 200 140 300 160 Q 400 180 500 150" 
            stroke="#EF4444" 
            strokeWidth="3" 
            fill="none"
            strokeDasharray="10,5"
          />
        </svg>
        
        {/* Delivery Points */}
        <div className="absolute top-12 left-12">
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full px-3 py-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Warehouse A</span>
          </div>
        </div>
        
        <div className="absolute top-20 right-16">
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 rounded-full px-3 py-1">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Store 1</span>
          </div>
        </div>
        
        <div className="absolute bottom-16 left-1/3">
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 rounded-full px-3 py-1">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Store 2</span>
          </div>
        </div>
        
        {/* Trucks */}
        <div className="absolute top-16 left-32 animate-pulse">
          <div className={`flex items-center gap-1 border rounded-full px-2 py-1 ${darkMode ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-gray-300'}`}>
            <Truck className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs">T1</span>
          </div>
        </div>
        
        <div className="absolute bottom-24 right-1/3">
          <div className={`flex items-center gap-1 border rounded-full px-2 py-1 ${darkMode ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-gray-300'}`}>
            <Truck className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs">T2</span>
          </div>
        </div>
        
        {/* Disruption */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-3 py-1 animate-pulse">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Weather Alert</span>
          </div>
        </div>
      </div>
      
      {/* Route Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
          <div className="flex items-center gap-3 mb-3">
            <Route className="w-5 h-5 text-blue-400" />
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Active Routes</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-zinc-300' : 'text-gray-700'}>Route A → Store 1</span>
              <span className="text-emerald-400">On Time</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-zinc-300' : 'text-gray-700'}>Route B → Store 2</span>
              <span className="text-amber-400">Delayed</span>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Disruptions</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-zinc-300' : 'text-gray-700'}>Weather Alert</span>
              <span className="text-red-400">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-zinc-300' : 'text-gray-700'}>Route Closure</span>
              <span className="text-amber-400">Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
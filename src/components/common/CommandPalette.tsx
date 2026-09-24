import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Package,
  Grid,
  Zap,
  Box,
  Thermometer,
  Sparkles,
  DoorOpen,
  DoorClosed,
  RotateCcw,
  Plus,
  Truck,
  Flame,
  Sun,
  Layers,
} from 'lucide-react';
import { useColdStorage, NavigationTab } from '../../context/ColdStorageContext';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTab,
    crates,
    zones,
    setSelectedCrateId,
    toggleDoor,
    isDoorOpen,
    toggleHeatwave,
    toggleCloudCover,
    triggerDefrost,
    setCopilotOpen,
  } = useColdStorage();

  const [query, setQuery] = useState('');

  if (!commandPaletteOpen) return null;

  const actions = [
    {
      id: 'nav-dashboard',
      label: 'Navigate: Operations Dashboard',
      category: 'Navigation',
      icon: Layers,
      run: () => setActiveTab('dashboard'),
    },
    {
      id: 'nav-digitaltwin',
      label: 'Navigate: 2.5D Digital Twin Chamber',
      category: 'Navigation',
      icon: Box,
      run: () => setActiveTab('digitaltwin'),
    },
    {
      id: 'nav-inventory',
      label: 'Navigate: Crop Inventory Management',
      category: 'Navigation',
      icon: Package,
      run: () => setActiveTab('inventory'),
    },
    {
      id: 'nav-solar',
      label: 'Navigate: Solar & Battery Microgrid',
      category: 'Navigation',
      icon: Sun,
      run: () => setActiveTab('energy'),
    },
    {
      id: 'nav-environment',
      label: 'Navigate: Multi-Zone Telemetry',
      category: 'Navigation',
      icon: Thermometer,
      run: () => setActiveTab('environment'),
    },
    {
      id: 'act-door',
      label: isDoorOpen ? 'IoT Action: Seal Cold Room Door' : 'IoT Action: Simulate Door Ajar',
      category: 'Hardware Control',
      icon: isDoorOpen ? DoorClosed : DoorOpen,
      run: () => toggleDoor(),
    },
    {
      id: 'act-defrost',
      label: 'Refrigeration: Trigger Evaporator Hot-Gas Defrost',
      category: 'Hardware Control',
      icon: RotateCcw,
      run: () => triggerDefrost(),
    },
    {
      id: 'act-copilot',
      label: 'ColdChain AI: Open Operations Copilot',
      category: 'AI Intelligence',
      icon: Sparkles,
      run: () => setCopilotOpen(true),
    },
    {
      id: 'act-heatwave',
      label: 'Simulation: Toggle 36.5°C Heatwave',
      category: 'Simulation',
      icon: Flame,
      run: () => toggleHeatwave(),
    },
    {
      id: 'act-cloud',
      label: 'Simulation: Toggle Passing Cloud Cover',
      category: 'Simulation',
      icon: Sun,
      run: () => toggleCloudCover(),
    },
  ];

  // Also include matching crates in search
  const matchingCrates = crates
    .filter(
      (c) =>
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.crop.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      id="command-palette-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 p-4 pt-20 backdrop-blur-xs"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        id="command-palette-modal"
        className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search crates, zones, actions... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-hidden"
          />
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {matchingCrates.length > 0 && query && (
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Matching Crates:
            </div>
          )}

          {matchingCrates.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCrateId(c.id);
                setCommandPaletteOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-800 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-emerald-400" />
                <span className="font-mono font-bold text-white">{c.id}</span>
                <span>{c.crop}</span>
                <span className="text-slate-400">({c.weightKg} kg)</span>
              </div>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                {c.zoneId.replace('_', ' ')}
              </span>
            </button>
          ))}

          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
            Commands & Actions:
          </div>

          {filteredActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  act.run();
                  setCommandPaletteOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-white">{act.label}</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                  {act.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

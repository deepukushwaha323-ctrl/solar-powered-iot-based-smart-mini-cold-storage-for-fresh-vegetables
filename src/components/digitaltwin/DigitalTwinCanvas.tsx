import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Thermometer,
  Droplets,
  AlertTriangle,
  Zap,
  Wind,
  Eye,
  Info,
  ChevronRight,
  Maximize2,
  Flame,
} from 'lucide-react';
import { useColdStorage, DigitalTwinVisualMode } from '../../context/ColdStorageContext';
import { Crate } from '../../types';

export const DigitalTwinCanvas: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    crates,
    zones,
    digitalTwinMode,
    setDigitalTwinMode,
    selectedZoneId,
    setSelectedZoneId,
    setSelectedCrateId,
  } = useColdStorage();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewAngle, setViewAngle] = useState<'ISOMETRIC' | 'TOP_DOWN' | 'FRONT'>('ISOMETRIC');
  const [hoveredCrate, setHoveredCrate] = useState<Crate | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter crates if a zone is selected
  const filteredZones = selectedZoneId ? zones.filter((z) => z.id === selectedZoneId) : zones;

  const visualModes: { mode: DigitalTwinVisualMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'NORMAL', label: 'Standard', icon: Eye },
    { mode: 'TEMPERATURE', label: 'Thermal', icon: Thermometer },
    { mode: 'HUMIDITY', label: 'Humidity', icon: Droplets },
    { mode: 'SPOILAGE_RISK', label: 'Risk Heatmap', icon: AlertTriangle },
    { mode: 'ETHYLENE', label: 'Ethylene Matrix', icon: Flame },
    { mode: 'ENERGY', label: 'Cooling Load', icon: Zap },
    { mode: 'AIRFLOW', label: 'Airflow Vectors', icon: Wind },
  ];

  const getCrateColorByMode = (crate: Crate): { bg: string; border: string; text: string } => {
    switch (digitalTwinMode) {
      case 'TEMPERATURE':
        if (crate.temperatureC > 5.5) return { bg: 'bg-red-500/80', border: 'border-red-400', text: 'text-white' };
        if (crate.temperatureC > 4.2) return { bg: 'bg-amber-500/80', border: 'border-amber-400', text: 'text-slate-950' };
        if (crate.temperatureC < 1.5) return { bg: 'bg-cyan-600/80', border: 'border-cyan-300', text: 'text-white' };
        return { bg: 'bg-emerald-500/80', border: 'border-emerald-400', text: 'text-slate-950' };

      case 'HUMIDITY':
        if (crate.humidityPct < 85) return { bg: 'bg-amber-500/80', border: 'border-amber-400', text: 'text-slate-950' };
        if (crate.humidityPct > 94) return { bg: 'bg-blue-600/80', border: 'border-blue-400', text: 'text-white' };
        return { bg: 'bg-teal-500/80', border: 'border-teal-300', text: 'text-slate-950' };

      case 'SPOILAGE_RISK':
        if (crate.spoilageRiskPct > 75) return { bg: 'bg-red-600 animate-pulse', border: 'border-red-400', text: 'text-white' };
        if (crate.spoilageRiskPct > 45) return { bg: 'bg-amber-500/90', border: 'border-amber-300', text: 'text-slate-950' };
        if (crate.spoilageRiskPct > 20) return { bg: 'bg-yellow-500/80', border: 'border-yellow-300', text: 'text-slate-950' };
        return { bg: 'bg-emerald-500/80', border: 'border-emerald-300', text: 'text-slate-950' };

      case 'ETHYLENE':
        if (crate.crop === 'Tomatoes' || crate.crop === 'Apples' || crate.ethyleneProduction === 'HIGH') {
          return { bg: 'bg-purple-600/90 animate-pulse', border: 'border-purple-300', text: 'text-white' };
        }
        if (
          crate.crop === 'Spinach' ||
          crate.crop === 'Lettuce' ||
          crate.crop === 'Broccoli' ||
          crate.crop === 'Carrots'
        ) {
          return { bg: 'bg-amber-500/90', border: 'border-amber-300', text: 'text-slate-950' };
        }
        return { bg: 'bg-slate-700/80', border: 'border-slate-500', text: 'text-slate-200' };

      case 'ENERGY':
        // Zone based cooling intensity
        if (crate.zoneId === 'ZONE_A') return { bg: 'bg-cyan-500/80', border: 'border-cyan-300', text: 'text-slate-950' };
        if (crate.zoneId === 'ZONE_C') return { bg: 'bg-sky-600/80', border: 'border-sky-300', text: 'text-white' };
        return { bg: 'bg-indigo-600/80', border: 'border-indigo-400', text: 'text-white' };

      case 'AIRFLOW':
        return { bg: 'bg-slate-700/80', border: 'border-cyan-400/60', text: 'text-cyan-200' };

      case 'NORMAL':
      default:
        if (crate.status === 'EXPIRING_SOON') return { bg: 'bg-red-900/80', border: 'border-red-500', text: 'text-red-200' };
        if (crate.category === 'leafy_vegetables') return { bg: 'bg-emerald-800/80', border: 'border-emerald-500', text: 'text-emerald-100' };
        if (crate.category === 'fruits') return { bg: 'bg-rose-800/80', border: 'border-rose-500', text: 'text-rose-100' };
        if (crate.category === 'roots_tubers') return { bg: 'bg-amber-800/80', border: 'border-amber-500', text: 'text-amber-100' };
        return { bg: 'bg-slate-800/90', border: 'border-slate-600', text: 'text-slate-200' };
    }
  };

  return (
    <div
      id="digital-twin-container"
      className={`relative flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl ${
        compact ? 'h-[460px]' : 'h-[720px]'
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2 text-xs gap-2 z-10 backdrop-blur-sm">
        {/* Left: Visual Modes */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="h-3 w-3 text-emerald-400" /> Mode:
          </span>
          {visualModes.map((vm) => {
            const Icon = vm.icon;
            const active = digitalTwinMode === vm.mode;
            return (
              <button
                key={vm.mode}
                id={`btn-twin-mode-${vm.mode}`}
                onClick={() => setDigitalTwinMode(vm.mode)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-all ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-xs shadow-emerald-500/40'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{vm.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Zone selector, Angles & Zoom */}
        <div className="flex items-center gap-2">
          {/* Zone Selector */}
          <select
            id="select-twin-zone"
            value={selectedZoneId || 'ALL'}
            onChange={(e) => setSelectedZoneId(e.target.value === 'ALL' ? null : e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-slate-200 text-xs font-medium focus:outline-hidden"
          >
            <option value="ALL">All Storage Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.cropTypeLabel})
              </option>
            ))}
          </select>

          {/* View Perspective */}
          <div className="hidden sm:flex rounded-md border border-slate-700 bg-slate-800/80 p-0.5">
            <button
              onClick={() => setViewAngle('ISOMETRIC')}
              className={`rounded px-2 py-0.5 font-medium ${
                viewAngle === 'ISOMETRIC' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2.5D Iso
            </button>
            <button
              onClick={() => setViewAngle('TOP_DOWN')}
              className={`rounded px-2 py-0.5 font-medium ${
                viewAngle === 'TOP_DOWN' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Plan View
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center rounded-md border border-slate-700 bg-slate-800/80 p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-white ml-0.5 border-l border-slate-700"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 2.5D / Isometric Interactive Chamber Canvas */}
      <div
        className="relative flex-1 overflow-auto bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 p-6 flex items-center justify-center select-none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* Animated Airflow Overlay in Airflow Mode */}
        {digitalTwinMode === 'AIRFLOW' && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-75">
            <svg className="h-full w-full">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M 50,80 Q 250,50 450,90 T 850,70"
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="3"
                strokeDasharray="12, 6"
                className="animate-pulse"
              />
              <path
                d="M 50,180 Q 300,160 550,200 T 950,180"
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="2.5"
                strokeDasharray="10, 8"
              />
              <path
                d="M 100,320 Q 350,300 650,340 T 950,320"
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="2"
                strokeDasharray="8, 6"
              />
            </svg>
            <div className="absolute top-4 left-6 rounded-md bg-cyan-950/80 px-2 py-1 text-[11px] font-mono text-cyan-300 border border-cyan-700/50">
              Discharge Air Velocity: 2.8 m/s • Return RH: 92%
            </div>
          </div>
        )}

        {/* The Scaled Storage Chamber Frame */}
        <div
          style={{
            transform: `scale(${zoomLevel}) ${
              viewAngle === 'ISOMETRIC' ? 'perspective(1200px) rotateX(16deg)' : ''
            }`,
            transition: 'transform 0.25s ease-out',
          }}
          className="relative w-full max-w-5xl rounded-2xl border-2 border-slate-700/80 bg-slate-900/90 p-5 shadow-2xl shadow-emerald-950/20"
        >
          {/* Cold Room Ceiling / Evaporator Units */}
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-cyan-800/60 bg-cyan-950/40 px-2.5 py-1 text-xs text-cyan-300">
                <Wind className="h-4 w-4 animate-spin text-cyan-400" />
                <span className="font-semibold">Dual Evaporator Blowers: 380 m³/h</span>
              </div>
              <div className="hidden md:flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
                <span>R-290 Eco Refrigerant Loop</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-slate-300">Active Thermal Twin Feed</span>
            </div>
          </div>

          {/* 4 Storage Zones Layout */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredZones.map((zone) => {
              const zoneCrates = crates.filter((c) => c.zoneId === zone.id && c.status !== 'DISPATCHED');
              return (
                <div
                  key={zone.id}
                  id={`twin-zone-${zone.id}`}
                  className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 transition-all hover:border-slate-700"
                >
                  {/* Zone Header */}
                  <div className="mb-2.5 flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 font-mono text-xs font-bold text-emerald-400">
                        {zone.id.replace('ZONE_', '')}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{zone.name}</h4>
                        <p className="text-[10px] text-slate-400">{zone.cropTypeLabel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <div className="font-mono text-xs font-semibold text-emerald-400">
                        {zone.currentTempC.toFixed(1)}°C
                      </div>
                      <span className="text-slate-600">/</span>
                      <div className="font-mono text-xs font-medium text-cyan-400">
                        {Math.round(zone.currentHumidityPct)}% RH
                      </div>
                    </div>
                  </div>

                  {/* Physical Racks Grid */}
                  <div className="space-y-2">
                    {zone.racks.map((rack) => (
                      <div
                        key={rack.id}
                        className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-2"
                      >
                        <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-300">{rack.label}</span>
                          <span>3 Tiers (Upper, Mid, Lower)</span>
                        </div>

                        {/* 3 Shelves */}
                        <div className="space-y-1.5">
                          {[0, 1, 2].map((shelfIdx) => {
                            // Find crates stored on this shelf of this rack
                            const shelfCrates = zoneCrates.filter(
                              (c) => c.rackId === rack.id && c.shelfIndex === shelfIdx
                            );
                            return (
                              <div
                                key={shelfIdx}
                                className="flex items-center gap-1.5 rounded bg-slate-950/80 p-1 border border-slate-800/40 min-h-[36px]"
                              >
                                <span className="text-[9px] font-mono text-slate-400 w-6 shrink-0">
                                  T{shelfIdx + 1}
                                </span>

                                <div className="flex flex-1 items-center gap-1.5 overflow-x-auto">
                                  {shelfCrates.length === 0 ? (
                                    <div className="w-full text-center text-[10px] text-slate-400 italic py-0.5">
                                      Empty Tier (Available)
                                    </div>
                                  ) : (
                                    shelfCrates.map((crate) => {
                                      const style = getCrateColorByMode(crate);
                                      return (
                                        <button
                                          key={crate.id}
                                          id={`twin-crate-${crate.id}`}
                                          onClick={() => setSelectedCrateId(crate.id)}
                                          onMouseEnter={() => setHoveredCrate(crate)}
                                          onMouseLeave={() => setHoveredCrate(null)}
                                          className={`group relative flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold shadow-xs transition-all hover:scale-105 hover:z-20 cursor-pointer ${style.bg} ${style.border} ${style.text}`}
                                        >
                                          <span className="font-mono text-[10px]">{crate.id}</span>
                                          <span className="max-w-[70px] truncate text-[11px]">
                                            {crate.crop}
                                          </span>
                                          <span className="font-mono text-[9px] opacity-85">
                                            {crate.weightKg}kg
                                          </span>

                                          {/* Spoilage warning badge */}
                                          {crate.riskLevel === 'CRITICAL' && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                                          )}
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chamber Door Seal Bar at bottom */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-medium">
                Thermal Entrance Airlock (Seal Pressure: 980 Pa)
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Click any crate above to open full operational drawer with biological shelf-life & QR dispatch.
            </span>
          </div>
        </div>

        {/* Floating Interactive Hover Tooltip */}
        {hoveredCrate && (
          <div
            style={{
              left: Math.min(window.innerWidth - 320, mousePos.x + 18),
              top: Math.max(10, mousePos.y - 120),
            }}
            className="pointer-events-none fixed z-50 w-72 rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div>
                <span className="font-mono font-bold text-emerald-400">{hoveredCrate.id}</span>
                <h5 className="text-sm font-extrabold text-white">{hoveredCrate.crop}</h5>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  hoveredCrate.riskLevel === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : hoveredCrate.riskLevel === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                Risk: {hoveredCrate.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
              <div>
                <span className="text-slate-400">Weight:</span>{' '}
                <span className="font-mono font-semibold text-slate-100">{hoveredCrate.weightKg} kg</span>
              </div>
              <div>
                <span className="text-slate-400">Stored:</span>{' '}
                <span className="font-mono font-semibold text-slate-100">{hoveredCrate.storedDays} days</span>
              </div>
              <div>
                <span className="text-slate-400">Core Temp:</span>{' '}
                <span className="font-mono font-semibold text-emerald-400">{hoveredCrate.temperatureC}°C</span>
              </div>
              <div>
                <span className="text-slate-400">Humidity:</span>{' '}
                <span className="font-mono font-semibold text-cyan-400">{hoveredCrate.humidityPct}%</span>
              </div>
            </div>

            <div className="rounded-md bg-slate-950 p-2 border border-slate-800/80 mb-2">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Predicted Shelf-Life:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {hoveredCrate.shelfLifeDaysRemaining} days remaining
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    hoveredCrate.spoilageRiskPct > 70
                      ? 'bg-red-500'
                      : hoveredCrate.spoilageRiskPct > 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${hoveredCrate.spoilageRiskPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span>AI Spoilage Index:</span>
                <span className="font-mono">{hoveredCrate.spoilageRiskPct}%</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-300 italic">
              "{hoveredCrate.recommendedAction}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

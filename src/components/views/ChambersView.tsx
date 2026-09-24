import React, { useState } from 'react';
import {
  Box,
  Thermometer,
  Droplets,
  Layers,
  ArrowLeft,
  Activity,
  DoorClosed,
  DoorOpen,
  Fan,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useColdStorage } from '../../context/ColdStorageContext';
import { ChamberData, RackItem } from '../../types';

export const ChambersView: React.FC = () => {
  const {
    chambers,
    racks,
    selectedChamberId,
    setSelectedChamberId,
    setSelectedRackId,
    setActiveTab,
    isDoorOpen,
    toggleDoor,
  } = useColdStorage();

  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'detail'>('overview');

  const currentChamber = chambers.find((c) => c.id === selectedChamberId) || chambers[0];
  const chamberRacks = racks.filter((r) => r.chamberId === currentChamber.id);

  const handleOpenDetail = (chamberId: string) => {
    setSelectedChamberId(chamberId);
    setActiveTabSub('detail');
  };

  const handleRackSelect = (rackId: string) => {
    setSelectedRackId(rackId);
    setActiveTab('rack_detail');
  };

  return (
    <div id="chambers-view" className="space-y-6 pb-12 font-sans">
      {/* View Switcher: Overview vs Detailed Monitoring */}
      {activeTabSub === 'detail' && (
        <button
          onClick={() => setActiveTabSub('overview')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All 4 Chambers</span>
        </button>
      )}

      {/* OVERVIEW MODE */}
      {activeTabSub === 'overview' ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Cold Storage Chambers Management
            </h1>
            <p className="text-xs text-slate-500">
              Four independently regulated cooling compartments with dedicated microclimate sensors and rack matrices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chambers.map((chamber) => {
              const isWarning = chamber.status === 'Warning';
              const chRacks = racks.filter((r) => r.chamberId === chamber.id);

              return (
                <div
                  key={chamber.id}
                  className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all hover:shadow-md ${
                    isWarning ? 'border-amber-300' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">{chamber.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {chamber.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Target Crop: <span className="font-semibold text-slate-800">{chamber.allocatedCrop}</span> • Capacity: 4 Racks
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenDetail(chamber.id)}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                    >
                      Detailed Monitoring →
                    </button>
                  </div>

                  {/* Metrics Grid */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Thermometer className="h-3 w-3 text-emerald-600" /> Temperature
                      </span>
                      <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                        {chamber.actualTempC}°C
                      </span>
                      <span className="text-[10px] text-slate-400">Target: {chamber.targetTempC}°C</span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Droplets className="h-3 w-3 text-cyan-600" /> Humidity
                      </span>
                      <span className="text-base font-extrabold text-cyan-800 mt-0.5 block">
                        {chamber.humidityPct}% RH
                      </span>
                      <span className="text-[10px] text-slate-400">Target: {chamber.targetHumidityPct}%</span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Activity className="h-3 w-3 text-purple-600" /> Air Quality
                      </span>
                      <span className="text-sm font-bold text-slate-800 mt-1 block">
                        {chamber.gasStatus}
                      </span>
                      <span className="text-[10px] text-slate-400">MQ-135 Sensor</span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Fan className="h-3 w-3 text-emerald-600" /> Cooling Duty
                      </span>
                      <span className="text-sm font-bold text-emerald-700 mt-1 block">
                        {chamber.coolingStatus}
                      </span>
                      <span className="text-[10px] text-slate-400">Door: {chamber.doorStatus}</span>
                    </div>
                  </div>

                  {/* Racks inside */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Rack Allocations ({chamber.occupiedRacks}/{chamber.totalRacks} Occupied)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {chRacks.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => handleRackSelect(r.id)}
                          className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50/70 p-2 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-slate-900">{r.id}</span>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                r.storageStatus === 'Good'
                                  ? 'bg-emerald-500'
                                  : r.storageStatus === 'Attention'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-300'
                              }`}
                            />
                          </div>
                          <span className="text-[10px] text-slate-600 truncate block mt-0.5">
                            {r.storageStatus === 'Empty' ? 'Empty' : `${r.vegetable} (${r.quantityKg}kg)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* SECTION 7: DETAILED CHAMBER MONITORING VIEW */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {currentChamber.name.toUpperCase()} — DETAILED MONITORING
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    currentChamber.status === 'Warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentChamber.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Active Storage: <span className="font-semibold text-slate-800">{currentChamber.allocatedCrop}</span> • Microclimate Zone ID: {currentChamber.id}
              </p>
            </div>

            {/* Chamber selector buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
              {chambers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChamberId(c.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    selectedChamberId === c.id
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c.id}
                </button>
              ))}
            </div>
          </div>

          {/* Top Cards for this Chamber */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Actual Temp</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{currentChamber.actualTempC}°C</span>
              <span className="text-[10px] text-slate-400">Target: {currentChamber.targetTempC}°C</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Relative Humidity</span>
              <span className="text-2xl font-extrabold text-cyan-800 mt-0.5 block">{currentChamber.humidityPct}% RH</span>
              <span className="text-[10px] text-slate-400">Target: {currentChamber.targetHumidityPct}%</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Gas Quality</span>
              <span className="text-lg font-bold text-slate-800 mt-1 block">{currentChamber.gasStatus}</span>
              <span className="text-[10px] text-slate-400">12 ppm Ethylene</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Cooling Status</span>
              <span className="text-lg font-bold text-emerald-700 mt-1 block">{currentChamber.coolingStatus}</span>
              <span className="text-[10px] text-slate-400">VCRC Expansion</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Door Sensor</span>
              <div className="flex items-center gap-1.5 mt-1">
                {currentChamber.doorStatus === 'Open' ? (
                  <>
                    <DoorOpen className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-bold text-red-600">Door Open</span>
                  </>
                ) : (
                  <>
                    <DoorClosed className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Sealed</span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Magnetic Switch</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Occupancy</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">
                {currentChamber.occupiedRacks}/{currentChamber.totalRacks}
              </span>
              <span className="text-[10px] text-slate-400">4 Racks Max</span>
            </div>
          </div>

          {/* 3 Live Interactive Graphs (Section 7 Requirement) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph 1: Temperature Graph */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase">
                    <Thermometer className="h-4 w-4 text-emerald-600" /> Temperature Trend (24h)
                  </h3>
                  <span className="text-[10px] text-slate-500">Target: {currentChamber.targetTempC}°C (±1.0°C)</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700">{currentChamber.actualTempC}°C</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChamber.tempHistory24h || currentChamber.historicalData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#94a3b8" unit="°C" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <ReferenceLine y={currentChamber.targetTempC} stroke="#059669" strokeDasharray="3 3" label={{ value: 'Target', fontSize: 10, fill: '#059669' }} />
                    <Line type="monotone" dataKey="temp" stroke="#059669" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Humidity Graph */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase">
                    <Droplets className="h-4 w-4 text-cyan-600" /> Relative Humidity (24h)
                  </h3>
                  <span className="text-[10px] text-slate-500">Target: {currentChamber.targetHumidityPct || 72}% RH</span>
                </div>
                <span className="font-mono text-xs font-bold text-cyan-800">{currentChamber.humidityPct}%</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChamber.humidityHistory24h || currentChamber.historicalData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis domain={[60, 95]} tick={{ fontSize: 10 }} stroke="#94a3b8" unit="%" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <ReferenceLine y={currentChamber.targetHumidityPct || 72} stroke="#0284c7" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="humidity" stroke="#0284c7" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 3: Gas Sensor Graph */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase">
                    <Activity className="h-4 w-4 text-purple-600" /> Gas & Ethylene Trend (ppm)
                  </h3>
                  <span className="text-[10px] text-slate-500">Warning Threshold: 0.15 ppm</span>
                </div>
                <span className="font-mono text-xs font-bold text-purple-700">{currentChamber.gasLevelPpm} ppm</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChamber.gasHistory24h || currentChamber.historicalData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis domain={[0, 0.5]} tick={{ fontSize: 10 }} stroke="#94a3b8" unit="ppm" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <ReferenceLine y={0.15} stroke="#d97706" strokeDasharray="3 3" label={{ value: 'Warn', fontSize: 10, fill: '#d97706' }} />
                    <ReferenceLine y={0.3} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Crit', fontSize: 10, fill: '#dc2626' }} />
                    <Line type="monotone" dataKey="gasPpm" stroke="#7c3aed" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Timeline & Associated Racks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline Events (Section 7 Requirement) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <History className="h-4 w-4 text-emerald-600" />
                Chamber Operating Timeline Events
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(currentChamber.timeline || []).map((evt: { time: string; event: string; status?: string }, idx: number) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-600 shadow-2xs" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{evt.event}</span>
                      <span className="font-mono text-slate-400">{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Racks */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Layers className="h-4 w-4 text-emerald-600" />
                Racks Monitored in {currentChamber.name}
              </h3>

              <div className="space-y-3">
                {chamberRacks.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => handleRackSelect(r.id)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">{r.id}</span>
                        <span className="text-xs font-bold text-emerald-800">{r.vegetable}</span>
                        <span className="text-xs text-slate-500">({r.variety})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Farmer: {r.farmerName} • Stored: {r.quantityKg} kg • Duration: {r.storageDays} days
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          r.storageStatus === 'Good'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.storageStatus}
                      </span>
                      <span className="block text-xs font-mono font-bold text-slate-700 mt-1">
                        {r.currentTempC}°C • {r.humidityPct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Thermometer,
  Droplets,
  Activity,
  Fan,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Wind,
  DoorOpen,
  DoorClosed,
  Zap,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const EnvironmentView: React.FC = () => {
  const {
    zones,
    sensors,
    refrigeration,
    setSetpoint,
    triggerDefrost,
    toggleDoor,
    isDoorOpen,
  } = useColdStorage();

  return (
    <div id="view-environment" className="space-y-5">
      {/* Header with Title & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Thermometer className="h-6 w-6 text-cyan-400" />
            <span>Multi-Zone Microclimate & Sensor Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time thermal stratification, vapor pressure deficit, ethylene buildup, and subcooling thermal storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Cold Room Door Seal State & Toggle */}
          <button
            id="btn-toggle-door-env"
            onClick={() => toggleDoor()}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all shadow-xs ${
              isDoorOpen
                ? 'border-red-500 bg-red-950/80 text-red-200 animate-pulse'
                : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white'
            }`}
          >
            {isDoorOpen ? <DoorOpen className="h-4 w-4 text-red-400" /> : <DoorClosed className="h-4 w-4 text-emerald-400" />}
            <span>Door: {isDoorOpen ? 'AJAR (Heat Ingress)' : 'Sealed'}</span>
          </button>

          {/* Thermostat Setpoint Quick Control */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Thermostat Target:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSetpoint(refrigeration.setpointC - 0.5)}
                className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 font-bold text-white hover:bg-slate-700"
              >
                -
              </button>
              <span className="font-mono text-base font-black text-emerald-400 min-w-[50px] text-center">
                {refrigeration.setpointC.toFixed(1)}°C
              </span>
              <button
                onClick={() => setSetpoint(refrigeration.setpointC + 0.5)}
                className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 font-bold text-white hover:bg-slate-700"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Energy & Refrigeration Mode Notification */}
      {refrigeration.ecoSheddingActive && (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-600/60 bg-amber-950/40 p-3.5 text-xs text-amber-200">
          <Zap className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <strong className="font-bold">Autonomous Eco Load-Shedding Active:</strong> Battery reserve &lt; 22%. Thermostat target raised to 5.5°C to preserve emergency circulation blowers until morning PV generation.
          </div>
        </div>
      )}

      {refrigeration.solarSubcoolingActive && (
        <div className="flex items-center gap-2.5 rounded-xl border border-cyan-500/60 bg-cyan-950/40 p-3.5 text-xs text-cyan-200">
          <Zap className="h-5 w-5 text-cyan-400 shrink-0" />
          <div>
            <strong className="font-bold">Solar Subcooling Mode Engaged:</strong> PV surplus &gt; 420W and Battery &gt; 92%. Compressor setpoint lowered to 2.2°C to bank free solar cooling into the produce mass.
          </div>
        </div>
      )}

      {/* 4 Storage Zones Detailed Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            id={`env-zone-card-${zone.id}`}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 font-mono text-xs font-bold text-emerald-400">
                  {zone.id.replace('ZONE_', '')}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{zone.name}</h4>
                  <span className="text-[10px] text-slate-400">{zone.cropTypeLabel}</span>
                </div>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                  zone.status === 'ALERT'
                    ? 'bg-red-950 text-red-300 border-red-700'
                    : zone.status === 'WARNING'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}
              >
                {zone.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-emerald-400" /> Temperature
                </span>
                <div className="text-xl font-black font-mono text-white mt-1">
                  {zone.currentTempC.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-slate-400">
                  Target: {zone.targetTempRange[0]}–{zone.targetTempRange[1]}°C
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-cyan-400" /> Humidity
                </span>
                <div className="text-xl font-black font-mono text-white mt-1">
                  {Math.round(zone.currentHumidityPct)}%
                </div>
                <div className="text-[10px] text-slate-400">
                  Target: {zone.targetHumidityRange[0]}–{zone.targetHumidityRange[1]}%
                </div>
              </div>
            </div>

            {/* Ethylene & Dew Point */}
            <div className="grid grid-cols-2 gap-2 text-[11px] rounded-lg bg-slate-950/60 p-2 border border-slate-800/80">
              <div>
                <span className="text-slate-400 block text-[10px]">Ethylene PPM</span>
                <span className={`font-mono font-bold ${(zone.ethylenePpm || 0) > 0.15 ? 'text-purple-400' : 'text-slate-300'}`}>
                  {zone.ethylenePpm || 0.05} ppm
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Dew Point</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {zone.dewPointC ?? 1.8}°C
                </span>
              </div>
            </div>

            {/* Utilization */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Crate Occupancy:</span>
                <span className="font-mono text-slate-200">
                  {zone.utilizedCrates} / {zone.capacityCrates} crates ({Math.round((zone.utilizedCrates / zone.capacityCrates) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${(zone.utilizedCrates / zone.capacityCrates) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refrigeration Circuit & Compressor Diagnostics */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Fan className="h-5 w-5 text-cyan-400 animate-spin" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              Refrigeration Subsystem Diagnostics & Defrost Loop
            </h3>
          </div>

          <button
            onClick={triggerDefrost}
            disabled={refrigeration.defrostActive}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-700 bg-cyan-950/60 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900 disabled:opacity-40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{refrigeration.defrostActive ? 'Defrost Active (Heating Evaporator)' : 'Trigger Defrost Cycle'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Compressor State</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{refrigeration.compressorStatus}</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Evaporator Temp</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">{refrigeration.evaporatorTempC}°C</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Condenser Temp</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{refrigeration.condenserTempC}°C</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Superheat (Target: 5K)</span>
            <span className="font-mono font-bold text-white text-sm">{refrigeration.superheatKelvin} K</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Compressor Power</span>
            <span className="font-mono font-bold text-cyan-300 text-sm">{Math.round(refrigeration.compressorPowerWatts)} W</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">System COP Eff.</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{refrigeration.copEfficiency}</span>
          </div>
        </div>
      </div>

      {/* Sensor Probes Hardware Health Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>Connected IoT Sensor Hardware Probes</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Sensor ID</th>
                <th className="py-2 px-3">Sensor Name</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Zone / Location</th>
                <th className="py-2 px-3">Live Reading</th>
                <th className="py-2 px-3">Min / Max (24h)</th>
                <th className="py-2 px-3">Health Status</th>
                <th className="py-2 px-3">Last Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono">
              {sensors.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-bold text-white">{s.id}</td>
                  <td className="py-2 px-3 font-sans text-slate-200">{s.name}</td>
                  <td className="py-2 px-3 text-slate-400 text-[11px]">{s.type}</td>
                  <td className="py-2 px-3 text-slate-300">{s.zoneId ? s.zoneId.replace('_', ' ') : 'Chamber'}</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">
                    {s.type === 'DOOR'
                      ? s.currentValue === 1
                        ? 'OPEN'
                        : 'CLOSED'
                      : `${s.currentValue} ${s.unit}`}
                  </td>
                  <td className="py-2 px-3 text-slate-400 text-[11px]">
                    {s.minReading} / {s.maxReading} {s.unit}
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800 font-sans">
                      <CheckCircle2 className="h-3 w-3" />
                      {s.healthStatus}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-sans text-slate-400 text-[11px]">{s.lastPing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

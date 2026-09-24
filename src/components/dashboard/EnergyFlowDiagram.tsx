import React from 'react';
import {
  Sun,
  BatteryCharging,
  Zap,
  Fan,
  Lightbulb,
  Cpu,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  CloudSun,
  Flame,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const EnergyFlowDiagram: React.FC = () => {
  const { power, refrigeration, isCloudCover, toggleCloudCover, isHeatwave, toggleHeatwave } =
    useColdStorage();

  const isCharging = power.batteryPowerWatts >= 0;

  return (
    <div
      id="energy-solar-flow-monitor"
      className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-5 shadow-lg space-y-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-950 border border-amber-500/40 text-amber-400">
              <Sun className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              Solar Hybrid Microgrid & Energy Flow
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time DC bus energy routing from 600W Bifacial PV array to 48V LiFePO4 bank and cooling load.
          </p>
        </div>

        {/* Quick Simulation Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleCloudCover()}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              isCloudCover
                ? 'border-sky-700 bg-sky-950 text-sky-300'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudSun className="h-3.5 w-3.5" />
            <span>{isCloudCover ? 'Cloud Cover: ON (160W)' : 'Simulate Cloud'}</span>
          </button>

          <button
            onClick={() => toggleHeatwave()}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              isHeatwave
                ? 'border-amber-700 bg-amber-950 text-amber-300'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>{isHeatwave ? 'Heatwave: ON (36.5°C)' : 'Simulate Heatwave'}</span>
          </button>
        </div>
      </div>

      {/* Industrial Diagram Layout: Left: Solar PV -> Center: MPPT & Battery -> Right: Cold Loads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Source: Solar Array */}
        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-950/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Solar PV Array
              </h4>
            </div>
            <span className="rounded-full bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-700">
              600W Peak
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black font-mono text-white">
              {power.solarPowerWatts} <span className="text-sm font-normal text-amber-400">Watts</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {power.solarVoltageVolts.toFixed(1)}V • {power.solarCurrentAmps.toFixed(1)}A DC
            </div>
          </div>

          <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Daily Yield:</span>
              <span className="font-mono text-amber-300 font-semibold">{power.dailySolarGenerationKwh} kWh</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>MPPT Tracker:</span>
              <span className="font-mono text-emerald-400">{power.mpptEfficiencyPct}% Efficiency</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Solar Coverage:</span>
              <span className="font-mono text-slate-200">100% Off-Grid</span>
            </div>
          </div>
        </div>

        {/* Center: Battery Storage Bank */}
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-950/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BatteryCharging className="h-5 w-5 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                LiFePO4 Battery Bank
              </h4>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${
                isCharging
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-amber-950 text-amber-300 border-amber-700'
              }`}
            >
              {isCharging ? 'Charging' : 'Discharging'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black font-mono text-white">
                {Math.round(power.batterySocPct)}%
              </div>
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                {power.batteryPowerWatts > 0 ? `+${power.batteryPowerWatts}W` : `${power.batteryPowerWatts}W`}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {power.batteryVoltageVolts.toFixed(1)}V • {power.batteryCurrentAmps.toFixed(1)}A
            </div>
          </div>

          {/* SOC Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${power.batterySocPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Remaining: {power.batteryRuntimeRemainingHours} hrs</span>
              <span>Capacity: 4.8 kWh (100Ah)</span>
            </div>
          </div>

          <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Battery Temp:</span>
              <span className="font-mono text-emerald-300">{power.batteryTempC}°C (Optimal)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>State of Health:</span>
              <span className="font-mono text-slate-200">97.8% (Cycle #142)</span>
            </div>
          </div>
        </div>

        {/* Right: Loads Breakdown */}
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-950/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Facility Active Load
              </h4>
            </div>
            <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-700">
              {power.totalLoadWatts} W Total
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Compressor */}
            <div className="flex items-center justify-between rounded bg-slate-950/70 p-2 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <Fan className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                <span className="text-slate-300">Inverter Compressor</span>
              </div>
              <span className="font-mono font-bold text-cyan-400">
                {power.refrigerationPowerWatts} W
              </span>
            </div>

            {/* Evaporator Fans */}
            <div className="flex items-center justify-between rounded bg-slate-950/70 p-2 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-300">Circulation Fans</span>
              </div>
              <span className="font-mono font-bold text-slate-200">{power.fanPowerWatts} W</span>
            </div>

            {/* Chamber LED Lighting */}
            <div className="flex items-center justify-between rounded bg-slate-950/70 p-2 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-300">Chamber LED Lighting</span>
              </div>
              <span className="font-mono font-bold text-slate-200">{power.lightingPowerWatts} W</span>
            </div>

            {/* IoT & Sensors */}
            <div className="flex items-center justify-between rounded bg-slate-950/70 p-2 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-slate-300">ESP32 IoT & Sensors</span>
              </div>
              <span className="font-mono font-bold text-slate-200">{power.controllerPowerWatts} W</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sun,
  BatteryCharging,
  Zap,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Cpu,
  RefreshCw,
  Power,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useColdStorage } from '../../context/ColdStorageContext';

export const EnergyView: React.FC = () => {
  const {
    batteryBackupMode,
    setBatteryBackupMode,
    lastIoTUpdatedSec,
  } = useColdStorage();

  const [pendingMode, setPendingMode] = useState<'AUTO' | 'BACKUP' | 'CHARGING' | 'STANDBY' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // 24-hour Solar Generation vs Load Consumption vs Battery SOC Data
  const energyHistory = [
    { time: '00:00', solarKw: 0.0, loadKw: 1.4, socPct: 88, batteryKw: -1.4 },
    { time: '03:00', solarKw: 0.0, loadKw: 1.3, socPct: 82, batteryKw: -1.3 },
    { time: '06:00', solarKw: 0.3, loadKw: 1.5, socPct: 75, batteryKw: -1.2 },
    { time: '09:00', solarKw: 1.8, loadKw: 1.6, socPct: 74, batteryKw: 0.2 },
    { time: '12:00', solarKw: 2.8, loadKw: 1.8, socPct: 85, batteryKw: 1.0 },
    { time: '14:00', solarKw: 2.4, loadKw: 1.65, socPct: 78, batteryKw: 0.75 },
    { time: '17:00', solarKw: 0.8, loadKw: 1.5, socPct: 80, batteryKw: -0.7 },
    { time: '20:00', solarKw: 0.0, loadKw: 1.4, socPct: 76, batteryKw: -1.4 },
  ];

  const handleModeSelect = (mode: 'AUTO' | 'BACKUP' | 'CHARGING' | 'STANDBY') => {
    if (mode === batteryBackupMode) return;
    setPendingMode(mode);
    setShowConfirmModal(true);
  };

  const confirmModeChange = () => {
    if (pendingMode) {
      setBatteryBackupMode(pendingMode);
      setShowConfirmModal(false);
      setPendingMode(null);
    }
  };

  return (
    <div id="energy-view" className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Solar PV & LiFePO₄ Battery Energy Management
          </h1>
          <p className="text-xs text-slate-500">
            3 kWp rooftop solar, MPPT charge controller, and 48V LiFePO₄ energy storage telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            🟢 Solar Self-Consumption: 100%
          </span>
        </div>
      </div>

      {/* SECTION 13: 3 Primary Cards (Solar, Battery, Load) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Solar Generation Card */}
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Sun className="h-4 w-4 text-amber-600" /> Solar PV System (3 kWp)
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Generating
            </span>
          </div>

          <div className="mt-4">
            <span className="text-4xl font-extrabold text-slate-900 font-mono">2.4 kW</span>
            <span className="text-xs text-slate-500 block mt-1">Real-time Solar Irradiance Yield</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Daily Solar Generation:</span>
              <span className="font-bold text-slate-900 font-mono">14.8 kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Rooftop Array Capacity:</span>
              <span className="font-bold text-slate-900">3.0 kWp Monocrystalline</span>
            </div>
            <div className="flex justify-between">
              <span>MPPT Controller Efficiency:</span>
              <span className="font-bold text-emerald-700">98.4%</span>
            </div>
          </div>
        </div>

        {/* 2. Battery Bank Card */}
        <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5 uppercase tracking-wider">
              <BatteryCharging className="h-4 w-4 text-blue-600" /> Battery Storage (48V LiFePO₄)
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Healthy
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-blue-900 font-mono">78%</span>
            <span className="text-xs font-bold text-blue-700">SOC (State of Charge)</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Pack Terminal Voltage:</span>
              <span className="font-bold text-slate-900 font-mono">51.2 V</span>
            </div>
            <div className="flex justify-between">
              <span>Charge / Discharge Current:</span>
              <span className="font-bold text-slate-900 font-mono">+18.0 A (Charging)</span>
            </div>
            <div className="flex justify-between">
              <span>Battery Net Power:</span>
              <span className="font-bold text-slate-900 font-mono">0.92 kW</span>
            </div>
            <div className="flex justify-between">
              <span>BMS Cell Balancing:</span>
              <span className="font-bold text-emerald-700">16/16 Cells Optimal (3.20V)</span>
            </div>
          </div>
        </div>

        {/* 3. Facility Load Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="h-4 w-4 text-cyan-600" /> Total Facility Load
            </span>
            <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
              VCRC Active
            </span>
          </div>

          <div className="mt-4">
            <span className="text-4xl font-extrabold text-slate-900 font-mono">1.65 kW</span>
            <span className="text-xs text-slate-500 block mt-1">Compressor + Fans + IoT Controller</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Daily Energy Consumption:</span>
              <span className="font-bold text-slate-900 font-mono">11.4 kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Compressor Motor Draw:</span>
              <span className="font-bold text-slate-900 font-mono">1.20 kW (73% of load)</span>
            </div>
            <div className="flex justify-between">
              <span>Evaporator & Condenser Fans:</span>
              <span className="font-bold text-slate-900 font-mono">0.42 kW</span>
            </div>
            <div className="flex justify-between">
              <span>IoT Probes & Gateway:</span>
              <span className="font-bold text-slate-900 font-mono">0.03 kW</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 14: Battery Backup Mode Selector with Safety Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-600" />
              Battery Operating & Backup Management Mode
            </h2>
            <p className="text-xs text-slate-500">
              Configures intelligent energy routing priority between rooftop solar, battery bank, and refrigeration compressor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Current Active Mode:</span>
            <span className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-2xs">
              {batteryBackupMode}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Mode 1: AUTO */}
          <button
            onClick={() => handleModeSelect('AUTO')}
            className={`p-4 rounded-xl border text-left transition-all ${
              batteryBackupMode === 'AUTO'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">AUTO (Recommended)</span>
              {batteryBackupMode === 'AUTO' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Maximizes solar self-consumption, automatically charging battery on surplus and powering compressor seamlessly.
            </p>
          </button>

          {/* Mode 2: BACKUP */}
          <button
            onClick={() => handleModeSelect('BACKUP')}
            className={`p-4 rounded-xl border text-left transition-all ${
              batteryBackupMode === 'BACKUP'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">BACKUP PRIORITY</span>
              {batteryBackupMode === 'BACKUP' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Maintains battery near 90%+ SOC for night-time or overcast reserve autonomy before allowing peak loads.
            </p>
          </button>

          {/* Mode 3: CHARGING */}
          <button
            onClick={() => handleModeSelect('CHARGING')}
            className={`p-4 rounded-xl border text-left transition-all ${
              batteryBackupMode === 'CHARGING'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">FORCED CHARGING</span>
              {batteryBackupMode === 'CHARGING' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Channels all available MPPT power directly into the battery cells until maximum pack voltage (54.8V) is achieved.
            </p>
          </button>

          {/* Mode 4: STANDBY */}
          <button
            onClick={() => handleModeSelect('STANDBY')}
            className={`p-4 rounded-xl border text-left transition-all ${
              batteryBackupMode === 'STANDBY'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">STANDBY / ISOLATION</span>
              {batteryBackupMode === 'STANDBY' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Disconnects battery DC contactor for maintenance inspection or external diagnostic verification.
            </p>
          </button>
        </div>

        {/* Safety Protection Limits */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Hardware BMS Safety Interlocks:</strong> Low SOC Cut-off at 15% • High-Voltage Cut-off at 54.8V • Max Discharge Rate 1.5C
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">BMS Firmware: v2.4.1</span>
        </div>
      </div>

      {/* 24-Hour Graph: Solar vs Load vs Battery SOC */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              24-Hour Energy Balance: Solar Generation vs Facility Load
            </h2>
            <p className="text-xs text-slate-500">
              Hourly power flow showing peak daylight charging and overnight LiFePO₄ autonomy
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Solar (kW)
            </span>
            <span className="flex items-center gap-1 text-cyan-600">
              <span className="h-2 w-2 rounded-full bg-cyan-500" /> Load (kW)
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Battery SOC (%)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyHistory}>
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis yAxisId="left" unit=" kW" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} stroke="#3b82f6" />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              <Area yAxisId="left" type="monotone" dataKey="solarKw" name="Solar (kW)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorSolar)" />
              <Area yAxisId="left" type="monotone" dataKey="loadKw" name="Load (kW)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
              <Line yAxisId="right" type="monotone" dataKey="socPct" name="Battery SOC (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CONFIRMATION SAFETY MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900">Confirm Battery Mode Switch</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Switching battery operating mode to <strong>{pendingMode}</strong> will reconfigure MPPT charge controllers and DC bus routing.
              The refrigeration compressor will continue uninterrupted under smart power arbitrage.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmModeChange}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                Apply Mode Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

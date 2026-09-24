import React, { useState } from 'react';
import {
  Fan,
  Thermometer,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Shield,
  ArrowRight,
  Sun,
  BatteryCharging,
  Layers,
  Power,
  RefreshCw,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const RefrigerationView: React.FC = () => {
  const {
    compressorMode,
    setCompressorMode,
    refrigeration,
    triggerDefrost,
    userRole,
  } = useColdStorage();

  const [pendingCompressorMode, setPendingCompressorMode] = useState<'AUTO' | 'ON' | 'OFF' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handleSelectMode = (mode: 'AUTO' | 'ON' | 'OFF') => {
    if (mode === compressorMode) return;
    setPendingCompressorMode(mode);
    setShowConfirmModal(true);
  };

  const confirmCompressorMode = () => {
    if (pendingCompressorMode) {
      setCompressorMode(pendingCompressorMode);
      setShowConfirmModal(false);
      setPendingCompressorMode(null);
    }
  };

  return (
    <div id="refrigeration-view" className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Refrigeration Plant & VCRC Compressor Management
          </h1>
          <p className="text-xs text-slate-500">
            1.5 HP Vapor Compression Refrigeration Cycle (VCRC) with variable speed inverter modulation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerDefrost}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Manual Defrost Cycle
          </button>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Refrigerant: R134a Safe
          </span>
        </div>
      </div>

      {/* SECTION 15: Primary Compressor Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Compressor Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compressor Duty</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              Active
            </span>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 mt-3 block flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            RUNNING
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Speed: 2,850 RPM • Cop: 3.42
          </span>
        </div>

        {/* Card 2: Power */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Electrical Draw</span>
            <Zap className="h-4 w-4 text-cyan-600" />
          </div>
          <span className="text-2xl font-extrabold text-cyan-900 mt-3 block font-mono">
            1.2 kW
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Rated: 1.5 HP (1.12 kW nominal)
          </span>
        </div>

        {/* Card 3: Target vs Actual Temp */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Return Air Temp</span>
            <Thermometer className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">4.8°C</span>
            <span className="text-xs text-slate-500">(Target: 5.0°C)</span>
          </div>
          <span className="text-xs text-emerald-700 mt-1 block font-medium">
            Within ±0.3°C thermal deadband
          </span>
        </div>

        {/* Card 4: Operating Mode */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operating Mode</span>
            <Sliders className="h-4 w-4 text-slate-500" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-800 mt-3 block font-mono">
            {compressorMode}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Adaptive microclimate logic
          </span>
        </div>
      </div>

      {/* Mode Control Bar with Authorized Access Notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Compressor Control Mode Selection</h2>
            <p className="text-xs text-amber-800 mt-0.5 flex items-center gap-1 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              “Manual compressor control requires authorized access.”
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['AUTO', 'ON', 'OFF'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleSelectMode(mode)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  compressorMode === mode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {mode === 'AUTO' ? 'AUTO (Smart Logic)' : mode === 'ON' ? 'Manual FORCE ON' : 'Manual FORCE OFF'}
              </button>
            ))}
          </div>
        </div>

        {/* Subsystem Fans & Auxiliary Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Evaporator Fan 1:</span>
            <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
              <Fan className="h-3.5 w-3.5 animate-spin" /> ON (1,400 RPM)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Evaporator Fan 2:</span>
            <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
              <Fan className="h-3.5 w-3.5 animate-spin" /> ON (1,400 RPM)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Condenser Fan:</span>
            <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
              <Fan className="h-3.5 w-3.5 animate-spin" /> ON (Variable Speed)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Cooling Loop Status:</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">
              Active Refrigeration
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 16: Interactive Refrigeration Cycle Schematic Diagram */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="mb-6">
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Complete Thermodynamic Refrigeration Schematic Diagram
          </h2>
          <p className="text-xs text-slate-500">
            Physical refrigerant circuit: Vapor compression, heat rejection, throttling expansion, and cooling distribution
          </p>
        </div>

        {/* Visual Flow Schematic */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center">
          {/* Step 1: Solar */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-2xs">
            <Sun className="h-6 w-6 text-amber-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">Solar Panels</span>
            <span className="text-[10px] text-amber-800 font-mono block">3.0 kWp DC</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Step 2: Battery/Inverter */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 shadow-2xs">
            <BatteryCharging className="h-6 w-6 text-blue-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">Battery / Inverter</span>
            <span className="text-[10px] text-blue-800 font-mono block">48V 100Ah</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Step 3: Compressor */}
          <div className="rounded-xl border border-cyan-300 bg-cyan-50 p-3 shadow-2xs">
            <Fan className="h-6 w-6 text-cyan-600 mx-auto mb-1.5 animate-spin" />
            <span className="text-xs font-bold text-slate-900 block">1.5 HP Compressor</span>
            <span className="text-[10px] text-cyan-800 font-mono block">VCRC Inverter</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Step 4: Condenser */}
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 shadow-2xs">
            <Thermometer className="h-6 w-6 text-rose-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">Air Condenser</span>
            <span className="text-[10px] text-rose-800 font-mono block">Heat Rejection</span>
          </div>
        </div>

        {/* Second Row of schematic connecting into Cold Chamber */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center max-w-4xl mx-auto">
          {/* Step 5: Expansion Device */}
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 shadow-2xs">
            <Sliders className="h-6 w-6 text-purple-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">Electronic TXV</span>
            <span className="text-[10px] text-purple-800 font-mono block">Expansion Valve</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Step 6: Evaporator */}
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 shadow-2xs">
            <Fan className="h-6 w-6 text-teal-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">Dual Evaporator</span>
            <span className="text-[10px] text-teal-800 font-mono block">Direct Expansion</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Step 7: Cold Chambers */}
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 shadow-2xs">
            <Layers className="h-6 w-6 text-emerald-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">Cold Storage Chambers</span>
            <span className="text-[10px] text-emerald-800 font-mono block">4 Chambers (400kg)</span>
          </div>
        </div>

        {/* Operating Pressures & Temperatures Table */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Suction Pressure:</span>
            <span className="font-mono font-bold text-slate-900">2.1 bar (Evaporating: -4.5°C)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Discharge Pressure:</span>
            <span className="font-mono font-bold text-slate-900">13.8 bar (Condensing: +42°C)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Operating Superheat:</span>
            <span className="font-mono font-bold text-slate-900">5.2 K (Compressor Safe)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Subcooling Margin:</span>
            <span className="font-mono font-bold text-slate-900">4.1 K (Zero Flash Gas)</span>
          </div>
        </div>
      </div>

      {/* SAFETY CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900">Confirm Compressor Override</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Overriding the refrigeration compressor to <strong>{pendingCompressorMode}</strong> manually bypasses automated chamber setpoint loops.
              Ensure chamber temperatures are actively observed to prevent chilling damage or heat buildup.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCompressorMode}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

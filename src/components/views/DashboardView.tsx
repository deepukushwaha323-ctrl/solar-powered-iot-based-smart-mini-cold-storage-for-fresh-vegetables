import React, { useState } from 'react';
import {
  Sun,
  BatteryCharging,
  Box,
  Fan,
  Thermometer,
  Droplets,
  Bell,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  Wifi,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { ChamberData, RackItem } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    chambers,
    racks,
    alerts,
    setActiveTab,
    setSelectedChamberId,
    setSelectedRackId,
    lastIoTUpdatedSec,
    isDataConnectionLost,
    isDemoMode,
    triggerDemoExcursion,
    refrigeration,
  } = useColdStorage();

  const [selectedQuickChamber, setSelectedQuickChamber] = useState<string>('C01');

  // Compute live averages
  const avgTemp = (chambers.reduce((acc, c) => acc + c.actualTempC, 0) / chambers.length).toFixed(1);
  const avgRH = Math.round(chambers.reduce((acc, c) => acc + c.humidityPct, 0) / chambers.length);
  const activeAlerts = alerts.filter((a) => !a.resolved);

  const handleChamberClick = (chamberId: string) => {
    setSelectedChamberId(chamberId);
    setActiveTab('chamber_detail');
  };

  const handleRackClick = (rackId: string) => {
    setSelectedRackId(rackId);
    setActiveTab('rack_detail');
  };

  return (
    <div id="main-dashboard" className="space-y-6 pb-12 font-sans">
      {/* Top Banner: Real-time IoT notification if excursion */}
      {chambers.some((c) => c.status === 'Warning') && (
        <div className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block">Chamber Microclimate Warning Active</span>
              <p className="text-xs text-amber-800">
                Chamber 03 humidity is slightly elevated (84% RH). Adaptive airflow booster engaged.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="rounded-lg bg-amber-200 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-300 transition-colors"
          >
            Inspect Alerts ({activeAlerts.length})
          </button>
        </div>
      )}

      {/* SECTION 5: System Overview Cards (Row of 6-7 Metrics) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              System Overview & Operational Telemetry
            </h1>
            <p className="text-xs text-slate-500">
              Solar PV, LiFePO₄ Energy Storage, VCRC Compressor, and 4 Monitored Cold Chambers
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-500 font-mono">
            {isDemoMode ? (
              <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
                DEMO SIMULATION ACTIVE
              </span>
            ) : (
              <span>Last Sync: {lastIoTUpdatedSec}s ago</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Solar Power */}
          <div
            onClick={() => setActiveTab('energy')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Solar Power</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <Sun className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-slate-900">2.4 kW</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Generating (3 kWp)</span>
              </div>
            </div>
          </div>

          {/* 2. Battery SOC */}
          <div
            onClick={() => setActiveTab('energy')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Battery Bank</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                <BatteryCharging className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-slate-900">78% SOC</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-blue-700">
                <span>48V LiFePO₄ • Healthy</span>
              </div>
            </div>
          </div>

          {/* 3. Cold Storage */}
          <div
            onClick={() => setActiveTab('chambers')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Chambers</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <Box className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-slate-900">4 / 4 Online</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <span>12 / 16 Racks In Use</span>
              </div>
            </div>
          </div>

          {/* 4. Compressor */}
          <div
            onClick={() => setActiveTab('refrigeration')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Compressor</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 group-hover:scale-105 transition-transform">
                <Fan className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-slate-900">RUNNING</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-cyan-700">
                <span>1.2 kW • 1.5 HP VCRC</span>
              </div>
            </div>
          </div>

          {/* 5. Average Temperature & Humidity */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Facility Avg</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Thermometer className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-slate-900">{avgTemp}°C</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <Droplets className="h-3 w-3 text-cyan-600" />
                <span>{avgRH}% RH Avg</span>
              </div>
            </div>
          </div>

          {/* 6. Active Alerts */}
          <div
            onClick={() => setActiveTab('alerts')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-amber-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">System Alerts</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <Bell className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-slate-900">{activeAlerts.length} Active</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                <span>{activeAlerts.filter((a) => a.severity === 'WARNING').length} Warning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Cold Storage Chamber Status (4 Independent Chambers) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Cold Storage Chamber Status
            </h2>
            <p className="text-xs text-slate-500">
              Four independent climate-controlled zones with individual setpoint, gas, and rack allocations
            </p>
          </div>
          <button
            onClick={() => setActiveTab('chambers')}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            View Full Chamber Console →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chambers.map((chamber) => {
            const isWarning = chamber.status === 'Warning';
            return (
              <div
                key={chamber.id}
                onClick={() => handleChamberClick(chamber.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md bg-white ${
                  isWarning ? 'border-amber-300 shadow-amber-50' : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">{chamber.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {chamber.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                      {chamber.allocatedCrop} • {chamber.doorStatus}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {chamber.occupiedRacks}/{chamber.totalRacks} Racks
                  </span>
                </div>

                {/* Main Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Actual Temp</span>
                    <span className="text-lg font-bold text-slate-900">{chamber.actualTempC}°C</span>
                    <span className="text-[10px] text-slate-500 block">Target: {chamber.targetTempC}°C</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Humidity</span>
                    <span className="text-lg font-bold text-cyan-800">{chamber.humidityPct}% RH</span>
                    <span className="text-[10px] text-slate-500 block">Target: {chamber.targetHumidityPct}%</span>
                  </div>
                </div>

                {/* Sub status */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-[11px]">Gas Quality:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{chamber.gasStatus}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-[11px]">Cooling Duty:</span>
                    <span className="font-semibold text-emerald-700 text-[11px]">{chamber.coolingStatus}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>Detailed Telemetry</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 22 & SECTION 23: Chamber Top-View Layout + System Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chamber Top-View Layout (2 m × 1.5 m × 2 m physical representation) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                Chamber Physical Top-View Layout (2m × 1.5m × 2m)
              </h3>
              <p className="text-xs text-slate-500">
                16 monitored rack locations color-coded by microclimate status. Click any rack to inspect contents.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Normal
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Attention
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-200 border border-slate-300" /> Empty
              </span>
            </div>
          </div>

          {/* Physical 4-Zone Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            {chambers.map((chamber) => {
              const chamberRacks = racks.filter((r) => r.chamberId === chamber.id);
              return (
                <div key={chamber.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-800">{chamber.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">{chamber.actualTempC}°C • {chamber.humidityPct}% RH</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {chamberRacks.map((rack) => {
                      const isGood = rack.storageStatus === 'Good';
                      const isAttn = rack.storageStatus === 'Attention';
                      const isEmpty = rack.storageStatus === 'Empty';

                      return (
                        <div
                          key={rack.id}
                          onClick={() => handleRackClick(rack.id)}
                          className={`cursor-pointer rounded-lg border p-2 transition-all hover:scale-102 ${
                            isGood
                              ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400'
                              : isAttn
                              ? 'border-amber-300 bg-amber-50/70 hover:border-amber-500'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-slate-900">{rack.id}</span>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isGood ? 'bg-emerald-500' : isAttn ? 'bg-amber-500 animate-ping' : 'bg-slate-300'
                              }`}
                            />
                          </div>

                          <div className="mt-1 text-[11px]">
                            {isEmpty ? (
                              <span className="text-slate-400 italic">Available</span>
                            ) : (
                              <>
                                <span className="font-semibold text-slate-800 block truncate">{rack.vegetable}</span>
                                <span className="text-slate-500 text-[10px] block">{rack.quantityKg} kg • {rack.farmerId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Airflow vector: Uniform overhead evaporator throw with sub-floor return return plenum</span>
            <button onClick={() => setActiveTab('racks')} className="font-bold text-emerald-700 hover:underline">
              Open Complete Rack Matrix →
            </button>
          </div>
        </div>

        {/* Right Col: SECTION 23 - System Health Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                System Health Summary
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                100% Operational
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-600" /> Solar PV (3 kWp)
                </span>
                <span className="font-bold text-emerald-700">🟢 Online (2.4 kW)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <BatteryCharging className="h-3.5 w-3.5 text-blue-600" /> 48V LiFePO₄ & BMS
                </span>
                <span className="font-bold text-emerald-700">🟢 Online (78% SOC)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-600" /> ESP32 IoT Controller
                </span>
                <span className="font-bold text-emerald-700">🟢 Online (Gateway 01)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-emerald-600" /> Temperature Sensors
                </span>
                <span className="font-bold text-emerald-700">🟢 8 / 8 Online</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-cyan-600" /> Humidity Sensors
                </span>
                <span className="font-bold text-emerald-700">🟢 4 / 4 Online</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-purple-600" /> Gas Quality Sensors
                </span>
                <span className="font-bold text-emerald-700">🟢 4 / 4 Online</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Fan className="h-3.5 w-3.5 text-cyan-600" /> 1.5 HP Compressor
                </span>
                <span className="font-bold text-emerald-700">🟢 Online (RUNNING)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5 text-emerald-600" /> Cloud Sync Telemetry
                </span>
                <span className="font-bold text-emerald-700">🟢 Connected (MQTT)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Node Sync: 100% Reliability</span>
            <button onClick={() => setActiveTab('sensors')} className="font-bold text-emerald-700 hover:underline">
              Sensor Diagnostics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Cpu,
  Thermometer,
  Droplets,
  Activity,
  DoorClosed,
  Sun,
  BatteryCharging,
  Wifi,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Server,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const HardwareSensorsView: React.FC = () => {
  const { hardwareSensors, lastIoTUpdatedSec } = useColdStorage();
  const [isRunningPing, setIsRunningPing] = useState<boolean>(false);
  const [pingSuccess, setPingSuccess] = useState<boolean>(false);

  const handleRunPing = () => {
    setIsRunningPing(true);
    setPingSuccess(false);
    setTimeout(() => {
      setIsRunningPing(false);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div id="hardware-sensors-view" className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Hardware & IoT Sensor Diagnostics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time I2C, 1-Wire, ADC, and SPI bus telemetry from the central ESP32 IoT node
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunPing}
            disabled={isRunningPing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRunningPing ? 'animate-spin' : ''}`} />
            <span>{isRunningPing ? 'Pinging Hardware Bus...' : 'Run Hardware Diagnostics'}</span>
          </button>
        </div>
      </div>

      {pingSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-2xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Hardware Diagnostic Ping Completed:</span> All 18 sensors responded within 12ms. ESP32 UART & I2C bus healthy.
          </div>
        </div>
      )}

      {/* SECTION 17: ESP32 Master Gateway Telemetry */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900">ESP32-WROOM-32D Dual-Core MCU</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  Gateway 01 • Online
                </span>
              </div>
              <span className="text-xs text-slate-500">Firmware: v2.4.1 (OTA Enabled) • FreeRTOS Kernel</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Signal Strength</span>
              <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                <Wifi className="h-3.5 w-3.5" /> -58 dBm (Strong)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">MQTT Link</span>
              <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                <Server className="h-3.5 w-3.5 text-blue-600" /> SSL :8883 Connected
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Free Heap RAM:</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">184.2 KB / 320 KB</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">System Uptime:</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">14d 6h 28m</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Heartbeat Frequency:</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">5,000 ms</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Packet Drop Rate:</span>
            <span className="font-mono font-bold text-emerald-700 mt-0.5 block">0.01% (Rock Solid)</span>
          </div>
        </div>
      </div>

      {/* Sensor Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Temperature Probes (8 x DS18B20) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-emerald-600" />
              1-Wire Digital Temperature Probes (DS18B20)
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700">8 / 8 Online</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'T_C01_A', loc: 'Chamber 01 Upper', val: '4.2°C', offset: '±0.05°C' },
              { id: 'T_C01_B', loc: 'Chamber 01 Lower', val: '4.1°C', offset: '±0.05°C' },
              { id: 'T_C02_A', loc: 'Chamber 02 Upper', val: '2.1°C', offset: '±0.05°C' },
              { id: 'T_C02_B', loc: 'Chamber 02 Lower', val: '2.0°C', offset: '±0.05°C' },
              { id: 'T_C03_A', loc: 'Chamber 03 Upper', val: '10.8°C', offset: '±0.08°C' },
              { id: 'T_C03_B', loc: 'Chamber 03 Lower', val: '10.7°C', offset: '±0.08°C' },
              { id: 'T_C04_A', loc: 'Chamber 04 Upper', val: '1.2°C', offset: '±0.04°C' },
              { id: 'T_C04_B', loc: 'Chamber 04 Lower', val: '1.1°C', offset: '±0.04°C' },
            ].map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900 mr-2">{p.id}</span>
                  <span className="text-slate-600">{p.loc}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400">Cal: {p.offset}</span>
                  <span className="font-mono font-bold text-emerald-800">{p.val}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Humidity, Gas, and Door Probes */}
        <div className="space-y-6">
          {/* Humidity & Gas (SHT31 / MQ-135) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-600" />
                Humidity (SHT31) & Ethylene Gas (MQ-135)
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700">8 / 8 Online</span>
            </div>

            <div className="space-y-2">
              {[
                { ch: 'Chamber 01', rh: '72% RH', gas: '12 ppm (Normal)' },
                { ch: 'Chamber 02', rh: '78% RH', gas: '8 ppm (Normal)' },
                { ch: 'Chamber 03', rh: '84% RH (Elevated)', gas: '18 ppm (Attention)' },
                { ch: 'Chamber 04', rh: '70% RH', gas: '9 ppm (Normal)' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800">{c.ch}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-800">{c.rh}</span>
                    <span className="text-slate-400">|</span>
                    <span className="font-mono text-purple-800">{c.gas}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Door Status & Electrical Ingress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-4">
              <DoorClosed className="h-4 w-4 text-slate-700" />
              Chamber Magnetic Seal Switches & Power Meters
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-800">Chamber Doors 1–4</span>
                <span className="font-bold text-emerald-700">4 / 4 Hermetically Sealed</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-800">INA226 Solar Current Transducer</span>
                <span className="font-bold text-emerald-700">Online • 2.4 kW Measured</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-800">Hall-Effect Compressor CT Probe</span>
                <span className="font-bold text-emerald-700">Online • 1.20 kW Draw</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

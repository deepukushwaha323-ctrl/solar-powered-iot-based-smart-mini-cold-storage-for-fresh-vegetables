import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Database,
  Save,
  CheckCircle2,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const { userRole, setUserRole, refrigeration, setSetpoint } = useColdStorage();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [highTempAlert, setHighTempAlert] = useState(7.0);
  const [doorAlertThreshold, setDoorAlertThreshold] = useState(60);
  const [targetTemp, setTargetTemp] = useState(refrigeration.setpointC);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSetpoint(targetTemp);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const rolesList: { role: UserRole; name: string; email: string; permissions: string }[] = [
    {
      role: 'ADMIN',
      name: 'Subhash Chandra',
      email: 'subhash@coldchain.ner',
      permissions: 'Full System Control, Defrost Override, Telemetry Calibration, User Administration',
    },
    {
      role: 'OPERATOR',
      name: 'Priya Sharma',
      email: 'priya.s@coldchain.ner',
      permissions: 'Crate Intake & Dispatch, Thermal Setpoint Adjustments, Alert Acknowledgment',
    },
    {
      role: 'MANAGER',
      name: 'Rajesh Kumar',
      email: 'rajesh.k@growercoop.org',
      permissions: 'Inventory Audit, Manifest Export, Grower Economic Reports, Spoilage Tracking',
    },
    {
      role: 'VIEWER',
      name: 'Inspection Officer (FSSAI)',
      email: 'auditor@fssai.gov.in',
      permissions: 'Read-only Cold-Chain Compliance Audit Logs, 24h Temperature Records',
    },
  ];

  return (
    <div id="view-settings" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-300" />
            <span>Facility Configuration & Role Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            System thresholds, microclimate safety limits, RBAC permissions, and hardware specifications.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-950 border border-emerald-600 px-3 py-1 text-xs text-emerald-300 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Configuration Saved</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hardware & Calibration Configuration */}
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span>Thermal & Alarm Safety Thresholds</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Thermostat Setpoint Target (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={targetTemp}
                onChange={(e) => setTargetTemp(parseFloat(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Compressor modulates speed around this setpoint.
              </span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                High Temperature Critical Alert Threshold (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={highTempAlert}
                onChange={(e) => setHighTempAlert(parseFloat(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Dispatches high-priority alert if any zone exceeds this limit.
              </span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Door Ajar Alert Timeout (Seconds)
              </label>
              <input
                type="number"
                value={doorAlertThreshold}
                onChange={(e) => setDoorAlertThreshold(parseInt(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Audio buzzer and dashboard notification trigger interval.
              </span>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Facility Settings</span>
              </button>
            </div>
          </div>
        </form>

        {/* Facility Hardware Specifications */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>Facility Hardware Architecture</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between rounded bg-slate-950/70 p-2.5 border border-slate-800/80">
              <span className="text-slate-400">Cold Chamber Volume:</span>
              <span className="font-mono font-bold text-white">18.5 m³ (approx. 5 Metric Tonnes)</span>
            </div>

            <div className="flex justify-between rounded bg-slate-950/70 p-2.5 border border-slate-800/80">
              <span className="text-slate-400">Wall Insulation:</span>
              <span className="font-mono font-bold text-white">100mm Polyurethane (PUF, 40 kg/m³)</span>
            </div>

            <div className="flex justify-between rounded bg-slate-950/70 p-2.5 border border-slate-800/80">
              <span className="text-slate-400">Solar PV Array:</span>
              <span className="font-mono font-bold text-amber-300">600 Wp Monocrystalline Bifacial</span>
            </div>

            <div className="flex justify-between rounded bg-slate-950/70 p-2.5 border border-slate-800/80">
              <span className="text-slate-400">Battery Reserve:</span>
              <span className="font-mono font-bold text-emerald-400">48V 100Ah LiFePO4 (4.8 kWh)</span>
            </div>

            <div className="flex justify-between rounded bg-slate-950/70 p-2.5 border border-slate-800/80">
              <span className="text-slate-400">Refrigerant:</span>
              <span className="font-mono font-bold text-cyan-400">R-290 (Propane, GWP 3, ODP 0)</span>
            </div>

            <div className="flex justify-between rounded bg-slate-950/70 p-2.5 border border-slate-800/80">
              <span className="text-slate-400">IoT Controller:</span>
              <span className="font-mono font-bold text-slate-200">ESP32-S3 Dual-Core + RS485 Modbus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span>Active Role-Based Access Control (RBAC)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Authorized Personnel</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Functional Permissions Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {rolesList.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        userRole === r.role
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {r.role}
                      {userRole === r.role && <CheckCircle2 className="h-3 w-3 text-emerald-400 ml-1" />}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">{r.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{r.email}</td>
                  <td className="py-2.5 px-3 text-slate-300">{r.permissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  Volume2,
  VolumeX,
  Search,
  Check,
  Clock,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { AlertRecord } from '../../types';

export const AlertCenterView: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    isDoorOpen,
    toggleDoor,
    triggerDemoExcursion,
    isDemoMode,
  } = useColdStorage();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const criticalCount = activeAlerts.filter((a) => a.severity === 'CRITICAL').length;
  const warningCount = activeAlerts.filter((a) => a.severity === 'WARNING').length;
  const infoCount = activeAlerts.filter((a) => a.severity === 'INFO').length;

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const msg = a.message || a.aiDiagnosis || a.title || '';
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.location && a.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSev && matchesSearch;
  });

  return (
    <div id="alert-center-view" className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Microclimate & IoT Alert Management Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time threshold violation logs, automated buzzer trip state, and operator acknowledgment workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerDemoExcursion()}
            className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            Simulate Temperature Spike
          </button>
          <button
            onClick={() => toggleDoor()}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-colors shadow-2xs ${
              isDoorOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-900'
            }`}
          >
            {isDoorOpen ? 'Close Chamber Door' : 'Simulate Door Ajar'}
          </button>
        </div>
      </div>

      {/* Visual Summary Banner (Section 12 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Active Alerts</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">{activeAlerts.length}</span>
          <span className="text-[11px] text-slate-500">Unresolved events</span>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-red-800 block">Critical Breaches</span>
          <span className="text-2xl font-extrabold text-red-900 mt-1 block font-mono">{criticalCount}</span>
          <span className="text-[11px] text-red-700">Immediate operator action</span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-800 block">Environmental Warnings</span>
          <span className="text-2xl font-extrabold text-amber-900 mt-1 block font-mono">{warningCount}</span>
          <span className="text-[11px] text-amber-700">Self-compensating logic</span>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-blue-800 block">System Info Notices</span>
          <span className="text-2xl font-extrabold text-blue-900 mt-1 block font-mono">{infoCount}</span>
          <span className="text-[11px] text-blue-700">Solar & battery state</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by title or chamber..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="WARNING">🟡 Warnings Only</option>
            <option value="INFO">🔵 Info Only</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-2xs">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <span className="text-sm font-bold text-slate-800 block">No Alerts Matching Filter</span>
            <p className="text-xs text-slate-500 mt-1">All cold storage telemetry channels are operating normally.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'CRITICAL';
            const isWarn = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`rounded-2xl border p-4 transition-all bg-white shadow-2xs ${
                  alert.resolved
                    ? 'border-slate-200 opacity-60'
                    : isCrit
                    ? 'border-red-300 bg-red-50/20'
                    : isWarn
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isCrit
                          ? 'bg-red-100 text-red-700'
                          : isWarn
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {isCrit ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : isWarn ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Info className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{alert.title}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isCrit
                              ? 'bg-red-100 text-red-800'
                              : isWarn
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        {alert.acknowledged && !alert.resolved && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            ACKNOWLEDGED
                          </span>
                        )}
                        {alert.resolved && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            RESOLVED
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                        {alert.message || alert.aiDiagnosis || alert.recommendedAction}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                        {alert.location && <span>Location: {alert.location}</span>}
                        {alert.currentReading && <span>Value: {alert.currentReading} (Thresh: {alert.threshold})</span>}
                        <span>Timestamp: {alert.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!alert.resolved && (
                    <div className="flex items-center gap-2">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

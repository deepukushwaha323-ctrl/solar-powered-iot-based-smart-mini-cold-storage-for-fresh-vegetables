import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { AlertItem, AlertSeverity } from '../../types';

export const AlertsView: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    toggleDoor,
    setDigitalTwinMode,
    setActiveTab,
    dispatchCrate,
    setSetpoint,
  } = useColdStorage();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  const handleExecutePrescription = (alert: AlertItem) => {
    if (alert.title.toLowerCase().includes('door')) {
      toggleDoor(false);
      resolveAlert(alert.id);
    } else if (alert.title.toLowerCase().includes('ethylene')) {
      setDigitalTwinMode('ETHYLENE');
      setActiveTab('digitaltwin');
    } else if (alert.title.toLowerCase().includes('spinach') || alert.title.toLowerCase().includes('cr-002')) {
      dispatchCrate('CR-002');
      resolveAlert(alert.id);
    } else if (alert.title.toLowerCase().includes('temperature') || alert.title.toLowerCase().includes('heat')) {
      setSetpoint(3.0);
      resolveAlert(alert.id);
    } else {
      resolveAlert(alert.id);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (!showResolved && a.resolved) return false;
    if (showResolved && !a.resolved) return false;
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    return true;
  });

  const pendingCount = alerts.filter((a) => !a.resolved).length;
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.resolved).length;

  return (
    <div id="view-alerts" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-amber-400" />
            <span>Smart Alerts & Anomaly Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated threshold triggers, AI root cause diagnosis, and operator acknowledgment workflows.
          </p>
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-red-800/80 bg-red-950/40 px-3 py-1.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="font-bold">{criticalCount} Critical</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
            <span className="font-bold">{pendingCount} Active Total</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowResolved(false)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              !showResolved
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Incidents ({pendingCount})
          </button>
          <button
            onClick={() => setShowResolved(true)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              showResolved
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved History ({alerts.filter((a) => a.resolved).length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 font-medium focus:outline-hidden"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
            <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400 mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-200">Zero Active Incidents</h4>
            <p className="text-xs text-slate-400 mt-1">
              All microclimate, power, and refrigeration sensors operating within safe parameters.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              id={`alert-card-${alert.id}`}
              className={`rounded-xl border p-4 transition-all shadow-sm ${
                alert.resolved
                  ? 'border-slate-800/60 bg-slate-950/40 opacity-70'
                  : alert.severity === 'CRITICAL'
                  ? 'border-red-600/50 bg-red-950/20'
                  : alert.severity === 'WARNING'
                  ? 'border-amber-600/50 bg-amber-950/20'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border ${
                      alert.severity === 'CRITICAL'
                        ? 'border-red-700 bg-red-950 text-red-400'
                        : alert.severity === 'WARNING'
                        ? 'border-amber-700 bg-amber-950 text-amber-400'
                        : 'border-cyan-700 bg-cyan-950 text-cyan-400'
                    }`}
                  >
                    {alert.severity === 'CRITICAL' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border-red-700'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : 'bg-cyan-950 text-cyan-300 border-cyan-700'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-mono text-xs text-slate-400">{alert.id}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{alert.timestamp}</span>
                    </div>

                    <h4 className="text-base font-bold text-white mt-1">{alert.title}</h4>
                    <p className="text-xs text-slate-300">
                      Location: <span className="font-semibold text-white">{alert.location}</span> • Sensor:{' '}
                      <span className="font-mono text-emerald-400">{alert.sensorId}</span>
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2">
                  {!alert.resolved && (
                    <>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Resolve</span>
                      </button>
                    </>
                  )}

                  {alert.resolved && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>

              {/* AI Diagnosis Block */}
              <div className="mt-3.5 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Root Cause Diagnosis</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{alert.aiDiagnosis}</p>
                <div className="border-t border-slate-800/80 pt-1.5 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-300">Prescriptive Action:</span>{' '}
                    {alert.recommendedAction}
                  </div>
                  {!alert.resolved && (
                    <button
                      onClick={() => handleExecutePrescription(alert)}
                      className="flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/50 px-2 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Execute Action</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

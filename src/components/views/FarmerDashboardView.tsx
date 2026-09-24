import React, { useState } from 'react';
import {
  Leaf,
  Layers,
  Thermometer,
  Droplets,
  Bell,
  CheckCircle2,
  AlertTriangle,
  History,
  MessageSquare,
  Smartphone,
  Globe,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { RackItem } from '../../types';

export const FarmerDashboardView: React.FC = () => {
  const {
    farmers,
    activeFarmerId,
    racks,
    setSelectedRackId,
    setActiveTab,
    alerts,
  } = useColdStorage();

  const [webAlerts, setWebAlerts] = useState<boolean>(true);
  const [mobilePush, setMobilePush] = useState<boolean>(true);
  const [smsWhatsapp, setSmsWhatsapp] = useState<boolean>(true);

  const farmer = farmers.find((f) => f.id === activeFarmerId) || farmers[0];
  const assignedRacks = racks.filter((r) => r.farmerId === farmer.id);

  const totalKg = assignedRacks.reduce((acc, r) => acc + r.quantityKg, 0);
  const goodCount = assignedRacks.filter((r) => r.storageStatus === 'Good').length;
  const attnCount = assignedRacks.filter((r) => r.storageStatus === 'Attention').length;
  const critCount = assignedRacks.filter((r) => r.storageStatus === 'Critical').length;

  const handleInspectRack = (rackId: string) => {
    setSelectedRackId(rackId);
    setActiveTab('rack_detail');
  };

  return (
    <div id="farmer-dashboard-view" className="space-y-6 pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Leaf className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Welcome, Farmer {farmer.name}
                </h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {farmer.code}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Village: <span className="font-semibold text-slate-800">{farmer.village}</span> • Mobile:{' '}
                <span className="font-mono text-slate-800">{farmer.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reports')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>Storage Pass</span>
            </button>
            <button
              onClick={() => setActiveTab('vegetables')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Layers className="h-4 w-4" />
              <span>All Crop Batches</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 18: My Storage Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Assigned Racks</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{assignedRacks.length} Racks</span>
          <span className="text-[11px] text-slate-500">Chambers C01, C03</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Stored Vegetables</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{totalKg} kg</span>
          <span className="text-[11px] text-slate-500">Tomato, Chilli, Potato</span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-800 block">Good Condition</span>
          <span className="text-2xl font-extrabold text-emerald-800 mt-1 block">🟢 {goodCount}</span>
          <span className="text-[11px] text-emerald-700">Optimal Microclimate</span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-800 block">Needs Attention</span>
          <span className="text-2xl font-extrabold text-amber-800 mt-1 block">🟡 {attnCount}</span>
          <span className="text-[11px] text-amber-700">Humidity Monitoring</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Critical Risk</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">🔴 {critCount}</span>
          <span className="text-[11px] text-slate-500">Zero Spoilage</span>
        </div>
      </div>

      {/* Rack Cards for this Farmer */}
      <div>
        <h2 className="text-base font-bold tracking-tight text-slate-900 mb-3">
          My Monitored Vegetable Racks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedRacks.map((rack) => {
            const isGood = rack.storageStatus === 'Good';
            const isAttn = rack.storageStatus === 'Attention';

            return (
              <div
                key={rack.id}
                className={`rounded-2xl border p-5 bg-white shadow-2xs transition-all hover:shadow-md ${
                  isAttn ? 'border-amber-300' : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                {/* Top: Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-slate-900">{rack.id}</span>
                      <span className="text-xs font-semibold text-slate-500">• {rack.chamberName}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-900 block mt-0.5">
                      {rack.vegetable} ({rack.variety})
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isGood ? '🟢 GOOD' : '🟡 ATTENTION'}
                  </span>
                </div>

                {/* Storage Condition Score */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Condition Score</span>
                    <span className="text-xs font-bold text-slate-800">
                      Calculated from IoT sensor trends
                    </span>
                  </div>
                  <span className="text-lg font-mono font-extrabold text-emerald-700">
                    {rack.conditionScore}/100
                  </span>
                </div>

                {/* Microclimate Cards */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Thermometer className="h-3 w-3 text-emerald-600" /> Rack Temp
                    </span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">{rack.currentTempC}°C</span>
                    <span className="text-[10px] text-slate-400">Target: {rack.targetTempRange[0]}-{rack.targetTempRange[1]}°C</span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-cyan-600" /> Humidity
                    </span>
                    <span className="text-sm font-bold text-cyan-800 mt-0.5 block">{rack.humidityPct}% RH</span>
                    <span className="text-[10px] text-slate-400">Target: {rack.targetHumidityRange[0]}-{rack.targetHumidityRange[1]}%</span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Batch Quantity:</span>
                    <span className="font-semibold text-slate-800">{rack.quantityKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loading Date:</span>
                    <span className="font-semibold text-slate-800">{rack.loadingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stored Duration:</span>
                    <span className="font-semibold text-slate-800">{rack.storageDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Air / Gas Status:</span>
                    <span className="font-semibold text-slate-800">{rack.gasStatus}</span>
                  </div>
                </div>

                {rack.alertMessage && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800 border border-amber-200">
                    {rack.alertMessage}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleInspectRack(rack.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>View Rack History</span>
                  </button>

                  <span className="text-[10px] text-slate-400 font-mono">
                    Batch #{rack.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 19: Farmer Notification System */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-600" />
              Farmer Multi-Channel Alert & Notification Center
            </h2>
            <p className="text-xs text-slate-500">
              Configure how you receive instantaneous microclimate alarms, door warnings, and batch reports
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            SMS / WhatsApp Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Toggle 1: Web Notification */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-emerald-600" /> Web Portal Alerts
              </span>
              <input
                type="checkbox"
                checked={webAlerts}
                onChange={(e) => setWebAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Instant in-browser banners whenever temperature drifts outside configured safety band.
            </p>
          </div>

          {/* Toggle 2: Mobile Push Notification */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-blue-600" /> Mobile Push Notifications
              </span>
              <input
                type="checkbox"
                checked={mobilePush}
                onChange={(e) => setMobilePush(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Direct push notification to registered Android smartphone via AgriCold PWA.
            </p>
          </div>

          {/* Toggle 3: SMS & WhatsApp Alerts */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-600" /> SMS & WhatsApp Messaging
              </span>
              <input
                type="checkbox"
                checked={smsWhatsapp}
                onChange={(e) => setSmsWhatsapp(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Emergency texts to <span className="font-mono font-semibold">{farmer.phone}</span> in regional language.
            </p>
          </div>
        </div>

        {/* Live Notification Message Previews */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Recent Multi-Channel Message Dispatch Log
          </h3>

          <div className="space-y-2">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs">
              <MessageSquare className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">WhatsApp Alert Dispatched • +91 98765 43210</span>
                  <span className="text-[10px] text-slate-400 font-mono">Today, 11:20 AM</span>
                </div>
                <p className="text-amber-800 mt-0.5">
                  "🟡 AgriCold Warning: Humidity in your Rack R09 (Potato) has reached 84% RH (target: 80%). Compressor airflow booster is compensating. Crop condition remains Good."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
              <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">SMS Verification Dispatched • +91 98765 43210</span>
                  <span className="text-[10px] text-slate-400 font-mono">Yesterday, 08:00 AM</span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  "🟢 AgriCold Daily Update: All 3 of your racks (R01, R04, R09) are at normal temperature (4.2°C, 2.1°C, 10.8°C). Solar generation: 14.8 kWh."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

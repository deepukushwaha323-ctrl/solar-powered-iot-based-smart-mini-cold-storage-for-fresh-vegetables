import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  FileText,
  Printer,
  CheckCircle2,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import {
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

export const ReportsAnalyticsView: React.FC = () => {
  const { farmers, racks, chambers } = useColdStorage();

  const [dateRange, setDateRange] = useState<string>('7D');
  const [selectedParam, setSelectedParam] = useState<string>('temp');
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [receiptRackId, setReceiptRackId] = useState<string>('R01');

  // Realistic historical analytics dataset
  const analyticsData = [
    { day: '16 Sep', temp: 4.3, humidity: 71, solarKwh: 14.2, compHours: 12.5 },
    { day: '17 Sep', temp: 4.1, humidity: 72, solarKwh: 15.1, compHours: 13.0 },
    { day: '18 Sep', temp: 4.4, humidity: 73, solarKwh: 13.8, compHours: 12.2 },
    { day: '19 Sep', temp: 4.2, humidity: 70, solarKwh: 14.9, compHours: 12.8 },
    { day: '20 Sep', temp: 4.5, humidity: 74, solarKwh: 16.0, compHours: 13.4 },
    { day: '21 Sep', temp: 4.2, humidity: 72, solarKwh: 14.5, compHours: 12.6 },
    { day: '22 Sep (Today)', temp: 4.2, humidity: 72, solarKwh: 14.8, compHours: 12.7 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Date,Facility Avg Temp (C),Avg Humidity (%),Solar Generation (kWh),Compressor Hours\n' +
      analyticsData.map((d) => `${d.day},${d.temp},${d.humidity},${d.solarKwh},${d.compHours}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIH2026_ColdStorage_Telemetry_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedRack = racks.find((r) => r.id === receiptRackId) || racks[0];

  return (
    <div id="reports-analytics-view" className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Historical Telemetry & Agronomic Reporting
          </h1>
          <p className="text-xs text-slate-500">
            Export certified cold chain provenance logs, energy audit datasets, and farmer storage receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileText className="h-4 w-4 text-emerald-600" />
            <span>Issue Storage Pass / Receipt</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Date Range & Parameter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Time Range:</span>
          {(['TODAY', 'YESTERDAY', '7D', '30D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                dateRange === r
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === '7D' ? 'Last 7 Days' : r === '30D' ? 'Last 30 Days' : r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Metric:</span>
          <select
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="temp">Facility Temperature (°C)</option>
            <option value="humidity">Relative Humidity (% RH)</option>
            <option value="solar">Solar Generation (kWh)</option>
            <option value="compressor">Compressor Runtime (Hours)</option>
          </select>
        </div>
      </div>

      {/* SECTION 20: Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Average Temp</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">4.2°C</span>
          <span className="text-[11px] text-slate-500">Min 4.1°C • Max 4.5°C</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Stability Index (SD)</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">±0.12°C</span>
          <span className="text-[11px] text-slate-500">Grade A Cold Chain</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Thermal Excursions</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">0 Hours</span>
          <span className="text-[11px] text-emerald-700 font-semibold">100% In-Band</span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-800 block">7-Day Solar Energy</span>
          <span className="text-2xl font-extrabold text-amber-900 mt-1 block">103.3 kWh</span>
          <span className="text-[11px] text-amber-700">100% Clean Rooftop PV</span>
        </div>

        <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-cyan-800 block">Compressor Runtime</span>
          <span className="text-2xl font-extrabold text-cyan-900 mt-1 block">89.2 Hours</span>
          <span className="text-[11px] text-cyan-700">53% Daily Duty Cycle</span>
        </div>
      </div>

      {/* Interactive Trend Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-emerald-600" />
          Multi-Day Operational Analytics
        </h2>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="solarKwh" name="Solar Gen (kWh)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="compHours" name="Compressor Runtime (h)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STORAGE PASS / RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-slate-900">
            {/* Printable Pass Header */}
            <div className="flex items-start justify-between border-b pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Government of India • Smart India Hackathon 2026
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  DECENTRALIZED MINI COLD STORAGE PASS
                </h3>
                <span className="text-xs text-slate-500">Official Electronic Provenance Receipt</span>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-1 font-mono text-xs font-bold text-emerald-800">
                VERIFIED BATCH
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Rack to Generate Pass</label>
              <select
                value={receiptRackId}
                onChange={(e) => setReceiptRackId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono font-bold text-slate-800 focus:outline-hidden"
              >
                {racks.filter((r) => r.storageStatus !== 'Empty').map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} — {r.vegetable} ({r.farmerName} • {r.quantityKg} kg)
                  </option>
                ))}
              </select>
            </div>

            {/* Receipt Summary Body */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Ref:</span>
                <span className="font-mono font-bold">SIH-CS-2026-{selectedRack.id}-9841</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer Name:</span>
                <span className="font-bold">{selectedRack.farmerName} ({selectedRack.farmerId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vegetable & Variety:</span>
                <span className="font-bold text-emerald-900">{selectedRack.vegetable} ({selectedRack.variety})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Quantity:</span>
                <span className="font-bold">{selectedRack.quantityKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Intake Chamber & Rack:</span>
                <span className="font-mono font-bold">{selectedRack.chamberName} • Rack {selectedRack.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Loading Timestamp:</span>
                <span>{selectedRack.loadingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Storage Quality Score:</span>
                <span className="font-bold text-emerald-700">{selectedRack.conditionScore}/100 (Optimal)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print Storage Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  ArrowLeft,
  Plus,
  Thermometer,
  Droplets,
  Calendar,
  User,
  History,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Truck,
  Sparkles,
  Info,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { RackItem } from '../../types';

export const RackManagementView: React.FC = () => {
  const {
    racks,
    chambers,
    farmers,
    selectedRackId,
    setSelectedRackId,
    assignRackToFarmer,
    updateRack,
  } = useColdStorage();

  const [activeSubTab, setActiveSubTab] = useState<'list' | 'detail'>('list');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chamberFilter, setChamberFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  // New rack intake form state
  const [intakeRackId, setIntakeRackId] = useState<string>('R16');
  const [intakeFarmerId, setIntakeFarmerId] = useState<string>('FARMER_001');
  const [intakeCrop, setIntakeCrop] = useState<string>('Capsicum');
  const [intakeVariety, setIntakeVariety] = useState<string>('Green Bell');
  const [intakeQuantity, setIntakeQuantity] = useState<number>(45);

  const selectedRack = racks.find((r) => r.id === selectedRackId) || racks[0];

  const filteredRacks = racks.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vegetable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChamber = chamberFilter === 'ALL' || r.chamberId === chamberFilter;
    const matchesStatus = statusFilter === 'ALL' || r.storageStatus === statusFilter;
    return matchesSearch && matchesChamber && matchesStatus;
  });

  const handleOpenRackDetail = (rackId: string) => {
    setSelectedRackId(rackId);
    setActiveSubTab('detail');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignRackToFarmer(intakeRackId, intakeFarmerId, intakeCrop, intakeVariety, Number(intakeQuantity));
    setShowAssignModal(false);
    setSelectedRackId(intakeRackId);
    setActiveSubTab('detail');
  };

  const handleDispatch = (rackId: string) => {
    if (confirm(`Confirm dispatch of vegetable batch in ${rackId}? This will free the rack for new intake.`)) {
      updateRack(rackId, {
        vegetable: 'Unallocated',
        variety: 'None',
        quantityKg: 0,
        farmerId: 'NONE',
        farmerName: 'Unassigned',
        storageStatus: 'Empty',
        conditionScore: 100,
        storageDays: 0,
        alertMessage: null,
      });
      alert(`Rack ${rackId} has been cleared and marked available.`);
    }
  };

  return (
    <div id="rack-management-view" className="space-y-6 pb-12 font-sans">
      {/* Top Breadcrumb when in Detail mode */}
      {activeSubTab === 'detail' && (
        <button
          onClick={() => setActiveSubTab('list')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All 16 Racks</span>
        </button>
      )}

      {/* SUB-VIEW 1: RACK MANAGEMENT TABLE / LIST (Section 8) */}
      {activeSubTab === 'list' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Rack-Wise Vegetable Management
              </h1>
              <p className="text-xs text-slate-500">
                16 dedicated storage rack locations across 4 chambers with micro-traceability and condition telemetry
              </p>
            </div>

            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Load / Assign Empty Rack</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Rack ID, crop, or farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={chamberFilter}
                onChange={(e) => setChamberFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">All Chambers (4)</option>
                <option value="C01">Chamber 01 (Tomato)</option>
                <option value="C02">Chamber 02 (Green Leafy)</option>
                <option value="C03">Chamber 03 (Potato)</option>
                <option value="C04">Chamber 04 (Carrot)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="Good">🟢 Good</option>
                <option value="Attention">🟡 Attention</option>
                <option value="Empty">⚪ Empty</option>
              </select>
            </div>
          </div>

          {/* Table (Section 8 Requirement) */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  <th className="px-4 py-3">Rack ID</th>
                  <th className="px-4 py-3">Chamber</th>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Vegetable</th>
                  <th className="px-4 py-3">Variety</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3">Loading Date</th>
                  <th className="px-4 py-3 text-center">Temp (°C)</th>
                  <th className="px-4 py-3 text-center">RH (%)</th>
                  <th className="px-4 py-3">Gas Status</th>
                  <th className="px-4 py-3">Storage Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRacks.map((rack) => {
                  const isGood = rack.storageStatus === 'Good';
                  const isAttn = rack.storageStatus === 'Attention';
                  const isEmpty = rack.storageStatus === 'Empty';

                  return (
                    <tr
                      key={rack.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => handleOpenRackDetail(rack.id)}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {rack.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600">
                        {rack.chamberName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {rack.farmerName}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-950">
                        {rack.vegetable}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {rack.variety}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                        {isEmpty ? '—' : `${rack.quantityKg} kg`}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {rack.loadingDate}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">
                        {rack.currentTempC}°C
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-cyan-800">
                        {rack.humidityPct}%
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600">
                        {rack.gasStatus}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isGood
                              ? 'bg-emerald-100 text-emerald-800'
                              : isAttn
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rack.storageStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRackDetail(rack.id);
                          }}
                          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SUB-VIEW 2: RACK DETAIL PAGE (Section 9) */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-extrabold text-slate-900">{selectedRack.id}</span>
                <span className="text-slate-400">|</span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {selectedRack.vegetable} ({selectedRack.variety})
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    selectedRack.storageStatus === 'Good'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedRack.storageStatus === 'Attention'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedRack.storageStatus === 'Good' ? '🟢 GOOD' : selectedRack.storageStatus === 'Attention' ? '🟡 ATTENTION' : 'EMPTY'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Located in <span className="font-semibold text-slate-800">{selectedRack.chamberName}</span> • Assigned to{' '}
                <span className="font-semibold text-slate-800">{selectedRack.farmerName}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDispatch(selectedRack.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Truck className="h-4 w-4 text-slate-500" />
                <span>Dispatch Batch</span>
              </button>
            </div>
          </div>

          {/* Large Status Cards (Section 9 Requirement) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Temperature */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-emerald-600" /> Rack Temperature
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-2 block">
                {selectedRack.currentTempC}°C
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                Configured Target: {selectedRack.targetTempRange[0]}°C – {selectedRack.targetTempRange[1]}°C
              </span>
            </div>

            {/* Card 2: Humidity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-cyan-600" /> Relative Humidity
              </span>
              <span className="text-3xl font-extrabold text-cyan-800 mt-2 block">
                {selectedRack.humidityPct}% RH
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                Configured Target: {selectedRack.targetHumidityRange[0]}% – {selectedRack.targetHumidityRange[1]}%
              </span>
            </div>

            {/* Card 3: Gas / Air Quality */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-600" /> Gas / Air Quality
              </span>
              <span className="text-2xl font-extrabold text-slate-800 mt-2 block">
                {selectedRack.gasStatus}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                MQ-135 Sensor: Clean Atmosphere
              </span>
            </div>

            {/* Card 4: Storage Status */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-2xs">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Storage Status
              </span>
              <span className="text-2xl font-extrabold text-emerald-900 mt-2 block">
                🟢 {selectedRack.storageStatus.toUpperCase()}
              </span>
              <span className="text-xs text-emerald-700 mt-1 block">
                “Current storage conditions are within the configured range.”
              </span>
            </div>
          </div>

          {/* Condition Score & Batch Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Rack & Batch Metadata */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                Batch & Allocation Records
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Rack Identifier:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedRack.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Assigned Chamber:</span>
                  <span className="font-semibold text-slate-800">{selectedRack.chamberName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Registered Farmer:</span>
                  <span className="font-semibold text-slate-800">{selectedRack.farmerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Vegetable Crop:</span>
                  <span className="font-semibold text-slate-800">{selectedRack.vegetable}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Batch Variety:</span>
                  <span className="font-semibold text-slate-800">{selectedRack.variety}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Loaded Quantity:</span>
                  <span className="font-bold text-emerald-900 font-mono">{selectedRack.quantityKg} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Loading Date:</span>
                  <span className="font-semibold text-slate-800">{selectedRack.loadingDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Stored Duration:</span>
                  <span className="font-semibold text-slate-800">{selectedRack.storageDays} days</span>
                </div>
              </div>
            </div>

            {/* Middle Col: Storage Condition Score */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Storage Condition Score
                </h3>
                <div className="mt-4 text-center">
                  <span className="text-5xl font-mono font-extrabold text-emerald-700">
                    {selectedRack.conditionScore}
                  </span>
                  <span className="text-slate-400 text-lg"> / 100</span>
                  <div className="mt-2 text-xs font-bold text-emerald-800">
                    Optimal Microclimate Quality Index
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-emerald-600" />
                    How this score is calculated:
                  </div>
                  <p>
                    Derived strictly from IoT sensor stability: continuous adherence to target temperature band (±1°C), humidity stability (70-85%), and zero ethylene accumulation.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Next scheduled automated verification: in 15 minutes.
              </div>
            </div>

            {/* Right Col: Rack History Events */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-600" />
                Rack History Event Log
              </h3>

              <div className="space-y-3">
                {selectedRack.history.map((h, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{h.event}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{h.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{h.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN / LOAD EMPTY RACK */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Load & Allocate Vegetables to Rack
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter crop intake particulars and assign to a cold storage chamber rack.
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Rack ID</label>
                <select
                  value={intakeRackId}
                  onChange={(e) => setIntakeRackId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono font-bold text-slate-900 focus:outline-hidden"
                >
                  {racks.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} ({r.chamberName}) — {r.storageStatus === 'Empty' ? '🟢 Empty' : `Occupied by ${r.vegetable}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Account</label>
                <select
                  value={intakeFarmerId}
                  onChange={(e) => setIntakeFarmerId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.code} • {f.name} ({f.village})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vegetable Crop</label>
                  <input
                    type="text"
                    required
                    value={intakeCrop}
                    onChange={(e) => setIntakeCrop(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden"
                    placeholder="e.g. Tomato"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Variety</label>
                  <input
                    type="text"
                    required
                    value={intakeVariety}
                    onChange={(e) => setIntakeVariety(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden"
                    placeholder="e.g. Hybrid Vaishali"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loaded Weight (kg)</label>
                <input
                  type="number"
                  min="5"
                  max="150"
                  required
                  value={intakeQuantity}
                  onChange={(e) => setIntakeQuantity(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono font-bold focus:outline-hidden"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                >
                  Confirm Storage Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

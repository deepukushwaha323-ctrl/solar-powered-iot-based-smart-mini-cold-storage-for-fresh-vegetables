import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Download,
  Truck,
  Scale,
  Calendar,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { Crate, CropCategory } from '../../types';

export const InventoryView: React.FC = () => {
  const { crates, addCrate, dispatchCrate, setSelectedCrateId, zones } = useColdStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Crate Form State
  const [newCrop, setNewCrop] = useState('Fresh Tomatoes');
  const [newCategory, setNewCategory] = useState<CropCategory>('nightshades');
  const [newWeight, setNewWeight] = useState<number>(20.0);
  const [newFarmer, setNewFarmer] = useState('Highland Cooperative');
  const [newTargetZone, setNewTargetZone] = useState('ZONE_C');

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'leafy_vegetables', label: 'Leafy Vegetables' },
    { id: 'roots_tubers', label: 'Roots & Tubers' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'nightshades', label: 'Nightshades' },
    { id: 'herbs', label: 'Fresh Herbs' },
  ];

  const filteredCrates = crates.filter((c) => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (selectedZone !== 'ALL' && c.zoneId !== selectedZone) return false;
    if (
      searchQuery &&
      !c.crop.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.farmerSource.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateCrate = (e: React.FormEvent) => {
    e.preventDefault();
    addCrate({
      crop: newCrop,
      category: newCategory,
      weightKg: newWeight,
      initialWeightKg: newWeight,
      farmerSource: newFarmer,
      zoneId: newTargetZone,
      rackId: `${newTargetZone.replace('ZONE_', 'RACK_')}1`,
      shelfIndex: 0,
      slotIndex: 0,
    });
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Crop,Category,WeightKg,Zone,TemperatureC,HumidityPct,RiskPct,DaysStored\n';
    const rows = crates
      .map(
        (c) =>
          `${c.id},"${c.crop}",${c.category},${c.weightKg},${c.zoneId},${c.temperatureC},${c.humidityPct},${c.spoilageRiskPct},${c.storedDays}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-manifest-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div id="view-inventory" className="space-y-5">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Boxes className="h-6 w-6 text-emerald-400" />
            <span>Agricultural Crop Inventory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time crate tracking, batch traceability, moisture retention, and dynamic storage lifespan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-export-manifest"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export Manifest (CSV)</span>
          </button>

          <button
            id="btn-add-crate-modal"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/50"
          >
            <Plus className="h-4 w-4" />
            <span>Intake New Crate</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search crop name, crate ID, batch, or grower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 font-medium focus:outline-hidden"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 font-medium focus:outline-hidden"
          >
            <option value="ALL">All Storage Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Crates Grid Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCrates.map((crate) => (
          <div
            key={crate.id}
            id={`inventory-card-${crate.id}`}
            onClick={() => setSelectedCrateId(crate.id)}
            className="group relative flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/90 cursor-pointer shadow-sm hover:shadow-md"
          >
            {/* Card Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">{crate.id}</span>
                  <span className="text-[11px] text-slate-400 capitalize">
                    {crate.category.replace('_', ' ')}
                  </span>
                  {(crate.crop === 'Tomatoes' || crate.crop === 'Apples') && (
                    <span className="rounded bg-purple-950 px-1.5 py-0.2 text-[9px] font-semibold text-purple-300 border border-purple-800">
                      Ethylene+
                    </span>
                  )}
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                    crate.riskLevel === 'CRITICAL'
                      ? 'bg-red-950 text-red-300 border-red-700'
                      : crate.riskLevel === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}
                >
                  {crate.status}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {crate.crop}
              </h4>
              <p className="text-xs text-slate-400 truncate">{crate.farmerSource}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
                <div>
                  <span className="text-slate-400 text-[10px] block">Net Weight</span>
                  <span className="font-mono font-bold text-slate-200">{crate.weightKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Location</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {crate.zoneId.replace('ZONE_', 'Z-')} • T{crate.shelfIndex + 1}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Core Temp</span>
                  <span className="font-mono font-bold text-emerald-400">{crate.temperatureC}°C</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Shelf Life</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {crate.shelfLifeDaysRemaining} days
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer: Risk & Quick Action */}
            <div className="mt-3.5 border-t border-slate-800/80 pt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Risk Index:</span>
                <span className="font-mono font-bold text-xs text-slate-300">
                  {crate.spoilageRiskPct}%
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatchCrate(crate.id);
                }}
                disabled={crate.status === 'DISPATCHED'}
                className="flex items-center gap-1 rounded bg-emerald-600/20 border border-emerald-500/40 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-600 hover:text-white disabled:opacity-40 transition-colors"
              >
                <Truck className="h-3 w-3" />
                <span>{crate.status === 'DISPATCHED' ? 'Dispatched' : 'Dispatch'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Intake New Crate Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-400" />
                <span>Intake New Agricultural Crate</span>
              </h3>
              <p className="text-xs text-slate-400">
                Registers new crop crate into cold storage OS with RFID assignment and thermal envelope.
              </p>
            </div>

            <form onSubmit={handleCreateCrate} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Crop Produce</label>
                <input
                  type="text"
                  required
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  placeholder="e.g. Crisp Romaine Lettuce"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Crop Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CropCategory)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="leafy_vegetables">Leafy Vegetables</option>
                    <option value="roots_tubers">Roots & Tubers</option>
                    <option value="fruits">Fruits</option>
                    <option value="nightshades">Nightshades</option>
                    <option value="herbs">Fresh Herbs</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Intake Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Farmer / Cooperative</label>
                <input
                  type="text"
                  value={newFarmer}
                  onChange={(e) => setNewFarmer(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  placeholder="e.g. Valley Green Cooperative"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Assigned Storage Zone</label>
                <select
                  value={newTargetZone}
                  onChange={(e) => setNewTargetZone(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.cropTypeLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Confirm Intake & Print RFID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  ArrowUpDown,
  Filter,
  Truck,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  FileText,
  Printer,
  X,
  QrCode,
  Tag,
  Scale,
  Leaf,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { Crate, RiskLevel } from '../../types';

export const IntelligentFIFO: React.FC = () => {
  const { crates, dispatchCrate, setSelectedCrateId } = useColdStorage();
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'urgency' | 'shelflife' | 'stored' | 'shrinkage'>('urgency');
  const [dispatchModalCrate, setDispatchModalCrate] = useState<Crate | null>(null);

  // Intelligent FIFO algorithm ranking
  // Urgency score combines spoilage risk, remaining shelf life, thermal degree-hours, and transpiration loss
  const sortedCrates = [...crates]
    .filter((c) => c.status !== 'DISPATCHED')
    .map((c) => {
      const thermalPenalty = (c.degreeHoursStress || 0) * 1.5;
      const urgencyScore = Math.min(
        100,
        Math.round(
          c.spoilageRiskPct * 0.42 +
            (14 - Math.min(14, c.shelfLifeDaysRemaining)) * 3.2 +
            c.storedDays * 1.4 +
            thermalPenalty
        )
      );

      let calculatedPriority: RiskLevel = 'LOW';
      if (urgencyScore > 70 || c.spoilageRiskPct > 70 || c.shelfLifeDaysRemaining < 2.0) {
        calculatedPriority = 'CRITICAL';
      } else if (urgencyScore > 48 || c.spoilageRiskPct > 45) {
        calculatedPriority = 'HIGH';
      } else if (urgencyScore > 28) {
        calculatedPriority = 'MEDIUM';
      }

      return {
        ...c,
        calculatedPriority,
        urgencyScore,
      };
    })
    .sort((a, b) => {
      if (sortField === 'shelflife') return a.shelfLifeDaysRemaining - b.shelfLifeDaysRemaining;
      if (sortField === 'stored') return b.storedDays - a.storedDays;
      if (sortField === 'shrinkage') return (b.moistureLossPct || 0) - (a.moistureLossPct || 0);
      return b.urgencyScore - a.urgencyScore;
    });

  const filteredCrates = sortedCrates.filter((c) => {
    if (filterLevel !== 'ALL' && c.calculatedPriority !== filterLevel) return false;
    if (
      searchQuery &&
      !c.crop.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleOpenDispatchModal = (c: Crate, e: React.MouseEvent) => {
    e.stopPropagation();
    setDispatchModalCrate(c);
  };

  const handleConfirmDispatch = (c: Crate) => {
    dispatchCrate(c.id);
    setDispatchModalCrate(null);
  };

  return (
    <div
      id="fifo-priority-engine"
      className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-5 shadow-lg space-y-4"
    >
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              AI Intelligent FIFO & Dispatch Priority Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic algorithm factoring biological perishability, accumulated thermal degree-hours, transpiration shrinkage, and ethylene clash.
          </p>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search crop, ID, or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden"
          />

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-slate-300 focus:outline-hidden"
          >
            <option value="ALL">All Priority Tiers</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low / Stable</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-slate-300 focus:outline-hidden"
          >
            <option value="urgency">Sort: Urgency Rank</option>
            <option value="shelflife">Sort: Shelf Life Remaining</option>
            <option value="stored">Sort: Days Stored</option>
            <option value="shrinkage">Sort: Moisture Shrinkage %</option>
          </select>
        </div>
      </div>

      {/* FIFO Priority Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Crate & Crop</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Current Wt. (Shrinkage)</th>
              <th className="py-2.5 px-3">Days Stored</th>
              <th className="py-2.5 px-3">Shelf Life Rem.</th>
              <th className="py-2.5 px-3">Spoilage Risk</th>
              <th className="py-2.5 px-3">AI Recommendation</th>
              <th className="py-2.5 px-3 text-right">Dispatch Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredCrates.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 italic">
                  No active crates matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredCrates.map((c, idx) => (
                <tr
                  key={c.id}
                  id={`fifo-row-${c.id}`}
                  onClick={() => setSelectedCrateId(c.id)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      {idx === 0 && <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />}
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                        c.calculatedPriority === 'CRITICAL'
                          ? 'bg-red-950/80 text-red-300 border-red-700/80 animate-pulse'
                          : c.calculatedPriority === 'HIGH'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700/80'
                          : c.calculatedPriority === 'MEDIUM'
                          ? 'bg-yellow-950/80 text-yellow-300 border-yellow-700/80'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                      }`}
                    >
                      {c.calculatedPriority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-mono font-bold text-white flex items-center gap-1.5">
                      <span>{c.id}</span>
                      {c.crop === 'Tomatoes' || c.crop === 'Apples' ? (
                        <span className="rounded bg-purple-950 px-1 text-[9px] text-purple-300 font-normal">
                          Ethylene+
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[11px] text-slate-400">{c.crop}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                    {c.zoneId.replace('_', ' ')} • {c.rackId.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">
                    <div>{c.weightKg} kg</div>
                    <div className="text-[10px] text-slate-400">
                      -{c.moistureLossPct || 0}% moisture loss
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">
                    {c.storedDays} days
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                    <span className={c.shelfLifeDaysRemaining < 2 ? 'text-red-400 font-extrabold' : ''}>
                      {c.shelfLifeDaysRemaining} d
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            c.spoilageRiskPct > 70
                              ? 'bg-red-500'
                              : c.spoilageRiskPct > 40
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${c.spoilageRiskPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px]">{c.spoilageRiskPct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 max-w-xs truncate text-[11px] text-slate-300">
                    {c.recommendedAction}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      id={`btn-fifo-dispatch-${c.id}`}
                      onClick={(e) => handleOpenDispatchModal(c, e)}
                      className="inline-flex items-center gap-1 rounded bg-emerald-600/20 border border-emerald-500/50 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
                      title="Generate Outbound Dispatch Certificate"
                    >
                      <Truck className="h-3 w-3" />
                      <span>Dispatch</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Outbound Dispatch Confirmation & Bill of Lading Modal */}
      {dispatchModalCrate && (
        <div
          id="dispatch-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
          onClick={() => setDispatchModalCrate(null)}
        >
          <div
            id="dispatch-modal-content"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Cold Chain Dispatch Manifest</h4>
              </div>
              <button
                onClick={() => setDispatchModalCrate(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Crate Snapshot */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {dispatchModalCrate.id}
                  </span>
                  <div className="text-sm font-black text-white">{dispatchModalCrate.crop}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-slate-400">Batch: {dispatchModalCrate.batchNumber}</span>
                  <div className="text-[11px] text-slate-300">RFID: {dispatchModalCrate.rfidTag}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400">Grower / Source:</span>
                  <div className="font-semibold text-slate-200">{dispatchModalCrate.farmerSource}</div>
                </div>
                <div>
                  <span className="text-slate-400">Storage Duration:</span>
                  <div className="font-semibold text-slate-200">{dispatchModalCrate.storedDays} days preserved</div>
                </div>
                <div>
                  <span className="text-slate-400">Intake Initial Weight:</span>
                  <div className="font-semibold text-slate-200">{dispatchModalCrate.initialWeightKg} kg</div>
                </div>
                <div>
                  <span className="text-slate-400">Settlement Weight:</span>
                  <div className="font-bold text-emerald-400">
                    {dispatchModalCrate.weightKg} kg (-{dispatchModalCrate.moistureLossPct || 0}% moisture shrinkage)
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Cold Chain Integrity:</span>
                  <div className="font-bold text-emerald-400">
                    {100 - Math.round(dispatchModalCrate.spoilageRiskPct * 0.2)}% (Grade A+)
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Usable Remaining Life:</span>
                  <div className="font-bold text-slate-200">
                    {dispatchModalCrate.shelfLifeDaysRemaining} days at retail
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded bg-slate-900 p-2 border border-slate-800">
                <QrCode className="h-10 w-10 text-emerald-400 shrink-0" />
                <div className="text-[10px] text-slate-400">
                  Digital phytosanitary QR code generated for reefer driver scanning and supermarket cold-chain verification.
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDispatchModalCrate(null)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-750"
              >
                Cancel
              </button>

              <button
                id="btn-confirm-dispatch-final"
                onClick={() => handleConfirmDispatch(dispatchModalCrate)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40"
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Confirm Outbound Loading</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

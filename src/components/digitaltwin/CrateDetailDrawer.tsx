import React, { useState } from 'react';
import {
  X,
  QrCode,
  Truck,
  MoveRight,
  Scale,
  Calendar,
  Thermometer,
  Droplets,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  Tag,
  CheckCircle2,
  Flame,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const CrateDetailDrawer: React.FC = () => {
  const {
    crates,
    selectedCrateId,
    setSelectedCrateId,
    dispatchCrate,
    moveCrate,
    updateCrateWeight,
    zones,
  } = useColdStorage();

  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [targetZone, setTargetZone] = useState<string>('ZONE_A');
  const [targetRack, setTargetRack] = useState<string>('RACK_A1');
  const [targetShelf, setTargetShelf] = useState<number>(0);

  const [isEditingWeight, setIsEditingWeight] = useState<boolean>(false);
  const [newWeightInput, setNewWeightInput] = useState<string>('');
  const [showQAPass, setShowQAPass] = useState<boolean>(false);

  if (!selectedCrateId) return null;

  const crate = crates.find((c) => c.id === selectedCrateId);
  if (!crate) return null;

  const handleDispatch = () => {
    dispatchCrate(crate.id);
  };

  const handleMoveSubmit = () => {
    moveCrate(crate.id, targetZone, targetRack, targetShelf, 0);
    setIsMoving(false);
  };

  const handleWeightSubmit = () => {
    const parsed = parseFloat(newWeightInput);
    if (!isNaN(parsed) && parsed > 0) {
      updateCrateWeight(crate.id, parsed);
    }
    setIsEditingWeight(false);
  };

  // Biological compatibility check
  const isTargetZoneEthyleneClash =
    (targetZone === 'ZONE_D' || targetZone === 'ZONE_C') &&
    (crate.crop === 'Spinach' || crate.crop === 'Lettuce' || crate.crop === 'Broccoli' || crate.crop === 'Carrots');

  return (
    <div
      id="crate-detail-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs transition-opacity"
      onClick={() => setSelectedCrateId(null)}
    >
      <div
        id="crate-detail-drawer"
        className="w-full max-w-lg h-full overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 text-slate-200 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-sm">
              {crate.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{crate.crop}</h3>
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
              <p className="text-xs text-slate-400">Batch: {crate.batchNumber} • RFID: {crate.rfidTag}</p>
            </div>
          </div>

          <button
            id="btn-close-drawer"
            onClick={() => setSelectedCrateId(null)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="grid grid-cols-4 gap-2">
          <button
            id="btn-drawer-dispatch"
            onClick={handleDispatch}
            disabled={crate.status === 'DISPATCHED'}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600/20 px-2 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white disabled:opacity-40 transition-all"
          >
            <Truck className="h-3.5 w-3.5" />
            <span>{crate.status === 'DISPATCHED' ? 'Dispatched' : 'Dispatch'}</span>
          </button>

          <button
            id="btn-drawer-move"
            onClick={() => setIsMoving(!isMoving)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <MoveRight className="h-3.5 w-3.5" />
            <span>Relocate</span>
          </button>

          <button
            id="btn-drawer-weight"
            onClick={() => {
              setIsEditingWeight(!isEditingWeight);
              setNewWeightInput(String(crate.weightKg));
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Audit Wt.</span>
          </button>

          <button
            id="btn-drawer-pass"
            onClick={() => setShowQAPass(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-cyan-700 bg-cyan-950/40 px-2 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition-all"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>QA Pass</span>
          </button>
        </div>

        {/* Inline Move Form with Ethylene Safety Check */}
        {isMoving && (
          <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-3.5 space-y-2 text-xs">
            <h5 className="font-bold text-cyan-300">Relocate Crate Inside Cold Storage</h5>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Target Zone</label>
                <select
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-900 p-1 text-slate-200"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.cropTypeLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Target Rack</label>
                <select
                  value={targetRack}
                  onChange={(e) => setTargetRack(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-900 p-1 text-slate-200"
                >
                  <option value="RACK_A1">Rack 01</option>
                  <option value="RACK_A2">Rack 02</option>
                  <option value="RACK_A3">Rack 03</option>
                  <option value="RACK_A4">Rack 04</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Shelf Tier</label>
                <select
                  value={targetShelf}
                  onChange={(e) => setTargetShelf(parseInt(e.target.value))}
                  className="w-full rounded border border-slate-700 bg-slate-900 p-1 text-slate-200"
                >
                  <option value={0}>Tier 1 (Lower)</option>
                  <option value={1}>Tier 2 (Mid)</option>
                  <option value={2}>Tier 3 (Upper)</option>
                </select>
              </div>
            </div>

            {/* Biological Clash Warning */}
            {isTargetZoneEthyleneClash && (
              <div className="flex items-start gap-1.5 rounded bg-amber-950/80 border border-amber-700/80 p-2 text-[11px] text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Ethylene Clash Warning:</strong> Target zone stores ripening climacteric crops. Co-storage will trigger premature chlorophyll breakdown in {crate.crop}.
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsMoving(false)}
                className="rounded px-2.5 py-1 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleMoveSubmit}
                className="rounded bg-cyan-500 px-3 py-1 font-bold text-slate-950 hover:bg-cyan-400"
              >
                Confirm Move
              </button>
            </div>
          </div>
        )}

        {/* Inline Weight Update */}
        {isEditingWeight && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-3.5 space-y-2 text-xs">
            <h5 className="font-bold text-slate-200">Digital Scale Weight Audit (kg)</h5>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                className="flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-1 text-white font-mono"
              />
              <button
                onClick={handleWeightSubmit}
                className="rounded bg-emerald-500 px-3 py-1 font-bold text-slate-950 hover:bg-emerald-400"
              >
                Save Audit
              </button>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>Location Slot</span>
            </div>
            <div className="text-sm font-bold text-white">
              {crate.zoneId.replace('_', ' ')} • {crate.rackId.replace('_', ' ')}
            </div>
            <div className="text-[11px] text-slate-400">Shelf Tier {crate.shelfIndex + 1}</div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Scale className="h-3.5 w-3.5 text-cyan-400" />
              <span>Net Weight / Initial</span>
            </div>
            <div className="text-sm font-bold text-white font-mono">
              {crate.weightKg} kg <span className="text-xs text-slate-400 font-normal">/ {crate.initialWeightKg} kg</span>
            </div>
            <div className="text-[11px] text-amber-400 font-mono">
              -{crate.moistureLossPct || 0}% moisture shrinkage
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Thermometer className="h-3.5 w-3.5 text-emerald-400" />
              <span>Core Temperature</span>
            </div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              {crate.temperatureC}°C
            </div>
            <div className="text-[11px] text-slate-400">Target: {crate.targetTempRange[0]}–{crate.targetTempRange[1]}°C</div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Droplets className="h-3.5 w-3.5 text-cyan-400" />
              <span>Crate Micro-RH</span>
            </div>
            <div className="text-sm font-bold text-cyan-400 font-mono">
              {crate.humidityPct}%
            </div>
            <div className="text-[11px] text-slate-400">Target: {crate.targetHumidityRange[0]}–{crate.targetHumidityRange[1]}%</div>
          </div>
        </div>

        {/* Biological Attributes Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-2 text-xs">
          <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-purple-400" />
            <span>Post-Harvest Biological Profile</span>
          </h5>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">Thermal Degree-Hours:</span>
              <div className="font-mono font-bold text-amber-400">{crate.degreeHoursStress || 0.0}°C·hrs</div>
            </div>
            <div>
              <span className="text-slate-400">Ethylene Trait:</span>
              <div className="font-semibold text-slate-200">
                {crate.crop === 'Tomatoes' || crate.crop === 'Apples' ? 'High Producer' : 'Sensitive Consumer'}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Farmer Co-op:</span>
              <div className="text-slate-200">{crate.farmerSource}</div>
            </div>
            <div>
              <span className="text-slate-400">Preserved Storage:</span>
              <div className="font-semibold text-emerald-400">{crate.storedDays} days active</div>
            </div>
          </div>
        </div>

        {/* AI Spoilage & Shelf-Life Intelligence Card */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                AI Spoilage Intelligence
              </h4>
            </div>
            <span className="rounded bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono">
              Confidence: 94%
            </span>
          </div>

          <div className="flex items-end justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[11px] text-slate-400">Biological Spoilage Risk</span>
              <div className="text-2xl font-black font-mono text-white">
                {crate.spoilageRiskPct} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Predicted Usable Life</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {crate.shelfLifeDaysRemaining} days remaining
              </div>
            </div>
          </div>

          {/* Contributing Factors */}
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Main Biological Risk Factors:
            </span>
            <ul className="mt-1 space-y-1">
              {crate.riskFactors.map((factor, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Action */}
          <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wide">
              Prescriptive Decision:
            </span>
            <p className="mt-0.5 text-xs text-slate-200">
              "{crate.recommendedAction}"
            </p>
          </div>
        </div>

        {/* 24-Hour Microclimate History */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              24-Hour Microclimate Telemetry
            </h4>
            <span className="text-[10px] text-slate-400">Logged hourly</span>
          </div>

          <div className="h-28 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 300 80">
              <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="3 3" />

              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={crate.temperatureHistory
                  .map((pt, i) => `${(i / (crate.temperatureHistory.length - 1)) * 300},${70 - pt.temp * 9}`)
                  .join(' ')}
              />

              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                points={crate.temperatureHistory
                  .map((pt, i) => `${(i / (crate.temperatureHistory.length - 1)) * 300},${100 - pt.humidity * 0.8}`)
                  .join(' ')}
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Core Temp (°C)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>RH (%)</span>
            </span>
            <span className="font-mono text-slate-300">Target: {crate.targetTempRange[0]}–{crate.targetTempRange[1]}°C</span>
          </div>
        </div>

        {/* Storage Audit Timeline */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Cold Chain Audit Timeline
          </h4>
          <div className="space-y-2 border-l border-slate-800 pl-3 ml-1.5">
            {crate.historyEvents.map((evt, i) => (
              <div key={i} className="relative text-xs">
                <span className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-emerald-400" />
                <div className="font-mono text-[10px] text-slate-400">{evt.timestamp}</div>
                <div className="font-bold text-slate-200">{evt.event}</div>
                <div className="text-slate-400 text-[11px]">{evt.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital QA Pass Modal */}
        {showQAPass && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
            onClick={() => setShowQAPass(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-emerald-500/50 bg-slate-900 p-5 space-y-3 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Cold Chain Quality Certificate</span>
                </div>
                <button onClick={() => setShowQAPass(false)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="font-mono text-base font-black text-emerald-400">{crate.id}</div>
                <div className="text-sm font-bold text-white">{crate.crop}</div>
                <div className="text-[10px] text-slate-400">RFID Tag: {crate.rfidTag}</div>
              </div>

              <div className="flex justify-center py-2">
                <div className="rounded-xl bg-white p-2">
                  <QrCode className="h-28 w-28 text-slate-950" />
                </div>
              </div>

              <div className="rounded bg-slate-950 p-2.5 space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span>Grower Source:</span>
                  <span className="font-semibold text-white">{crate.farmerSource}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Chain Score:</span>
                  <span className="font-bold text-emerald-400">{100 - Math.round(crate.spoilageRiskPct * 0.2)}% (Grade A+)</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Verified Weight:</span>
                  <span className="font-mono font-bold text-white">{crate.weightKg} kg</span>
                </div>
              </div>

              <button
                onClick={() => setShowQAPass(false)}
                className="w-full rounded-lg bg-emerald-500 py-1.5 font-bold text-slate-950 hover:bg-emerald-400"
              >
                Close Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

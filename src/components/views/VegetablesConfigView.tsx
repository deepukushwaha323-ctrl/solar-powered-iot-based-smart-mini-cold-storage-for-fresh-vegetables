import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Thermometer,
  Droplets,
  Clock,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { vegetableProfiles } from '../../data/sihColdStorageData';

export const VegetablesConfigView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'profiles' | 'matrix'>('profiles');

  // Co-storage compatibility checker states
  const [cropA, setCropA] = useState<string>('Tomato');
  const [cropB, setCropB] = useState<string>('Spinach');

  const filteredCrops = vegetableProfiles.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Evaluate compatibility between cropA and cropB
  const getCompatibilityVerdict = (a: string, b: string) => {
    if (a === b) {
      return {
        safe: true,
        verdict: 'COMPATIBLE',
        reason: 'Identical crops share the exact same temperature, humidity, and ethylene tolerance band.',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }

    const highEthylene = ['Tomato'];
    const ethyleneSensitive = ['Spinach', 'Carrot', 'Potato', 'Cabbage'];
    const chillingSensitive = ['Tomato', 'Green Chilli', 'Capsicum'];
    const coldHardy = ['Spinach', 'Carrot', 'Cabbage'];

    const hasEthyleneClash =
      (highEthylene.includes(a) && ethyleneSensitive.includes(b)) ||
      (highEthylene.includes(b) && ethyleneSensitive.includes(a));

    const hasTempClash =
      (chillingSensitive.includes(a) && coldHardy.includes(b)) ||
      (chillingSensitive.includes(b) && coldHardy.includes(a));

    if (hasEthyleneClash && hasTempClash) {
      return {
        safe: false,
        verdict: 'CRITICAL INCOMPATIBILITY',
        reason: `Severe danger: ${a} emits ethylene causing yellowing/bitterness in ${b}, and their required storage temperatures clash (chilling injury vs rapid senescence). DO NOT CO-STORE.`,
        badgeColor: 'bg-red-100 text-red-800 border-red-300',
      };
    }

    if (hasEthyleneClash) {
      return {
        safe: false,
        verdict: 'ETHYLENE RISK',
        reason: `Ethylene release will accelerate ripening, decay, or bitterness. Requires separate physical chamber with active airflow isolation.`,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }

    if (hasTempClash) {
      return {
        safe: false,
        verdict: 'TEMPERATURE MISMATCH',
        reason: `Temperature setpoints differ significantly. Co-storing in the same chamber will cause chilling injury or rapid shelf-life degradation.`,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }

    return {
      safe: true,
      verdict: 'COMPATIBLE',
      reason: `Compatible microclimate and gas profiles. Can be safely co-stored in the same cold chamber zone.`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  };

  const compatibility = getCompatibilityVerdict(cropA, cropB);

  return (
    <div id="vegetables-config-view" className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Vegetable Storage Guidelines & Ethylene Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Validated post-harvest agronomic setpoints, chilling injury thresholds, and cross-crop co-storage rules
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'profiles' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vegetable Profiles & Shelf Life
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'matrix' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ethylene & Compatibility Matrix
          </button>
        </div>
      </div>

      {activeTab === 'profiles' ? (
        /* SECTION 10: VEGETABLES STORAGE CONFIGURATION TABLE */
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-72">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search vegetable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <span className="text-xs text-slate-500">
              Showing {filteredCrops.length} scientifically calibrated crops
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  <th className="px-4 py-3">Vegetable Name</th>
                  <th className="px-4 py-3">Rec. Temp (°C)</th>
                  <th className="px-4 py-3">Rec. RH (%)</th>
                  <th className="px-4 py-3">Ambient Shelf Life</th>
                  <th className="px-4 py-3">Cold Storage Life</th>
                  <th className="px-4 py-3">Life Extension Benefit</th>
                  <th className="px-4 py-3">Ethylene Profile</th>
                  <th className="px-4 py-3">Chilling Injury Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCrops.map((crop) => (
                  <tr key={crop.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {crop.name}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-800">
                      {crop.tempRange}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-cyan-800">
                      {crop.rhRange}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {crop.ambientLife}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {crop.coldLife}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                        {crop.benefitFactor}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {crop.gasSensitivity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          crop.chillingInjuryRisk.includes('High')
                            ? 'bg-rose-100 text-rose-800'
                            : crop.chillingInjuryRisk.includes('Moderate')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {crop.chillingInjuryRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SECTION 11: ETHYLENE SAFETY & CO-STORAGE CHECKER */
        <div className="space-y-6">
          {/* Interactive Co-Storage Compatibility Calculator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Interactive Crop Co-Storage Compatibility Checker
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Select any two vegetables to verify if they can safely share a physical cold storage chamber.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop 1</label>
                <select
                  value={cropA}
                  onChange={(e) => setCropA(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                >
                  {vegetableProfiles.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop 2</label>
                <select
                  value={cropB}
                  onChange={(e) => setCropB(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                >
                  {vegetableProfiles.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Verdict Display */}
            <div className={`mt-5 rounded-xl border p-4 ${compatibility.badgeColor}`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  {compatibility.safe ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                  {compatibility.verdict}
                </span>
                <span className="text-xs font-mono font-bold">
                  {cropA} ⇄ {cropB}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium leading-relaxed">
                {compatibility.reason}
              </p>
            </div>
          </div>

          {/* Educational Rules of Co-Storage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                1. Group A: Cold Hardy (0–2°C)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spinach, Coriander, Leafy Greens, Carrots, and Cabbage require near-freezing temperatures (0–2°C) and 95%+ RH. They cannot tolerate temperatures above 5°C without rapid moisture loss and yellowing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-2">
                2. Group B: Chilling Sensitive (7–10°C)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Green Chilli, Capsicum, Brinjal, and Cucurbits suffer from <em>chilling injury</em> (surface pitting, calyx browning, watery rot) if stored below 7°C. They MUST be separated in Chamber 03 or Chamber 01.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-2">
                3. Ethylene Generators vs Sensitive
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ripe tomatoes and ripening fruits produce high concentrations of ethylene gas (C₂H₄). Never co-store them with leafy greens or carrots, as ethylene induces chlorophyll breakdown and bitter isocoumarin synthesis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Leaf,
  DollarSign,
  Sun,
  ShieldCheck,
  Zap,
  Award,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const AnalyticsView: React.FC = () => {
  const { crates, power } = useColdStorage();

  const totalKg = crates
    .filter((c) => c.status !== 'DISPATCHED')
    .reduce((sum, c) => sum + c.weightKg, 0);

  const estimatedValuePreserved = Math.round(totalKg * 3.4); // ~$3.4 per kg produce value

  return (
    <div id="view-analytics" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-400" />
            <span>Agricultural Intelligence & Post-Harvest Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quantified post-harvest loss prevention, cold-chain energy efficiency, solar ROI, and grower economic impact.
          </p>
        </div>

        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <Award className="h-4 w-4 text-emerald-400" />
          <span>Food Loss Reduction: -82% vs Ambient</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Spoilage Loss Rate</span>
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">4.2%</div>
          <div className="text-[11px] text-slate-400">
            vs 26.8% without decentralized cold storage
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Solar Self-Sufficiency</span>
            <Sun className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-300">93.4%</div>
          <div className="text-[11px] text-slate-400">
            Microgrid off-grid operation today
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Value Preserved (Mo.)</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300">
            ${estimatedValuePreserved.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            Prevented crop distress-sale discounting
          </div>
        </div>

        <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Carbon Avoidance</span>
            <Leaf className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black font-mono text-teal-300">148 kg</div>
          <div className="text-[11px] text-slate-400">
            CO2 equivalent avoided this month
          </div>
        </div>
      </div>

      {/* Historical Performance & Loss Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Shelf-Life Extension by Crop Category
          </h3>
          <p className="text-xs text-slate-400">
            Comparison between uncontrolled ambient storage vs solar cold-storage chamber.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Leafy Vegetables (Spinach, Lettuce)</span>
                <span className="font-mono text-emerald-400 font-bold">10 days (vs 1.5 days)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-red-500/60 h-full w-[15%]" title="Ambient shelf-life: 1.5d" />
                <div className="bg-emerald-500 h-full w-[85%]" title="Cold chain shelf-life: 10d" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Soft Berries & Fruits (Strawberries)</span>
                <span className="font-mono text-emerald-400 font-bold">8 days (vs 2 days)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-red-500/60 h-full w-[25%]" />
                <div className="bg-emerald-500 h-full w-[75%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Roots & Tubers (Carrots, Beets)</span>
                <span className="font-mono text-emerald-400 font-bold">45 days (vs 12 days)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-red-500/60 h-full w-[26%]" />
                <div className="bg-emerald-500 h-full w-[74%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Nightshades (Tomatoes, Peppers)</span>
                <span className="font-mono text-emerald-400 font-bold">18 days (vs 5 days)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-red-500/60 h-full w-[27%]" />
                <div className="bg-emerald-500 h-full w-[73%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Energy Efficiency & COP */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Thermal Energy Efficiency & Specific Power Consumption
          </h3>
          <p className="text-xs text-slate-400">
            Kilowatt-hours per kilogram cooled over 24-hour operational cycle.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Specific Cooling Energy</span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-1">0.015 kWh/kg</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Top-tier thermal envelope</span>
            </div>

            <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">PUF Wall Insulation</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1">100 mm</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">U-value: 0.22 W/m²K</span>
            </div>

            <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Solar Levelized Cost</span>
              <span className="text-xl font-bold font-mono text-amber-300 mt-1">$0.042 / kWh</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">60% below diesel genset</span>
            </div>

            <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Battery Cycle Aging</span>
              <span className="text-xl font-bold font-mono text-white mt-1">142 / 4,000</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">97.8% remaining health</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

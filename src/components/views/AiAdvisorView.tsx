import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sun,
  Layers,
  DollarSign,
  Send,
  Zap,
  Clock,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const AiAdvisorView: React.FC = () => {
  const { racks, chambers, farmers } = useColdStorage();

  const [appliedPreCooling, setAppliedPreCooling] = useState<boolean>(false);
  const [advisorySent, setAdvisorySent] = useState<boolean>(false);

  const handleApplyPreCooling = () => {
    setAppliedPreCooling(true);
    setTimeout(() => setAppliedPreCooling(false), 5000);
  };

  const handleSendAdvisory = () => {
    setAdvisorySent(true);
    setTimeout(() => setAdvisorySent(false), 5000);
  };

  return (
    <div id="ai-advisor-view" className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI-Powered Agronomic & Predictive Energy Engine
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> SIH AI Model v3.2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive spoilage risk calculations, thermal mass arbitrage, and APMC mandi market price forecasting
          </p>
        </div>
      </div>

      {appliedPreCooling && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-2xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Automated Solar Thermal Storage Engaged:</span> VCRC target reduced to 3.8°C during peak solar window (11:30 - 14:00) to store thermal cold without consuming night battery reserves.
          </div>
        </div>
      )}

      {advisorySent && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-2xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Farmer Advisory Dispatched:</span> WhatsApp mandi price forecast and recommended selling window sent to Farmer Ramesh Patel (+91 98765 43210).
          </div>
        </div>
      )}

      {/* SECTION 21: 3 Core Recommendation Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Predictive Spoilage Risk Modeling */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-600" />
                Remaining Shelf Life Forecast
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Low Risk
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Real-time thermal stability coefficients combined with cumulative respiration kinetics yield remaining shelf life per batch.
            </p>

            <div className="space-y-3">
              {[
                { rack: 'R01 (Tomato)', life: '19 Days Left', risk: '4% Risk', color: 'emerald' },
                { rack: 'R05 (Spinach)', life: '8 Days Left', risk: '7% Risk', color: 'emerald' },
                { rack: 'R09 (Potato)', life: '142 Days Left', risk: '12% Risk (Humidity Attention)', color: 'amber' },
                { rack: 'R13 (Carrot)', life: '54 Days Left', risk: '3% Risk', color: 'emerald' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{item.rack}</span>
                    <span className="text-emerald-700 font-mono">{item.life}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Spoilage Vulnerability:</span>
                    <span className={`font-semibold ${item.color === 'amber' ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {item.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Model grounded in ICAR post-harvest thermal equations.
          </div>
        </div>

        {/* Pillar 2: Solar Thermal Pre-Cooling Arbitrage */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-600" />
                Solar Thermal Energy Arbitrage
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                +2.4 kW Surplus
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Rooftop solar generation is at maximum yield (2.4 kW). The model suggests pre-cooling the chambers to 3.8°C right now.
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs space-y-2 mb-4">
              <div className="font-bold text-amber-900">Projected Energy Savings:</div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-800">
                <li>Saves 2.8 kWh of night-time battery energy consumption.</li>
                <li>Extends LiFePO₄ cycle life by minimizing deep DOD discharge.</li>
                <li>Vegetable thermal inertia maintains cold room below 5°C until 23:00.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleApplyPreCooling}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-2xs"
          >
            <Zap className="h-4 w-4" />
            <span>Apply Solar Pre-Cooling Schedule</span>
          </button>
        </div>

        {/* Pillar 3: Market Mandi Price Optimization */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                APMC Mandi Price Intelligence
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Hold Advised
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Local market supply trends predict a tomato price rally over the next week. Cold storage empowers farmer price discovery.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Tomato Spot Price:</span>
                <span className="font-mono font-bold text-slate-900">₹24 / kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Forecasted Peak (6 Days):</span>
                <span className="font-mono font-bold text-emerald-700">₹32 / kg (+33%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Extra Margin for Batch R01 (80kg):</span>
                <span className="font-mono font-bold text-emerald-700">+₹640 Net Profit</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSendAdvisory}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <Send className="h-4 w-4" />
            <span>Send Mandi Advisory to Farmer (SMS)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

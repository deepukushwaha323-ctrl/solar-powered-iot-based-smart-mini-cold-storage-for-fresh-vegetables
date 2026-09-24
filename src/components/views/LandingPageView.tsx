import React from 'react';
import {
  Sun,
  Snowflake,
  Activity,
  Thermometer,
  ShieldCheck,
  BatteryCharging,
  Layers,
  Bell,
  ArrowRight,
  CheckCircle,
  LogIn,
  Zap,
  Leaf,
  Wifi,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { UserRole } from '../../types';

export const LandingPageView: React.FC = () => {
  const { setShowLandingPage, setIsLoggedIn, setUserRole, setActiveFarmerId } = useColdStorage();

  const handleStart = (role: UserRole = 'ADMIN', farmerId?: string) => {
    setUserRole(role);
    if (farmerId) setActiveFarmerId(farmerId);
    setIsLoggedIn(true);
    setShowLandingPage(false);
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <span className="block font-bold text-lg tracking-tight text-slate-900 leading-none">
                AgriCold Solar IoT
              </span>
              <span className="block text-xs font-semibold text-emerald-700 tracking-wide">
                Smart Mini Cold Storage for Fresh Vegetables • SIH 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStart('FARMER', 'FARMER_001')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <Leaf className="h-4 w-4 text-emerald-600" />
              Farmer Portal
            </button>
            <button
              onClick={() => handleStart('ADMIN')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Launch System Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Smart India Hackathon (SIH) 2026 AgTech Innovation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Smart Cold Storage for <span className="text-emerald-700">Smarter Farming</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Solar-powered, IoT-enabled decentralized mini cold storage engineered for smallholder vegetable farmers.
            Delivering real-time multi-chamber climate monitoring, rack-level crop tracking, and intelligent energy management.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-btn-dashboard"
              onClick={() => handleStart('ADMIN')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-all hover:scale-102"
            >
              System Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="hero-btn-farmer"
              onClick={() => handleStart('FARMER', 'FARMER_001')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-all"
            >
              <Leaf className="h-4 w-4 text-emerald-600" />
              Farmer Login Demo
            </button>
          </div>

          {/* Quick Hardware Specs Pill */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Solar Rooftop</span>
              <span className="text-sm font-bold text-slate-900">3 kWp Monocrystalline</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Battery Chemistry</span>
              <span className="text-sm font-bold text-slate-900">48V 100Ah LiFePO₄</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Refrigeration</span>
              <span className="text-sm font-bold text-slate-900">1.5 HP VCRC Inverter</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Chambers & Capacity</span>
              <span className="text-sm font-bold text-slate-900">4 Zones • 16 Racks (400kg)</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Flow Diagram Section */}
      <section className="py-16 px-6 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              End-to-End Solar IoT Architecture
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Complete decentralized hardware flow: clean energy capture to rack microclimate control
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Step 1 */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-3">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Solar Panels</h3>
              <p className="text-xs text-slate-600 mt-1">3 kWp Rooftop Array with MPPT Charge Controller</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-400">
              <ArrowRight className="h-6 w-6" />
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 mb-3">
                <BatteryCharging className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">LiFePO₄ Battery</h3>
              <p className="text-xs text-slate-600 mt-1">48V Battery Bank with Active Smart BMS</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-400">
              <ArrowRight className="h-6 w-6" />
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-4 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 mb-3">
                <Snowflake className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">VCRC Refrigeration</h3>
              <p className="text-xs text-slate-600 mt-1">1.5 HP Vapor Compression Compressor</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-400">
              <ArrowRight className="h-6 w-6" />
            </div>

            {/* Step 4 */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">4 Cold Chambers</h3>
              <p className="text-xs text-slate-600 mt-1">16 Dedicated Racks with ESP32 Multi-Sensors</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-400">
              <ArrowRight className="h-6 w-6" />
            </div>

            {/* Step 5 */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 mb-3">
                <Wifi className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Farmer Dashboard</h3>
              <p className="text-xs text-slate-600 mt-1">Real-time mobile & web access with instant alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Feature Cards Section (Section 30 requirement) */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Core Capabilities & Innovations
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Built for rural reliability, zero crop spoil, and maximum farmer profitability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
                <Sun className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Solar Powered</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                3 kWp rooftop solar PV ensures continuous clean power, minimizing dependency on unstable rural grids and cutting operational energy costs to zero.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 mb-4">
                <Snowflake className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Intelligent Cooling</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                1.5 HP VCRC compressor with adaptive inverter logic modulates cooling capacity depending on solar irradiance and chamber load.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">IoT Monitoring</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                High-precision ESP32 micro-telemetry gateway synchronizes multi-sensor telemetry every few seconds to the edge controller and cloud.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-4">
                <Thermometer className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Microclimate Control</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Independent chamber temperature and humidity profiling prevents chilling injury in sensitive crops like tomatoes while chilling greens.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Gas & Air Quality</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Continuous gas monitoring detects ripening ethylene and volatile accumulation early, triggering chamber ventilation before spoilage spreads.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 mb-4">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Battery Backup</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                48V LiFePO₄ bank provides over 14 hours of off-sun autonomy with BMS low-voltage cut-off protection and temperature safeguards.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Rack-wise Tracking</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Every rack features a unique Rack ID (R01–R16) linked to farmer identity, vegetable variety, loading date, and individual batch condition score.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Real-Time Alerts</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Multi-channel notifications (Web, Mobile push, WhatsApp/SMS) immediately notify farmers and operators of excursions or door ajar states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 px-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Smart India Hackathon (SIH) — Solar-Powered IoT-Based Smart Mini Cold Storage for Fresh Vegetables.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleStart('ADMIN')} className="text-emerald-700 font-semibold hover:underline">
              System Admin
            </button>
            <button onClick={() => handleStart('OPERATOR')} className="text-emerald-700 font-semibold hover:underline">
              Operator Console
            </button>
            <button onClick={() => handleStart('FARMER', 'FARMER_001')} className="text-emerald-700 font-semibold hover:underline">
              Farmer Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

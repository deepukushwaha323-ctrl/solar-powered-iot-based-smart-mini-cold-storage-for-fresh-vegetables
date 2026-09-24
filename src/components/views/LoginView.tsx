import React, { useState } from 'react';
import {
  Leaf,
  Shield,
  User,
  Lock,
  ArrowRight,
  Wifi,
  Sun,
  Snowflake,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const {
    setUserRole,
    setIsLoggedIn,
    setShowLandingPage,
    farmers,
    activeFarmerId,
    setActiveFarmerId,
  } = useColdStorage();

  const [role, setRole] = useState<UserRole>('ADMIN');
  const [selectedFarmer, setSelectedFarmer] = useState<string>(activeFarmerId || 'FARMER_001');
  const [username, setUsername] = useState<string>('admin@agricold.org');
  const [password, setPassword] = useState<string>('••••••••');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'ADMIN') setUsername('admin@agricold.org');
    else if (newRole === 'OPERATOR') setUsername('operator@facility.in');
    else if (newRole === 'FARMER') setUsername('+91 98765 43210');
    else setUsername('viewer@auditor.gov.in');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(role);
    if (role === 'FARMER') {
      setActiveFarmerId(selectedFarmer);
    }
    setIsLoggedIn(true);
    setShowLandingPage(false);
  };

  const handleQuickLogin = (quickRole: UserRole, farmerId?: string) => {
    setUserRole(quickRole);
    if (farmerId) setActiveFarmerId(farmerId);
    setIsLoggedIn(true);
    setShowLandingPage(false);
  };

  return (
    <div id="login-view" className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo and Status */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
          <Leaf className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
          Smart Cold Storage
        </h2>
        <p className="mt-1 text-xs font-semibold text-emerald-800 tracking-wide">
          Solar-Powered IoT Monitoring & Intelligent Vegetable Storage
        </p>

        {/* System Status Indicator */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          <span>IoT System Online • Unit 01 (3 kWp / 48V)</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Access Role
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                {(['ADMIN', 'OPERATOR', 'FARMER', 'VIEWER'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      role === r
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    {r === 'ADMIN' ? 'Admin' : r === 'OPERATOR' ? 'Operator' : r === 'FARMER' ? 'Farmer' : 'Viewer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Farmer Selector if role is FARMER */}
            {role === 'FARMER' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Select Farmer Account
                </label>
                <select
                  value={selectedFarmer}
                  onChange={(e) => setSelectedFarmer(e.target.value)}
                  className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.code} • {f.name} ({(f.assignedRacks || f.assignedRackIds || []).join(', ')})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-emerald-700">
                  Access assigned racks, batch condition scores, and SMS alerts.
                </p>
              </div>
            )}

            {/* Identifier input */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                {role === 'FARMER' ? 'Registered Mobile Number' : 'Email Address / Operator ID'}
              </label>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder={role === 'FARMER' ? '+91 98765 43210' : 'user@agricold.org'}
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700">Password / PIN</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo PIN is preset to ••••••••"); }} className="text-[11px] text-emerald-700 hover:underline">
                  Forgot PIN?
                </a>
              </div>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-xs text-slate-600">Remember this station</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Logins for SIH Judges */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <span className="block text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              One-Click Demonstration Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-bold text-slate-800 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-emerald-700" />
                <span>Admin View</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('FARMER', 'FARMER_001')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-[11px] font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                <Leaf className="h-3.5 w-3.5 text-emerald-700" />
                <span>Farmer (Ramesh)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('OPERATOR')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-bold text-slate-800 hover:bg-cyan-50 hover:border-cyan-300 transition-colors"
              >
                <Snowflake className="h-3.5 w-3.5 text-cyan-600" />
                <span>Facility Operator</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('VIEWER')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>Auditor / Viewer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to landing page */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowLandingPage(true)}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
          >
            ← Return to Public Overview
          </button>
        </div>
      </div>
    </div>
  );
};

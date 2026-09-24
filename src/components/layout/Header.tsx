import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  DoorClosed,
  DoorOpen,
  Shield,
  Clock,
  FlaskConical,
  Play,
  RotateCcw,
  User,
  LogOut,
  Globe,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    isDoorOpen,
    toggleDoor,
    userRole,
    setUserRole,
    isDemoMode,
    setIsDemoMode,
    isDataConnectionLost,
    setIsDataConnectionLost,
    lastIoTUpdatedSec,
    triggerDemoExcursion,
    farmers,
    activeFarmerId,
    setActiveFarmerId,
    setShowLandingPage,
    setIsLoggedIn,
    alerts,
    setCopilotOpen,
    copilotOpen,
  } = useColdStorage();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [excursionTriggered, setExcursionTriggered] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExcursionClick = () => {
    setExcursionTriggered(true);
    triggerDemoExcursion();
    setTimeout(() => setExcursionTriggered(false), 8000);
  };

  const activeFarmer = farmers.find((f) => f.id === activeFarmerId);
  const unreadAlerts = alerts.filter((a) => !a.acknowledged && !a.resolved).length;

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-md shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & IoT Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xs">
            <Layers className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                Solar Smart Cold Storage
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                SIH 2026
              </span>
            </div>
            <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-500">
              {isDataConnectionLost ? (
                <span className="flex items-center gap-1 font-semibold text-red-600">
                  <WifiOff className="h-3 w-3" />
                  DATA CONNECTION LOST
                </span>
              ) : (
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                  </span>
                  IoT System Online
                </span>
              )}
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-mono text-slate-600">
                {isDemoMode ? (
                  <span className="text-amber-700 font-medium">DEMO DATA</span>
                ) : (
                  <span>LIVE • Updated {lastIoTUpdatedSec}s ago</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center: SIH Demo Controls & Physical Simulator */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-[11px] font-semibold text-slate-600">Demo Mode:</span>
            <button
              id="btn-toggle-demo-mode"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isDemoMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isDemoMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Simulate 6.5°C Excursion (Section 29 requirement) */}
          <button
            id="btn-simulate-excursion"
            onClick={handleExcursionClick}
            disabled={excursionTriggered}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              excursionTriggered
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300'
            }`}
            title="Simulate temperature excursion (4.2°C → 4.8°C → 6.5°C) and trigger automatic Yellow Warning alert"
          >
            <FlaskConical className={`h-3.5 w-3.5 ${excursionTriggered ? 'text-amber-600 animate-spin' : 'text-slate-500'}`} />
            <span>{excursionTriggered ? 'Excursion Ramping...' : 'Simulate Excursion (6.5°C)'}</span>
          </button>

          {/* Door Toggle */}
          <button
            id="btn-toggle-door"
            onClick={() => toggleDoor()}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              isDoorOpen
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle Chamber 01 door open/closed"
          >
            {isDoorOpen ? (
              <>
                <DoorOpen className="h-3.5 w-3.5 text-red-600" />
                <span>Door Ajar</span>
              </>
            ) : (
              <>
                <DoorClosed className="h-3.5 w-3.5 text-emerald-600" />
                <span>Door Sealed</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Clock, Farmer Switcher, Role Selector, User Actions */}
        <div className="flex items-center gap-2">
          {/* AI Advisory Copilot Button */}
          <button
            id="btn-open-copilot"
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              copilotOpen
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            title="ColdChain Storage Advisor"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">AI Advisor</span>
            {unreadAlerts > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Farmer Switcher if role is FARMER */}
          {userRole === 'FARMER' && (
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50/80 px-2 py-1">
              <User className="h-3.5 w-3.5 text-emerald-700" />
              <select
                id="select-active-farmer"
                value={activeFarmerId}
                onChange={(e) => setActiveFarmerId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-emerald-900 focus:outline-hidden cursor-pointer"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white text-slate-900">
                    {f.code} • {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User Role Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <select
              id="select-user-role"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ADMIN">Admin</option>
              <option value="OPERATOR">Operator</option>
              <option value="FARMER">Farmer</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          {/* Landing Page Link */}
          <button
            id="btn-goto-landing"
            onClick={() => setShowLandingPage(true)}
            className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="View Public Landing Page"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">Landing</span>
          </button>

          {/* Clock */}
          <div className="hidden xl:flex flex-col items-end px-2 border-l border-slate-200">
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-800">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{currentTime}</span>
            </div>
            <span className="text-[10px] text-slate-500">{currentDate}</span>
          </div>

          {/* Logout Button */}
          <button
            id="btn-logout"
            onClick={() => {
              setIsLoggedIn(false);
              setShowLandingPage(true);
            }}
            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            title="Log out of session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

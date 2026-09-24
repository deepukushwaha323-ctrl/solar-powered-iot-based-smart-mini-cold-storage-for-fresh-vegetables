import React, { useState } from 'react';
import {
  LayoutDashboard,
  Box,
  Layers,
  Thermometer,
  Zap,
  Fan,
  Bell,
  BarChart3,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Activity,
  User,
  Cpu,
} from 'lucide-react';
import { useColdStorage, NavigationTab } from '../../context/ColdStorageContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, userRole, farmers, activeFarmerId } = useColdStorage();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const pendingAlertCount = alerts.filter((a) => !a.resolved).length;
  const activeFarmer = farmers.find((f) => f.id === activeFarmerId);

  // Dynamic Navigation according to Role
  let navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [];

  if (userRole === 'FARMER') {
    navItems = [
      { id: 'dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard },
      { id: 'racks', label: 'My Assigned Racks', icon: Layers },
      { id: 'vegetables', label: 'My Vegetables', icon: Leaf },
      {
        id: 'alerts',
        label: 'Alerts & Messages',
        icon: Bell,
        badge: pendingAlertCount > 0 ? pendingAlertCount : undefined,
        badgeColor: 'bg-amber-500',
      },
      { id: 'analytics', label: 'Storage Trends', icon: BarChart3 },
      { id: 'reports', label: 'Cold Storage Pass', icon: FileText },
      { id: 'settings', label: 'My Profile & Alerts', icon: User },
    ];
  } else if (userRole === 'OPERATOR') {
    navItems = [
      { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
      { id: 'chambers', label: 'Chambers (4)', icon: Box },
      { id: 'racks', label: 'Rack Management', icon: Layers },
      { id: 'vegetables', label: 'Vegetables & Crops', icon: Leaf },
      { id: 'refrigeration', label: 'Refrigeration VCRC', icon: Fan },
      { id: 'energy', label: 'Solar & Battery', icon: Zap },
      { id: 'sensors', label: 'Sensors Health', icon: Activity },
      {
        id: 'alerts',
        label: 'Alert Center',
        icon: Bell,
        badge: pendingAlertCount > 0 ? pendingAlertCount : undefined,
        badgeColor: 'bg-amber-500',
      },
      { id: 'digitaltwin', label: 'Digital Twin Model', icon: Cpu },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ];
  } else {
    // Admin & Viewer
    navItems = [
      { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
      { id: 'chambers', label: 'Chambers (4)', icon: Box },
      { id: 'racks', label: 'Rack Management', icon: Layers },
      { id: 'vegetables', label: 'Vegetables & Crops', icon: Leaf },
      { id: 'energy', label: 'Solar & Energy', icon: Zap },
      { id: 'refrigeration', label: 'Refrigeration System', icon: Fan },
      { id: 'sensors', label: 'IoT Sensors Health', icon: Activity },
      {
        id: 'alerts',
        label: 'Alert Center',
        icon: Bell,
        badge: pendingAlertCount > 0 ? pendingAlertCount : undefined,
        badgeColor: 'bg-amber-500',
      },
      { id: 'digitaltwin', label: 'Chamber Layout Twin', icon: Cpu },
      { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3 },
      { id: 'reports', label: 'Reports & Quality Pass', icon: FileText },
      { id: 'users', label: 'Farmers & Accounts', icon: Users },
      { id: 'settings', label: 'Thresholds & Settings', icon: Settings },
    ];
  }

  return (
    <aside
      id="app-sidebar"
      className={`relative hidden md:flex flex-col justify-between border-r border-slate-200 bg-white text-slate-700 transition-all duration-300 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top: Logo & Collapse Button */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <span className="block font-bold tracking-tight text-sm text-slate-900">
                  AgriCold IoT
                </span>
                <span className="block text-[10px] font-semibold text-emerald-700 tracking-wider uppercase">
                  Mini Storage Unit 01
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Leaf className="h-5 w-5" />
            </div>
          )}

          <button
            id="btn-collapse-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="space-y-1 px-2.5 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Badge for Alerts etc */}
                {item.badge !== undefined && (
                  <span
                    className={`ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
                      item.badgeColor || 'bg-amber-500'
                    } ${collapsed ? 'absolute top-1 right-1' : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Facility Hardware Status & User Role Profile */}
      <div className="border-t border-slate-200 bg-slate-50/70 p-3">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-[11px] shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  ESP32 Gateway
                </span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">100% Signal</span>
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>Storage Capacity:</span>
                <span className="font-semibold text-slate-800">4 Chambers • 16 Racks</span>
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>Solar PV Array:</span>
                <span className="font-semibold text-emerald-700">3.0 kWp Rooftop</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200">
                {userRole === 'FARMER' ? (activeFarmer ? activeFarmer.code.slice(0, 3) : 'FAR') : userRole.slice(0, 2)}
              </div>
              <div className="overflow-hidden leading-tight">
                <div className="truncate text-xs font-bold text-slate-900">
                  {userRole === 'FARMER' ? (activeFarmer ? activeFarmer.name : 'Farmer User') : `Cold Storage ${userRole}`}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800 uppercase">
                    {userRole}
                  </span>
                  <span>{userRole === 'FARMER' ? (activeFarmer ? activeFarmer.village : 'Village') : 'Authorized'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Gateway Online" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200">
              {userRole.slice(0, 2)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

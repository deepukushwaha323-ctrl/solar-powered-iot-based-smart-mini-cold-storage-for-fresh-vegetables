import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Bell,
  Zap,
  User,
} from 'lucide-react';
import { useColdStorage, NavigationTab } from '../../context/ColdStorageContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, alerts, userRole } = useColdStorage();

  const unreadAlerts = alerts.filter((a) => !a.acknowledged && !a.resolved).length;

  const items: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    {
      id: userRole === 'FARMER' ? 'vegetables' : 'racks',
      label: userRole === 'FARMER' ? 'My Racks' : 'Racks',
      icon: Boxes,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
    },
    { id: 'energy', label: 'Energy', icon: Zap },
    {
      id: userRole === 'FARMER' ? 'settings' : 'users',
      label: userRole === 'FARMER' ? 'Profile' : 'Users',
      icon: User,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur-md shadow-lg"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 text-xs font-medium transition-colors relative min-h-[44px] ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

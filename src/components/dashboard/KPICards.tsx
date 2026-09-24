import React from 'react';
import {
  Boxes,
  PieChart,
  Thermometer,
  Droplets,
  AlertTriangle,
  BatteryCharging,
  Sun,
  Zap,
  Fan,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const KPICards: React.FC = () => {
  const { crates, zones, power, refrigeration } = useColdStorage();

  const totalKg = crates
    .filter((c) => c.status !== 'DISPATCHED')
    .reduce((sum, c) => sum + c.weightKg, 0);

  const activeCratesCount = crates.filter((c) => c.status !== 'DISPATCHED').length;
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacityCrates, 0);
  const totalOccupied = activeCratesCount;
  const utilizationPct = Math.round((totalOccupied / Math.max(1, totalCapacity)) * 100);

  const avgTemp = (zones.reduce((sum, z) => sum + z.currentTempC, 0) / Math.max(1, zones.length)).toFixed(1);
  const avgHumidity = Math.round(
    zones.reduce((sum, z) => sum + z.currentHumidityPct, 0) / Math.max(1, zones.length)
  );

  const highRiskCrates = crates.filter(
    (c) => c.status !== 'DISPATCHED' && (c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL')
  );
  const avgRiskPct = (
    crates
      .filter((c) => c.status !== 'DISPATCHED')
      .reduce((sum, c) => sum + c.spoilageRiskPct, 0) / Math.max(1, activeCratesCount)
  ).toFixed(1);

  const cards = [
    {
      id: 'kpi-inventory',
      title: 'Total Inventory',
      icon: Boxes,
      iconColor: 'text-emerald-400',
      value: `${totalKg.toLocaleString()} kg`,
      subValue: `${activeCratesCount} crates stored`,
      trend: '+8.4% this wk',
      trendUp: true,
      targetRange: 'Capacity: 3,500 kg',
      status: 'Optimal',
      statusColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      sparkline: [20, 24, 22, 28, 32, 35, 38],
      explanation: 'Intake batch received from Valley Green Organics.',
    },
    {
      id: 'kpi-utilization',
      title: 'Storage Utilization',
      icon: PieChart,
      iconColor: 'text-teal-400',
      value: `${utilizationPct}%`,
      subValue: `${totalOccupied} / ${totalCapacity} crate capacity`,
      trend: '44 slots open',
      trendUp: true,
      targetRange: 'Target: 70–85%',
      status: 'Balanced',
      statusColor: 'text-teal-400 bg-teal-950/60 border-teal-800/60',
      sparkline: [70, 72, 75, 74, 76, 77, 78],
      explanation: 'Evenly distributed across Zones A–D.',
    },
    {
      id: 'kpi-temp',
      title: 'Average Temperature',
      icon: Thermometer,
      iconColor: 'text-cyan-400',
      value: `${avgTemp}°C`,
      subValue: 'Chamber mean core',
      trend: 'Setpoint: 4.0°C',
      trendUp: false,
      targetRange: 'Target 2.0–6.0°C',
      status: 'Optimal',
      statusColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      sparkline: [5.8, 5.5, 5.4, 5.2, 5.1, 5.2, Number(avgTemp)],
      explanation: 'Cold air circulation steady across all 4 zones.',
    },
    {
      id: 'kpi-humidity',
      title: 'Average Humidity',
      icon: Droplets,
      iconColor: 'text-blue-400',
      value: `${avgHumidity}%`,
      subValue: 'Microclimate RH',
      trend: '+1.2% stable',
      trendUp: true,
      targetRange: 'Target 85–92%',
      status: 'Target Met',
      statusColor: 'text-blue-400 bg-blue-950/60 border-blue-800/60',
      sparkline: [86, 87, 88, 87, 89, 88, avgHumidity],
      explanation: 'Ultrasonic fogger mist cycle inactive.',
    },
    {
      id: 'kpi-spoilage',
      title: 'Spoilage Risk',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      value: `${avgRiskPct}%`,
      subValue: `${highRiskCrates.length} crates require triage`,
      trend: '↓ 2.1% from yest',
      trendUp: false,
      targetRange: 'Safety limit < 10%',
      status: Number(avgRiskPct) > 10 ? 'Elevated' : 'Safe',
      statusColor: Number(avgRiskPct) > 10
        ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
        : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      sparkline: [8.9, 8.4, 7.8, 7.2, 7.0, 6.9, Number(avgRiskPct)],
      explanation: 'CR-002 & CR-013 flagged for expedited dispatch.',
    },
    {
      id: 'kpi-battery',
      title: 'Battery Reserve (SOC)',
      icon: BatteryCharging,
      iconColor: 'text-emerald-400',
      value: `${Math.round(power.batterySocPct)}%`,
      subValue: `${power.batteryVoltageVolts.toFixed(1)}V • ${power.batteryPowerWatts > 0 ? '+' : ''}${power.batteryPowerWatts}W`,
      trend: `Runtime: ${Math.floor(power.batteryRuntimeRemainingHours)}h ${Math.round((power.batteryRuntimeRemainingHours % 1) * 60)}m`,
      trendUp: true,
      targetRange: 'Low cut: 20%',
      status: power.batteryPowerWatts >= 0 ? 'Charging' : 'Discharging',
      statusColor: power.batteryPowerWatts >= 0
        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
        : 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      sparkline: [74, 75, 76, 76, 77, 78, Math.round(power.batterySocPct)],
      explanation: 'LiFePO4 48V bank healthy (97.5% SoH).',
    },
    {
      id: 'kpi-solar',
      title: 'Solar Generation',
      icon: Sun,
      iconColor: 'text-amber-300',
      value: `${power.solarPowerWatts} W`,
      subValue: `${power.dailySolarGenerationKwh} kWh generated today`,
      trend: `${power.mpptEfficiencyPct}% MPPT Eff`,
      trendUp: true,
      targetRange: 'Array peak: 600 W',
      status: 'Active PV',
      statusColor: 'text-amber-300 bg-amber-950/60 border-amber-800/60',
      sparkline: [120, 240, 380, 420, 440, 430, power.solarPowerWatts],
      explanation: 'Monocrystalline array tracking clear sky.',
    },
    {
      id: 'kpi-energy',
      title: 'Energy & Cooling',
      icon: Zap,
      iconColor: 'text-indigo-400',
      value: `${power.totalLoadWatts} W`,
      subValue: `${power.dailyConsumptionKwh} kWh load today`,
      trend: `Refrig: ${power.refrigerationPowerWatts} W`,
      trendUp: false,
      targetRange: `COP: ${refrigeration.copEfficiency}`,
      status: refrigeration.compressorStatus,
      statusColor: refrigeration.compressorStatus === 'RUNNING'
        ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
        : 'text-slate-400 bg-slate-900 border-slate-800',
      sparkline: [280, 290, 310, 305, 315, 310, power.totalLoadWatts],
      explanation: 'Inverter compressor running at 68% variable speed.',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const minVal = Math.min(...card.sparkline);
        const maxVal = Math.max(...card.sparkline);
        const range = maxVal - minVal || 1;

        return (
          <div
            key={card.id}
            id={card.id}
            className="group relative flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 shadow-sm hover:shadow-md"
          >
            {/* Header: Title & Status Chip */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </h3>
                  <span className="text-[10px] text-slate-400">{card.targetRange}</span>
                </div>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${card.statusColor}`}
              >
                {card.status}
              </span>
            </div>

            {/* Main Value & Sparkline */}
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-black tracking-tight text-white font-mono">
                  {card.value}
                </div>
                <div className="text-xs text-slate-300 font-medium">{card.subValue}</div>
              </div>

              {/* Mini Sparkline SVG */}
              <div className="h-9 w-20 shrink-0">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 70 30">
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    points={card.sparkline
                      .map((val, idx) => {
                        const x = (idx / (card.sparkline.length - 1)) * 70;
                        const y = 26 - ((val - minVal) / range) * 22;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            </div>

            {/* Footer context */}
            <div className="mt-3 border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                {card.trend}
              </span>
              <span className="truncate max-w-[130px] text-[10px] text-slate-400 italic text-right">
                {card.explanation}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

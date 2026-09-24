import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Crate,
  StorageZone,
  SensorReading,
  PowerFlowState,
  RefrigerationState,
  AlertItem,
  AnomalyItem,
  TelemetryPacket,
  UserRole,
  ChamberData,
  RackItem,
  FarmerProfile,
  HardwareSensor,
  ThresholdSettings,
} from '../types';
import {
  INITIAL_CRATES,
  INITIAL_ZONES,
  INITIAL_SENSORS,
  INITIAL_POWER,
  INITIAL_REFRIGERATION,
  INITIAL_ALERTS,
  INITIAL_ANOMALIES,
} from '../data/mockDatabase';
import {
  INITIAL_CHAMBERS,
  INITIAL_RACKS,
  INITIAL_FARMERS,
  INITIAL_HARDWARE_SENSORS,
  INITIAL_THRESHOLDS,
} from '../data/sihColdStorageData';
import { iotSimulator } from '../services/iotSimulator';

export type NavigationTab =
  | 'dashboard'
  | 'chambers'
  | 'chamber_detail'
  | 'racks'
  | 'rack_detail'
  | 'vegetables'
  | 'energy'
  | 'refrigeration'
  | 'sensors'
  | 'alerts'
  | 'analytics'
  | 'reports'
  | 'users'
  | 'settings'
  | 'landing'
  | 'inventory'
  | 'crates'
  | 'zones'
  | 'digitaltwin'
  | 'environment'
  | 'solar'
  | 'ai'
  | 'logs';

export type DigitalTwinVisualMode =
  | 'NORMAL'
  | 'TEMPERATURE'
  | 'HUMIDITY'
  | 'SPOILAGE_RISK'
  | 'ETHYLENE'
  | 'ENERGY'
  | 'AIRFLOW';

interface ColdStorageContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  crates: Crate[];
  zones: StorageZone[];
  sensors: SensorReading[];
  power: PowerFlowState;
  refrigeration: RefrigerationState;
  alerts: AlertItem[];
  anomalies: AnomalyItem[];
  telemetryPackets: TelemetryPacket[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedCrateId: string | null;
  setSelectedCrateId: (id: string | null) => void;
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  digitalTwinMode: DigitalTwinVisualMode;
  setDigitalTwinMode: (mode: DigitalTwinVisualMode) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isDoorOpen: boolean;
  isHeatwave: boolean;
  isCloudCover: boolean;
  isSimulationPaused: boolean;
  setIsSimulationPaused: (paused: boolean) => void;
  toggleDoor: (open?: boolean) => void;
  toggleHeatwave: (active?: boolean) => void;
  toggleCloudCover: (active?: boolean) => void;
  setSetpoint: (tempC: number) => void;
  dispatchCrate: (id: string) => void;
  moveCrate: (id: string, newZone: string, newRack: string, shelf: number, slot: number) => void;
  updateCrateWeight: (id: string, weight: number) => void;
  addCrate: (newCrateData: Partial<Crate>) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  triggerDefrost: () => void;

  // SIH 2026 Extended Features
  chambers: ChamberData[];
  racks: RackItem[];
  farmers: FarmerProfile[];
  hardwareSensors: HardwareSensor[];
  thresholds: ThresholdSettings;
  activeFarmerId: string;
  setActiveFarmerId: (id: string) => void;
  selectedChamberId: string;
  setSelectedChamberId: (id: string) => void;
  selectedRackId: string;
  setSelectedRackId: (id: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (mode: boolean) => void;
  isDataConnectionLost: boolean;
  setIsDataConnectionLost: (lost: boolean) => void;
  lastIoTUpdatedSec: number;
  batteryBackupMode: 'AUTO' | 'BACKUP' | 'CHARGING' | 'STANDBY';
  setBatteryBackupMode: (mode: 'AUTO' | 'BACKUP' | 'CHARGING' | 'STANDBY') => void;
  compressorMode: 'AUTO' | 'ON' | 'OFF';
  setCompressorMode: (mode: 'AUTO' | 'ON' | 'OFF') => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
  assignRackToFarmer: (rackId: string, farmerId: string, vegetable: string, variety: string, quantityKg: number) => void;
  updateThresholds: (settings: Partial<ThresholdSettings>) => void;
  triggerDemoExcursion: () => void;
  updateRack: (rackId: string, partial: Partial<RackItem>) => void;
}

const ColdStorageContext = createContext<ColdStorageContextType | undefined>(undefined);

export const ColdStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [crates, setCrates] = useState<Crate[]>(INITIAL_CRATES);
  const [zones, setZones] = useState<StorageZone[]>(INITIAL_ZONES);
  const [sensors, setSensors] = useState<SensorReading[]>(INITIAL_SENSORS);
  const [power, setPower] = useState<PowerFlowState>(INITIAL_POWER);
  const [refrigeration, setRefrigeration] = useState<RefrigerationState>(INITIAL_REFRIGERATION);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>(INITIAL_ANOMALIES);
  const [telemetryPackets, setTelemetryPackets] = useState<TelemetryPacket[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');

  // SIH 2026 Core State
  const [chambers, setChambers] = useState<ChamberData[]>(INITIAL_CHAMBERS);
  const [racks, setRacks] = useState<RackItem[]>(INITIAL_RACKS);
  const [farmers, setFarmers] = useState<FarmerProfile[]>(INITIAL_FARMERS);
  const [hardwareSensors, setHardwareSensors] = useState<HardwareSensor[]>(INITIAL_HARDWARE_SENSORS);
  const [thresholds, setThresholds] = useState<ThresholdSettings>(INITIAL_THRESHOLDS);
  const [activeFarmerId, setActiveFarmerId] = useState<string>('FARMER_001');
  const [selectedChamberId, setSelectedChamberId] = useState<string>('C01');
  const [selectedRackId, setSelectedRackId] = useState<string>('R01');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isDataConnectionLost, setIsDataConnectionLost] = useState<boolean>(false);
  const [lastIoTUpdatedSec, setLastIoTUpdatedSec] = useState<number>(8);
  const [batteryBackupMode, setBatteryBackupMode] = useState<'AUTO' | 'BACKUP' | 'CHARGING' | 'STANDBY'>('AUTO');
  const [compressorMode, setCompressorMode] = useState<'AUTO' | 'ON' | 'OFF'>('AUTO');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);

  const [selectedCrateId, setSelectedCrateId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [digitalTwinMode, setDigitalTwinMode] = useState<DigitalTwinVisualMode>('NORMAL');
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  const [isDoorOpen, setIsDoorOpen] = useState<boolean>(false);
  const [isHeatwave, setIsHeatwave] = useState<boolean>(false);
  const [isCloudCover, setIsCloudCover] = useState<boolean>(false);
  const [isSimulationPaused, setIsSimulationPaused] = useState<boolean>(false);

  // Global Keyboard listener for Ctrl+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // IoT heartbeat second timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLastIoTUpdatedSec((sec) => (sec >= 30 ? 1 : sec + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Physics simulation tick
  useEffect(() => {
    if (isSimulationPaused || isDataConnectionLost) return;

    const interval = setInterval(() => {
      setLastIoTUpdatedSec(1);

      // Micro-fluctuations for realistic live IoT
      setChambers((prevChambers) =>
        prevChambers.map((c) => {
          if (c.id === 'C03' && c.status === 'Warning') {
            const jitter = (Math.random() - 0.48) * 0.1;
            return {
              ...c,
              actualTempC: Number((c.actualTempC + jitter).toFixed(1)),
              humidityPct: Math.min(88, Math.max(80, Math.round(c.humidityPct + (Math.random() - 0.5)))),
            };
          }
          const drift = (Math.random() - 0.5) * 0.05;
          return {
            ...c,
            actualTempC: Number((c.actualTempC + drift).toFixed(1)),
          };
        })
      );

      setHardwareSensors((prev) =>
        prev.map((s) => {
          if (s.type === 'TEMPERATURE' && s.numericValue) {
            const shift = (Math.random() - 0.5) * 0.05;
            const newVal = Number((s.numericValue + shift).toFixed(1));
            return {
              ...s,
              numericValue: newVal,
              currentValue: `${newVal}°C`,
              lastUpdate: 'Just now',
            };
          }
          return { ...s, lastUpdate: 'Just now' };
        })
      );

      setCrates((prevCrates) => {
        setZones((prevZones) => {
          setSensors((prevSensors) => {
            setPower((prevPower) => {
              setRefrigeration((prevRefrig) => {
                setAlerts((prevAlerts) => {
                  const result = iotSimulator.step(
                    prevZones,
                    prevCrates,
                    prevSensors,
                    prevPower,
                    prevRefrig,
                    prevAlerts
                  );

                  setTelemetryPackets((pkts) => [result.newPacket, ...pkts.slice(0, 49)]);

                  setTimeout(() => {
                    setZones(result.zones);
                    setCrates(result.crates);
                    setSensors(result.sensors);
                    setPower(result.power);
                    setRefrigeration(result.refrigeration);
                    setAlerts(result.alerts);
                  }, 0);

                  return prevAlerts;
                });
                return prevRefrig;
              });
              return prevPower;
            });
            return prevSensors;
          });
          return prevZones;
        });
        return prevCrates;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isSimulationPaused, isDataConnectionLost]);

  // Demo Mode Feature: 4.2°C -> 4.8°C -> 6.5°C excursion simulation
  const triggerDemoExcursion = useCallback(() => {
    // Step 1: Ramp up R01 and Chamber 01
    setRacks((prev) =>
      prev.map((r) =>
        r.id === 'R01' ? { ...r, currentTempC: 4.8, conditionScore: 88, storageStatus: 'Good' } : r
      )
    );

    setTimeout(() => {
      setRacks((prev) =>
        prev.map((r) =>
          r.id === 'R01'
            ? {
                ...r,
                currentTempC: 6.5,
                conditionScore: 65,
                storageStatus: 'Attention',
                alertMessage: 'Temperature in Rack R01 exceeded target threshold (6.5°C > 5.0°C).',
              }
            : r
        )
      );

      setChambers((prev) =>
        prev.map((c) =>
          c.id === 'C01'
            ? {
                ...c,
                actualTempC: 6.5,
                status: 'Warning',
                coolingStatus: 'Cooling Boost',
              }
            : c
        )
      );

      // Inject Yellow Warning Alert into alerts list
      const newAlert: AlertItem = {
        id: `ALT-DEMO-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Temperature in Rack R01 has exceeded configured limit for 15 minutes (6.5°C vs 5.0°C)',
        severity: 'WARNING',
        category: 'TEMPERATURE',
        location: 'Chamber 01 — Rack R01',
        sensorId: 'T01',
        currentReading: '6.5°C',
        threshold: '5.0°C',
        durationMinutes: 15,
        aiDiagnosis: 'Demonstration temperature excursion triggered. Solar-powered compressor dispatched to maximum rpm.',
        recommendedAction: 'Verify chamber door seal and ensure evaporator fan air throw is unblocked.',
        resolved: false,
        acknowledged: false,
      };

      setAlerts((prev) => [newAlert, ...prev]);
    }, 1500);
  }, []);

  const assignRackToFarmer = useCallback(
    (rackId: string, farmerId: string, vegetable: string, variety: string, quantityKg: number) => {
      const farmer = farmers.find((f) => f.id === farmerId);
      const farmerName = farmer ? `${farmer.code} (${farmer.name})` : farmerId;

      setRacks((prev) =>
        prev.map((r) => {
          if (r.id === rackId) {
            return {
              ...r,
              farmerId,
              farmerName,
              vegetable,
              variety,
              quantityKg,
              loadingDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
              loadingTimestamp: new Date().toISOString(),
              storageDays: 0,
              storageStatus: 'Good',
              conditionScore: 98,
              alertMessage: null,
              history: [
                {
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  event: 'New Batch Stored',
                  detail: `${quantityKg} kg ${vegetable} (${variety}) loaded by ${farmerName}`,
                },
                ...r.history,
              ],
            };
          }
          return r;
        })
      );
    },
    [farmers]
  );

  const updateRack = useCallback((rackId: string, partial: Partial<RackItem>) => {
    setRacks((prev) => prev.map((r) => (r.id === rackId ? { ...r, ...partial } : r)));
  }, []);

  const updateThresholds = useCallback((settings: Partial<ThresholdSettings>) => {
    setThresholds((prev) => ({ ...prev, ...settings }));
  }, []);

  const toggleDoor = useCallback((open?: boolean) => {
    setIsDoorOpen((prev) => {
      const next = open !== undefined ? open : !prev;
      iotSimulator.setDoorOpen(next);
      setChambers((chambers) =>
        chambers.map((c) =>
          c.id === 'C01' ? { ...c, doorStatus: next ? 'Open' : 'Sealed' } : c
        )
      );
      return next;
    });
  }, []);

  const toggleHeatwave = useCallback((active?: boolean) => {
    setIsHeatwave((prev) => {
      const next = active !== undefined ? active : !prev;
      iotSimulator.setHeatwave(next);
      return next;
    });
  }, []);

  const toggleCloudCover = useCallback((active?: boolean) => {
    setIsCloudCover((prev) => {
      const next = active !== undefined ? active : !prev;
      iotSimulator.setCloudCover(next);
      return next;
    });
  }, []);

  const setSetpoint = useCallback((tempC: number) => {
    setRefrigeration((prev) => ({
      ...prev,
      setpointC: Number(tempC.toFixed(1)),
    }));
  }, []);

  const dispatchCrate = useCallback((id: string) => {
    setCrates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'DISPATCHED',
            recommendedAction: 'Dispatched from cold chain.',
            historyEvents: [
              {
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                event: 'Dispatched',
                detail: 'Loaded on outbound reefer transport truck',
              },
              ...c.historyEvents,
            ],
          };
        }
        return c;
      })
    );
  }, []);

  const moveCrate = useCallback(
    (id: string, newZone: string, newRack: string, shelf: number, slot: number) => {
      setCrates((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return {
              ...c,
              zoneId: newZone,
              rackId: newRack,
              shelfIndex: shelf,
              slotIndex: slot,
              historyEvents: [
                {
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  event: 'Relocated',
                  detail: `Moved from ${c.zoneId} to ${newZone} (${newRack}, Tier ${shelf + 1})`,
                },
                ...c.historyEvents,
              ],
            };
          }
          return c;
        })
      );
    },
    []
  );

  const updateCrateWeight = useCallback((id: string, weight: number) => {
    setCrates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weightKg: Number(weight.toFixed(1)) } : c))
    );
  }, []);

  const addCrate = useCallback((newCrateData: Partial<Crate>) => {
    const newId = `CR-${String(Math.floor(Math.random() * 900) + 100)}`;
    const fullCrate: Crate = {
      id: newId,
      crop: newCrateData.crop || 'Baby Spinach',
      category: newCrateData.category || 'leafy_vegetables',
      weightKg: newCrateData.weightKg || 18.0,
      initialWeightKg: newCrateData.initialWeightKg || 18.0,
      zoneId: newCrateData.zoneId || 'ZONE_A',
      rackId: newCrateData.rackId || 'RACK_A1',
      shelfIndex: newCrateData.shelfIndex || 0,
      slotIndex: newCrateData.slotIndex || 0,
      temperatureC: 3.2,
      humidityPct: 92,
      storedDays: 0,
      harvestDate: new Date().toISOString().split('T')[0],
      storageDate: new Date().toISOString().split('T')[0],
      shelfLifeDaysRemaining: 10,
      spoilageRiskPct: 5.0,
      riskLevel: 'LOW',
      status: 'OPTIMAL',
      targetTempRange: newCrateData.targetTempRange || [1.0, 4.0],
      targetHumidityRange: newCrateData.targetHumidityRange || [90, 98],
      batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
      farmerSource: newCrateData.farmerSource || 'Local Farm Network',
      rfidTag: `E280-1160-2000-${Math.floor(Math.random() * 9000 + 1000)}`,
      recommendedAction: 'Intake inspection verified. Store at standard zone settings.',
      riskFactors: ['Fresh intake', 'Zero chilling damage'],
      historyEvents: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: 'Check-in Intake',
          detail: `Received ${newCrateData.weightKg || 18.0} kg into cold storage`,
        },
      ],
      temperatureHistory: [
        { time: '00:00', temp: 3.2, humidity: 92 },
        { time: '04:00', temp: 3.2, humidity: 92 },
        { time: '08:00', temp: 3.2, humidity: 92 },
      ],
    };
    setCrates((prev) => [fullCrate, ...prev]);
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  }, []);

  const triggerDefrost = useCallback(() => {
    setRefrigeration((prev) => ({
      ...prev,
      compressorStatus: 'DEFROST',
      defrostActive: true,
      evaporatorTempC: 8.5,
    }));
    setTimeout(() => {
      setRefrigeration((prev) => ({
        ...prev,
        compressorStatus: 'RUNNING',
        defrostActive: false,
        evaporatorTempC: -4.5,
      }));
    }, 8000);
  }, []);

  return (
    <ColdStorageContext.Provider
      value={{
        activeTab,
        setActiveTab,
        crates,
        zones,
        sensors,
        power,
        refrigeration,
        alerts,
        anomalies,
        telemetryPackets,
        userRole,
        setUserRole,
        selectedCrateId,
        setSelectedCrateId,
        selectedZoneId,
        setSelectedZoneId,
        digitalTwinMode,
        setDigitalTwinMode,
        copilotOpen,
        setCopilotOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        isDoorOpen,
        isHeatwave,
        isCloudCover,
        isSimulationPaused,
        setIsSimulationPaused,
        toggleDoor,
        toggleHeatwave,
        toggleCloudCover,
        setSetpoint,
        dispatchCrate,
        moveCrate,
        updateCrateWeight,
        addCrate,
        acknowledgeAlert,
        resolveAlert,
        triggerDefrost,

        // SIH 2026
        chambers,
        racks,
        farmers,
        hardwareSensors,
        thresholds,
        activeFarmerId,
        setActiveFarmerId,
        selectedChamberId,
        setSelectedChamberId,
        selectedRackId,
        setSelectedRackId,
        isDemoMode,
        setIsDemoMode,
        isDataConnectionLost,
        setIsDataConnectionLost,
        lastIoTUpdatedSec,
        batteryBackupMode,
        setBatteryBackupMode,
        compressorMode,
        setCompressorMode,
        isLoggedIn,
        setIsLoggedIn,
        showLandingPage,
        setShowLandingPage,
        assignRackToFarmer,
        updateThresholds,
        triggerDemoExcursion,
        updateRack,
      }}
    >
      {children}
    </ColdStorageContext.Provider>
  );
};

export const useColdStorage = () => {
  const context = useContext(ColdStorageContext);
  if (!context) {
    throw new Error('useColdStorage must be used within a ColdStorageProvider');
  }
  return context;
};


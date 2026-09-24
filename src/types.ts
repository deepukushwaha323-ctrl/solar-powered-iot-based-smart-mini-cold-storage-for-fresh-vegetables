export type CropCategory = 'leafy_vegetables' | 'fruits' | 'roots_tubers' | 'nightshades' | 'herbs' | 'other';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';

export type CrateStatus = 'OPTIMAL' | 'MONITORING' | 'EXPIRING_SOON' | 'DISPATCH_READY' | 'DISPATCHED';

export type UserRole = 'ADMIN' | 'OPERATOR' | 'MANAGER' | 'VIEWER' | 'FARMER';

export interface AlertRecord {
  id: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  chamberId?: string;
  rackId?: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface Crate {
  id: string; // e.g. "CR-001"
  crop: string; // e.g. "Spinach"
  category: CropCategory;
  weightKg: number;
  initialWeightKg: number;
  zoneId: string; // "ZONE_A"
  rackId: string; // "RACK_01"
  shelfIndex: number; // 0, 1, 2
  slotIndex: number; // 0, 1, 2, 3
  temperatureC: number;
  humidityPct: number;
  storedDays: number;
  harvestDate: string;
  storageDate: string;
  shelfLifeDaysRemaining: number;
  spoilageRiskPct: number;
  riskLevel: RiskLevel;
  status: CrateStatus;
  targetTempRange: [number, number]; // [min, max]
  targetHumidityRange: [number, number]; // [min, max]
  batchNumber: string;
  farmerSource: string;
  rfidTag: string;
  recommendedAction: string;
  riskFactors: string[];
  ethyleneProduction?: 'HIGH' | 'MEDIUM' | 'LOW';
  ethyleneSensitivity?: 'HIGH' | 'MEDIUM' | 'LOW';
  degreeHoursStress?: number;
  moistureLossPct?: number;
  historyEvents: {
    timestamp: string;
    event: string;
    detail: string;
  }[];
  temperatureHistory: { time: string; temp: number; humidity: number }[];
}

export interface StorageZone {
  id: string; // "ZONE_A"
  name: string; // "Zone A"
  cropTypeLabel: string; // "Leafy Vegetables"
  category: CropCategory;
  targetTempRange: [number, number];
  targetHumidityRange: [number, number];
  currentTempC: number;
  currentHumidityPct: number;
  capacityCrates: number;
  utilizedCrates: number;
  energyDemandWatts: number;
  airflowRateM3h: number;
  ethylenePpm?: number;
  dewPointC?: number;
  status: 'OPTIMAL' | 'WARNING' | 'ALERT';
  racks: {
    id: string;
    label: string;
    shelvesCount: number;
    slotsPerShelf: number;
  }[];
}

export interface SensorReading {
  id: string;
  name: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'DOOR' | 'CO2' | 'AMBIENT_TEMP' | 'PRESSURE';
  zoneId?: string;
  currentValue: number;
  unit: string;
  minReading: number;
  maxReading: number;
  avgReading: number;
  targetRange?: [number, number];
  status: 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  healthStatus: 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  lastPing: string;
  history24h: { time: string; value: number }[];
}

export interface AlertItem {
  id: string;
  timestamp: string;
  title: string;
  message?: string;
  severity: AlertSeverity;
  category: 'TEMPERATURE' | 'HUMIDITY' | 'DOOR' | 'BATTERY' | 'SOLAR' | 'COMPRESSOR' | 'SENSOR' | 'SPOILAGE' | 'ETHYLENE' | 'SYSTEM';
  location: string;
  chamberId?: string;
  rackId?: string;
  sensorId?: string;
  currentReading: string;
  threshold: string;
  durationMinutes: number;
  aiDiagnosis: string;
  recommendedAction: string;
  resolved: boolean;
  acknowledged: boolean;
}

export interface PowerFlowState {
  solarPowerWatts: number;
  pvVoltageVolts: number;
  pvCurrentAmps: number;
  solarVoltageVolts: number;
  solarCurrentAmps: number;
  dailySolarGenerationKwh: number;
  mpptEfficiencyPct: number;

  batterySocPct: number;
  batteryVoltageVolts: number;
  batteryCurrentAmps: number; // positive = charging, negative = discharging
  batteryPowerWatts: number; // positive = charging, negative = discharging
  batteryRuntimeRemainingHours: number;
  batteryHealthPct: number;
  batteryTempC: number;

  dcBusVoltageVolts: number;
  totalLoadWatts: number;

  refrigerationPowerWatts: number;
  lightingPowerWatts: number;
  controllerPowerWatts: number;
  fanPowerWatts: number;

  dailyConsumptionKwh: number;
}

export interface RefrigerationState {
  compressorStatus: 'RUNNING' | 'IDLE' | 'DEFROST' | 'FAULT';
  compressorPowerWatts: number;
  suctionPressureBar: number;
  suctionTempC: number;
  dischargePressureBar: number;
  dischargeTempC: number;
  condenserTempC: number;
  superheatKelvin: number;
  evaporatorTempC: number;
  coldRoomTempC: number;
  setpointC: number;
  copEfficiency: number;
  runtimeTodayHours: number;
  cycleCountToday: number;
  lastMaintenanceDate: string;
  compressorMaintenanceProbabilityPct: number;
  estimatedServiceWindowDays: number;
  defrostActive: boolean;
  ecoSheddingActive?: boolean;
  solarSubcoolingActive?: boolean;
}

export interface AnomalyItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  probabilityPct: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  metric: string;
  deviation: string;
  possibleCauses: string[];
  recommendedInspection: string;
  detectedAt: string;
}

export interface FIFORecord {
  priorityRank: number;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  crateId: string;
  crop: string;
  category: CropCategory;
  weightKg: number;
  zone: string;
  rack: string;
  daysStored: number;
  shelfLifeRemainingDays: number;
  spoilageRiskScore: number;
  recommendedAction: string;
  demandFactor: 'HIGH' | 'MEDIUM' | 'NORMAL';
  marketUrgencyScore: number; // 0-100
}

export interface TelemetryPacket {
  id: string;
  timestamp: string;
  gatewayId: string;
  topic: string;
  payload: Record<string, unknown>;
  rssi: number;
  batteryLevelPct?: number;
}

// -------------------------------------------------------------
// SIH 2026 SPECIFIC DOMAIN DATA STRUCTURES
// -------------------------------------------------------------

export interface RackItem {
  id: string; // "R01" through "R16"
  chamberId: string; // "C01", "C02", "C03", "C04"
  chamberName: string; // "Chamber 01"
  farmerId: string; // "FARMER_001"
  farmerName: string; // "Farmer 001 (Ramesh Patel)"
  farmerContact: string; // "+91 98765 43210"
  vegetable: string; // "Tomato", "Potato", "Cabbage", "Chilli", etc.
  variety: string; // "Roma Hybrid", "Kufri Jyoti", etc.
  quantityKg: number; // 80, 100, 60, 50, etc.
  loadingDate: string; // "15 September 2026"
  loadingTimestamp: string;
  storageDays: number;
  currentTempC: number;
  currentHumidityPct: number;
  humidityPct?: number; // convenience alias
  gasPpm: number;
  gasStatus: 'Normal' | 'Elevated' | 'Warning';
  storageStatus: 'Good' | 'Attention' | 'Critical' | 'Empty';
  conditionScore: number; // 0-100 calculated from sensor readings & configured limits
  alertMessage: string | null;
  targetTempRange: [number, number];
  targetHumidityRange: [number, number];
  batchId: string; // "BATCH-TOM-001"
  history: {
    timestamp: string;
    event: string;
    detail: string;
  }[];
}

export interface ChamberData {
  id: string; // "C01", "C02", "C03", "C04"
  number: number; // 1, 2, 3, 4
  name: string; // "Chamber 01"
  targetTempC: number;
  actualTempC: number;
  humidityPct: number;
  targetHumidityPct?: number;
  totalRacks?: number;
  gasLevelPpm: number;
  gasStatus: 'Normal' | 'Elevated' | 'Warning';
  racksRange: string; // "R01–R04"
  rackIds: string[]; // ["R01", "R02", "R03", "R04"]
  occupiedRacks: number;
  availableRacks: number;
  coolingStatus: 'Active' | 'Standby' | 'Cooling Boost';
  doorStatus: 'Sealed' | 'Open' | 'Ajar';
  status: 'Normal' | 'Warning' | 'Critical';
  cropSpecialty: string;
  allocatedCrop?: string; // convenience alias
  tempHistory24h: { time: string; temp: number; target: number }[];
  humidityHistory24h: { time: string; humidity: number; target: number }[];
  gasHistory24h: { time: string; gasPpm: number; warningThreshold: number; criticalThreshold: number }[];
  historicalData?: { time: string; temp: number; humidity: number; gasPpm: number }[];
  timeline: { time: string; event: string; status: 'normal' | 'warning' | 'info' }[];
  timelineEvents?: { time: string; event: string; detail: string }[];
}

export interface FarmerProfile {
  id: string; // "FARMER_001"
  code: string; // "Farmer 001"
  name: string; // "Ramesh Patel"
  phone: string; // "+91 98765 43210"
  email?: string;
  village: string; // "Nashik Rural, Maharashtra"
  assignedRackIds: string[]; // ["R01", "R04"]
  assignedRacks?: string[]; // convenience alias
  totalQuantityKg: number;
}

export interface BatchRecord {
  batchId: string; // "BATCH-TOM-001"
  rackId: string; // "R01"
  farmerId: string; // "FARMER_001"
  farmerName: string;
  vegetable: string;
  variety: string;
  quantityKg: number;
  loadingDate: string;
  expectedDurationDays: number;
  storedDays: number;
  currentCondition: 'Good' | 'Attention' | 'Critical';
  conditionScore: number;
  temperatureRange: [number, number];
  humidityRange: [number, number];
  status: string;
}

export interface HardwareSensor {
  id: string; // "T01", "RH01", "G01", "P01", "ESP32"
  name: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'GAS' | 'POWER' | 'CONTROLLER';
  location: string;
  currentValue: string;
  numericValue: number;
  unit: string;
  status: 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  lastUpdate: string;
  min24h?: string;
  max24h?: string;
}

export interface ThresholdSettings {
  c01TargetTemp: number;
  c01TempMax: number;
  c02TargetTemp: number;
  c02TempMax: number;
  c03TargetTemp: number;
  c03TempMax: number;
  c04TargetTemp: number;
  c04TempMax: number;
  humidityMin: number;
  humidityMax: number;
  gasWarningThresholdPpm: number;
  gasCriticalThresholdPpm: number;
  batteryLowSocWarning: number;
  batteryCriticalSoc: number;
  solarDaylightMinWatts: number;
  esp32HeartbeatTimeoutSec: number;
}

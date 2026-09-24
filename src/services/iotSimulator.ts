import { Crate, StorageZone, SensorReading, PowerFlowState, RefrigerationState, AlertItem, TelemetryPacket } from '../types';

export interface SimulationState {
  doorOpen: boolean;
  doorOpenSeconds: number;
  heatwaveActive: boolean;
  cloudCoverActive: boolean;
  solarHourOfDay: number; // 0-24
  ambientTempC: number;
  compressorMode: 'AUTO' | 'FORCE_RUN' | 'FORCE_IDLE';
}

export class IoTSimulationEngine {
  private simState: SimulationState = {
    doorOpen: false,
    doorOpenSeconds: 0,
    heatwaveActive: false,
    cloudCoverActive: false,
    solarHourOfDay: 12.0, // midday
    ambientTempC: 28.4,
    compressorMode: 'AUTO',
  };

  public getSimulationState(): SimulationState {
    return { ...this.simState };
  }

  public setDoorOpen(open: boolean): void {
    this.simState.doorOpen = open;
    if (!open) {
      this.simState.doorOpenSeconds = 0;
    }
  }

  public setHeatwave(active: boolean): void {
    this.simState.heatwaveActive = active;
    this.simState.ambientTempC = active ? 36.5 : 28.4;
  }

  public setCloudCover(active: boolean): void {
    this.simState.cloudCoverActive = active;
  }

  public setCompressorMode(mode: 'AUTO' | 'FORCE_RUN' | 'FORCE_IDLE'): void {
    this.simState.compressorMode = mode;
  }

  /**
   * Physics & Biological tick: runs every simulation step
   */
  public step(
    prevZones: StorageZone[],
    prevCrates: Crate[],
    prevSensors: SensorReading[],
    prevPower: PowerFlowState,
    prevRefrig: RefrigerationState,
    prevAlerts: AlertItem[]
  ): {
    zones: StorageZone[];
    crates: Crate[];
    sensors: SensorReading[];
    power: PowerFlowState;
    refrigeration: RefrigerationState;
    alerts: AlertItem[];
    newPacket: TelemetryPacket;
  } {
    const isDoorOpen = this.simState.doorOpen;
    if (isDoorOpen) {
      this.simState.doorOpenSeconds += 3;
    }

    const ambient = this.simState.ambientTempC + Math.sin(Date.now() / 30000) * 0.4;

    // 1. Identify Ethylene producers and sensitivity across zones
    const highEthyleneCrops = ['Tomatoes', 'Apples', 'Bananas', 'Pears'];
    const ethyleneSensitiveCrops = ['Spinach', 'Lettuce', 'Broccoli', 'Carrots'];

    const activeCrates = prevCrates.filter((c) => c.status !== 'DISPATCHED');

    const zoneEthyleneMap: Record<string, { ppm: number; hasProducer: boolean; hasSensitive: boolean }> = {};
    prevZones.forEach((z) => {
      const zCrates = activeCrates.filter((c) => c.zoneId === z.id);
      const hasProducer = zCrates.some(
        (c) => highEthyleneCrops.includes(c.crop) || c.ethyleneProduction === 'HIGH'
      );
      const hasSensitive = zCrates.some(
        (c) => ethyleneSensitiveCrops.includes(c.crop) || c.ethyleneSensitivity === 'HIGH'
      );
      let ppm = 0.04; // baseline clean cold room air
      if (hasProducer) ppm += 0.42 + Math.random() * 0.05;
      zoneEthyleneMap[z.id] = { ppm: Number(ppm.toFixed(2)), hasProducer, hasSensitive };
    });

    // 2. Solar & Power Microgrid Physics
    const power = { ...prevPower };
    let solarBase = this.simState.cloudCoverActive ? 150 : 450;
    if (this.simState.heatwaveActive) {
      // High ambient decreases PV silicon cell efficiency by 8%
      solarBase = Math.round(solarBase * 0.92);
    }
    power.solarPowerWatts = Math.round(Math.max(0, solarBase + (Math.random() * 14 - 7)));
    power.solarVoltageVolts = Number((48.0 + (power.solarPowerWatts > 100 ? 4.2 : -1.2)).toFixed(1));
    power.solarCurrentAmps = Number((power.solarPowerWatts / Math.max(1, power.solarVoltageVolts)).toFixed(2));
    power.pvVoltageVolts = power.solarVoltageVolts;
    power.pvCurrentAmps = power.solarCurrentAmps;

    // 3. Autonomous Thermal / Solar Energy Integration
    const refrig = { ...prevRefrig };
    let effectiveSetpoint = refrig.setpointC;
    let ecoShedding = false;
    let solarSubcooling = false;

    // Autonomous load shedding when battery is critically low
    if (power.batterySocPct < 22) {
      ecoShedding = true;
      effectiveSetpoint = Math.max(refrig.setpointC, 5.5);
    } else if (power.solarPowerWatts > 420 && power.batterySocPct > 92 && !this.simState.heatwaveActive) {
      // Solar thermal storage (subcooling produce while solar energy is abundant & free)
      solarSubcooling = true;
      effectiveSetpoint = Math.min(refrig.setpointC, 2.2);
    }
    refrig.ecoSheddingActive = ecoShedding;
    refrig.solarSubcoolingActive = solarSubcooling;

    // 4. Refrigeration Compressor Automation
    const avgChamberTemp = prevZones.reduce((acc, z) => acc + z.currentTempC, 0) / prevZones.length;
    let compRunning = refrig.compressorStatus === 'RUNNING';

    if (this.simState.compressorMode === 'FORCE_RUN') {
      compRunning = true;
    } else if (this.simState.compressorMode === 'FORCE_IDLE') {
      compRunning = false;
    } else {
      // Thermostat with 0.4°C hysteresis around effective setpoint
      if (avgChamberTemp > effectiveSetpoint + 0.4 || isDoorOpen) {
        compRunning = true;
      } else if (avgChamberTemp < effectiveSetpoint - 0.4) {
        compRunning = false;
      }
    }

    refrig.compressorStatus = compRunning ? 'RUNNING' : 'IDLE';
    // When door is open or ambient is hot, thermal lift increases compressor load
    const basePower = compRunning ? (isDoorOpen ? 340 : this.simState.heatwaveActive ? 290 : 250) : 10;
    refrig.compressorPowerWatts = Math.round(basePower + (Math.random() * 8 - 4));
    refrig.coldRoomTempC = Number(avgChamberTemp.toFixed(2));
    refrig.copEfficiency = compRunning
      ? Number((3.4 - (this.simState.heatwaveActive ? 0.4 : 0) + (Math.random() * 0.1)).toFixed(2))
      : 0;

    // Calculate total electrical load
    power.refrigerationPowerWatts = refrig.compressorPowerWatts;
    power.totalLoadWatts = Math.round(
      power.refrigerationPowerWatts + power.lightingPowerWatts + power.controllerPowerWatts + power.fanPowerWatts
    );

    const netPowerToBattery = power.solarPowerWatts - power.totalLoadWatts;
    power.batteryPowerWatts = netPowerToBattery;
    power.batteryCurrentAmps = Number((netPowerToBattery / power.batteryVoltageVolts).toFixed(2));

    // Battery SOC dynamics
    if (netPowerToBattery > 0) {
      power.batterySocPct = Math.min(100, Number((power.batterySocPct + 0.007).toFixed(2)));
    } else {
      power.batterySocPct = Math.max(5, Number((power.batterySocPct - 0.012).toFixed(2)));
    }

    // Battery runtime estimate based on 4.8kWh (100Ah @ 48V)
    const loadAmps = power.totalLoadWatts / power.dcBusVoltageVolts;
    const remainingAh = (power.batterySocPct / 100) * 100;
    power.batteryRuntimeRemainingHours = Number((remainingAh / Math.max(0.4, loadAmps)).toFixed(1));

    // 5. Zone Microclimate physics
    const updatedZones = prevZones.map((z) => {
      let temp = z.currentTempC;
      let humidity = z.currentHumidityPct;

      if (isDoorOpen) {
        // Air infiltration: Zone D and Zone A closer to the thermal entrance heat up rapidly
        const warmingFactor = z.id === 'ZONE_D' ? 0.08 : z.id === 'ZONE_A' ? 0.06 : 0.03;
        temp += warmingFactor;
        humidity = Math.max(72, humidity - 0.12);
      } else {
        if (compRunning) {
          const targetMid = (z.targetTempRange[0] + z.targetTempRange[1]) / 2;
          if (temp > targetMid) {
            temp -= 0.03;
          }
        } else {
          // Passive thermal drift toward ambient
          temp += 0.006;
        }
      }

      // Constrain within realistic bounds
      temp = Math.max(0.5, Math.min(15.0, Number(temp.toFixed(2))));
      humidity = Math.max(68, Math.min(99, Number((humidity + (Math.random() * 0.4 - 0.2)).toFixed(1))));

      // Dew point calculation (approximated Magnus-Tetens)
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
      const dewPoint = (b * alpha) / (a - alpha);

      const zoneCratesCount = activeCrates.filter((c) => c.zoneId === z.id).length;
      const isWarning = temp > z.targetTempRange[1] + 1.0 || temp < z.targetTempRange[0] - 0.6;
      const isAlert = temp > z.targetTempRange[1] + 2.4;

      return {
        ...z,
        currentTempC: temp,
        currentHumidityPct: humidity,
        ethylenePpm: zoneEthyleneMap[z.id]?.ppm || 0.05,
        dewPointC: Number(dewPoint.toFixed(1)),
        utilizedCrates: zoneCratesCount,
        status: isAlert ? ('ALERT' as const) : isWarning ? ('WARNING' as const) : ('OPTIMAL' as const),
      };
    });

    // 6. Sensor reading synchronization
    const updatedSensors = prevSensors.map((sensor) => {
      let cur = sensor.currentValue;
      if (sensor.type === 'TEMPERATURE' && sensor.zoneId) {
        const zone = updatedZones.find((z) => z.id === sensor.zoneId);
        if (zone) cur = zone.currentTempC;
      } else if (sensor.type === 'HUMIDITY' && sensor.zoneId) {
        const zone = updatedZones.find((z) => z.id === sensor.zoneId);
        if (zone) cur = zone.currentHumidityPct;
      } else if (sensor.type === 'DOOR') {
        cur = isDoorOpen ? 1 : 0;
      } else if (sensor.type === 'AMBIENT_TEMP') {
        cur = Number(ambient.toFixed(1));
      } else if (sensor.type === 'CO2') {
        cur = Math.round(cur + (isDoorOpen ? -5 : Math.random() * 6 - 2));
      }

      return {
        ...sensor,
        currentValue: cur,
        minReading: Math.min(sensor.minReading, cur),
        maxReading: Math.max(sensor.maxReading, cur),
        lastPing: 'Just now',
      };
    });

    // 7. Crate Biological Decay, Transpiration & Spoilage Recalculation
    const updatedCrates = prevCrates.map((crate) => {
      if (crate.status === 'DISPATCHED') {
        return crate;
      }

      const zone = updatedZones.find((z) => z.id === crate.zoneId);
      const zoneTemp = zone ? zone.currentTempC : crate.temperatureC;
      const zoneHumidity = zone ? zone.currentHumidityPct : crate.humidityPct;
      const zoneEthylene = zoneEthyleneMap[crate.zoneId];

      let spoilageRisk = crate.spoilageRiskPct;
      let shelfLife = crate.shelfLifeDaysRemaining;
      let degreeHours = crate.degreeHoursStress || 0;

      // Degree-hour thermal stress accumulation
      const tempDiff = Math.max(0, zoneTemp - crate.targetTempRange[1]);
      if (tempDiff > 0) {
        degreeHours += Number((tempDiff * (3 / 3600)).toFixed(3)); // 3 seconds step
        // Q10 biological decay: elevated temp accelerates spoilage
        spoilageRisk = Math.min(99.9, spoilageRisk + tempDiff * 0.05);
        shelfLife = Math.max(0.1, shelfLife - 0.004);
      }

      // Ethylene cross-contamination stress
      const hasEthyleneClash =
        zoneEthylene?.hasProducer &&
        (ethyleneSensitiveCrops.includes(crate.crop) || crate.ethyleneSensitivity === 'HIGH');

      if (hasEthyleneClash) {
        spoilageRisk = Math.min(99.9, spoilageRisk + 0.03); // Extra degradation due to ethylene
        shelfLife = Math.max(0.1, shelfLife - 0.003);
      }

      // Transpiration moisture shrinkage: weight loss due to vapor pressure deficit
      const humidityDeficit = Math.max(0, 95 - zoneHumidity);
      const moistureLossPct = Number(
        Math.min(12, ((humidityDeficit / 100) * crate.storedDays * 0.4) + (crate.storedDays * 0.15)).toFixed(1)
      );
      const currentWeight = Number((crate.initialWeightKg * (1 - moistureLossPct / 100)).toFixed(1));

      // Risk level classification
      let riskLevel: Crate['riskLevel'] = 'LOW';
      if (spoilageRisk > 75) riskLevel = 'CRITICAL';
      else if (spoilageRisk > 50) riskLevel = 'HIGH';
      else if (spoilageRisk > 25) riskLevel = 'MEDIUM';

      // Status classification
      let status = crate.status;
      if (spoilageRisk > 70 || shelfLife < 2) {
        status = 'EXPIRING_SOON';
      } else if (riskLevel === 'HIGH') {
        status = 'DISPATCH_READY';
      } else if (riskLevel === 'MEDIUM') {
        status = 'MONITORING';
      } else {
        status = 'OPTIMAL';
      }

      const riskFactors = [...crate.riskFactors];
      if (hasEthyleneClash && !riskFactors.some((r) => r.includes('Ethylene'))) {
        riskFactors.push('Ethylene co-storage clash detected in zone');
      }

      return {
        ...crate,
        temperatureC: Number(zoneTemp.toFixed(1)),
        humidityPct: Math.round(zoneHumidity),
        spoilageRiskPct: Number(spoilageRisk.toFixed(1)),
        shelfLifeDaysRemaining: Number(shelfLife.toFixed(1)),
        degreeHoursStress: Number(degreeHours.toFixed(2)),
        moistureLossPct,
        weightKg: currentWeight,
        riskLevel,
        status,
        riskFactors,
      };
    });

    // 8. Dynamic Alert Engine
    const updatedAlerts = [...prevAlerts];

    // Door open alert
    if (this.simState.doorOpenSeconds > 45) {
      const existingDoorAlert = updatedAlerts.find((a) => a.category === 'DOOR' && !a.resolved);
      if (!existingDoorAlert) {
        updatedAlerts.unshift({
          id: `ALT-DOOR-${Date.now()}`,
          timestamp: 'Just now',
          title: 'Cold Room Door Open Prolonged',
          severity: 'CRITICAL',
          category: 'DOOR',
          location: 'Main Thermal Entrance',
          sensorId: 'SENS-DOOR-01',
          currentReading: `Ajar for ${this.simState.doorOpenSeconds}s`,
          threshold: '45s max threshold',
          durationMinutes: Math.round(this.simState.doorOpenSeconds / 60),
          aiDiagnosis:
            'Chamber door remains unsealed. Thermal ingress entering Zone A and Zone D at +0.12°C/min, forcing compressor to max wattage.',
          recommendedAction: 'Close and seal cold room door immediately to preserve thermal envelope.',
          resolved: false,
          acknowledged: false,
        });
      }
    }

    // Battery low reserve alert
    if (power.batterySocPct < 22) {
      const existingBattAlert = updatedAlerts.find((a) => a.category === 'BATTERY' && !a.resolved);
      if (!existingBattAlert) {
        updatedAlerts.unshift({
          id: `ALT-BATT-${Date.now()}`,
          timestamp: 'Just now',
          title: 'LiFePO4 Battery Reserve Low',
          severity: 'HIGH',
          category: 'BATTERY',
          location: 'Solar Hybrid Inverter Room',
          sensorId: 'SENS-BATT-SOC',
          currentReading: `${Math.round(power.batterySocPct)}% SOC`,
          threshold: '25% minimum buffer',
          durationMinutes: 5,
          aiDiagnosis:
            'Battery reserve fallen below safety threshold during low solar/night hours. Autonomous Eco-Shedding engaged (thermostat setpoint elevated to 5.5°C).',
          recommendedAction:
            'Maintain Eco Setpoint to guarantee essential circulation fans until next solar generation window.',
          resolved: false,
          acknowledged: false,
        });
      }
    }

    // Ethylene clash alert
    Object.entries(zoneEthyleneMap).forEach(([zoneId, data]) => {
      if (data.hasProducer && data.hasSensitive) {
        const existingEthyleneAlert = updatedAlerts.find(
          (a) => a.category === 'ETHYLENE' && a.location.includes(zoneId) && !a.resolved
        );
        if (!existingEthyleneAlert) {
          updatedAlerts.unshift({
            id: `ALT-ETH-${zoneId}-${Date.now()}`,
            timestamp: 'Just now',
            title: `Ethylene Cross-Contamination in ${zoneId}`,
            severity: 'HIGH',
            category: 'ETHYLENE',
            location: zoneId,
            currentReading: `${data.ppm} ppm Ethylene`,
            threshold: '0.10 ppm limit',
            durationMinutes: 10,
            aiDiagnosis:
              'Climacteric high-ethylene crops (Tomatoes/Apples) co-stored with sensitive leafy vegetables. Respiration and leaf senescence accelerated.',
            recommendedAction:
              'Transfer ethylene-sensitive crates to Zone A immediately to avoid accelerated yellowing and decay.',
            resolved: false,
            acknowledged: false,
          });
        }
      }
    });

    // 9. Telemetry MQTT Packet Generation
    const newPacket: TelemetryPacket = {
      id: `PKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString(),
      gatewayId: 'GW-ESP32-SOLAR-01',
      topic: 'telemetry/coldstorage/unit01/sensors',
      payload: {
        unit: 'NER-01',
        temp_a: updatedZones[0].currentTempC,
        temp_b: updatedZones[1].currentTempC,
        temp_c: updatedZones[2].currentTempC,
        temp_d: updatedZones[3].currentTempC,
        rh_avg: Math.round(updatedZones.reduce((a, b) => a + b.currentHumidityPct, 0) / updatedZones.length),
        pv_w: power.solarPowerWatts,
        batt_soc: Math.round(power.batterySocPct),
        comp_state: refrig.compressorStatus,
        door_sw: isDoorOpen ? 1 : 0,
        eco_mode: ecoShedding ? 1 : 0,
      },
      rssi: -58 + Math.floor(Math.random() * 6 - 3),
      batteryLevelPct: 98,
    };

    return {
      zones: updatedZones,
      crates: updatedCrates,
      sensors: updatedSensors,
      power,
      refrigeration: refrig,
      alerts: updatedAlerts,
      newPacket,
    };
  }
}

export const iotSimulator = new IoTSimulationEngine();

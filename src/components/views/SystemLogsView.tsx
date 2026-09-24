import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Pause,
  Wifi,
  Copy,
  Check,
  Download,
  Filter,
} from 'lucide-react';
import { useColdStorage } from '../../context/ColdStorageContext';

export const SystemLogsView: React.FC = () => {
  const {
    telemetryPackets,
    isSimulationPaused,
    setIsSimulationPaused,
  } = useColdStorage();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (json: object, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="view-system-logs" className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Terminal className="h-6 w-6 text-emerald-400" />
            <span>IoT Gateway Telemetry & MQTT Log Stream</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Raw payload inspection from ESP32 nodes, Modbus RTU bus, and cloud message broker.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSimulationPaused(!isSimulationPaused)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              isSimulationPaused
                ? 'border-emerald-600 bg-emerald-950 text-emerald-300'
                : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-750'
            }`}
          >
            {isSimulationPaused ? (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                <span>Resume Stream</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>Pause Stream</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stream Terminal Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-300">
              BROKER: tcp://mqtt.coldchain.internal:1883 • QoS: 1
            </span>
          </div>
          <span className="text-[11px]">{telemetryPackets.length} Packets Buffered</span>
        </div>

        <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {telemetryPackets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 italic">
              Awaiting telemetry heartbeat from gateway node...
            </div>
          ) : (
            telemetryPackets.map((pkt) => (
              <div
                key={pkt.id}
                className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 text-slate-300 transition-colors hover:bg-slate-900"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{pkt.timestamp}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-cyan-400 font-semibold">{pkt.topic}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px]">
                      <Wifi className="h-3 w-3 text-cyan-400" />
                      <span>{pkt.rssi} dBm</span>
                    </span>
                    <button
                      onClick={() => handleCopy(pkt.payload, pkt.id)}
                      className="flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 hover:text-white"
                      title="Copy JSON Payload"
                    >
                      {copiedId === pkt.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <pre className="text-[11px] text-emerald-300/90 whitespace-pre-wrap bg-slate-950/80 p-2 rounded border border-slate-800/40">
                  {JSON.stringify(pkt.payload, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

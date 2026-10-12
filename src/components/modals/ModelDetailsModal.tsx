import React from 'react';
import { ModelEngine } from '../../types/dashboard';
import { X, Cpu, Zap, HardDrive, CheckCircle2, Shield, Activity } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ModelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  engines: ModelEngine[];
  selectedEngineId: string;
  onSelectEngine: (id: string) => void;
}

export const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({
  isOpen,
  onClose,
  engines,
  selectedEngineId,
  onSelectEngine,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                Open-Weight Neural Engine Telemetry
                <Badge variant="cyan" size="sm">Active Inference</Badge>
              </h3>
              <p className="text-xs text-zinc-400">
                Local model instances serving real-time AST parsing and PR code diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {engines.map((engine) => {
              const isSelected = engine.id === selectedEngineId;
              return (
                <div
                  key={engine.id}
                  onClick={() => onSelectEngine(engine.id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                    isSelected
                      ? 'bg-zinc-900/90 border-cyan-500/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          engine.status === 'online'
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                            : 'bg-amber-400'
                        }`}
                      />
                      <h4 className="text-sm font-semibold text-zinc-100">{engine.name}</h4>
                      <Badge variant="zinc" size="sm" className="font-mono">
                        {engine.parameters}
                      </Badge>
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Selected Engine
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-zinc-500 hover:text-zinc-300">
                        Click to activate
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{engine.description}</p>

                  {/* Telemetry Metrics Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800/60 text-[11px] font-mono">
                    <div className="flex flex-col">
                      <span className="text-zinc-500">Host / Runtime</span>
                      <span className="text-zinc-300 font-medium truncate">{engine.provider}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" /> Latency / Speed
                      </span>
                      <span className="text-zinc-200 font-medium">{engine.tokensPerSec} tok/s</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-cyan-400" /> VRAM Allocation
                      </span>
                      <span className="text-zinc-300 font-medium">{engine.memoryUsage}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-purple-400" /> Quantization
                      </span>
                      <span className="text-purple-300 font-medium">{engine.quantization}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy & Zero-Data Egress Notice */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Zero data egress guarantee: All model inference runs strictly inside self-hosted local
              vLLM / TensorRT-LLM container instances without external network transmission.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};

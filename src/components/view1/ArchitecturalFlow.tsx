import React, { useState } from 'react';
import type { ArchitectureNode } from '../../types/dashboard';
import {
  Activity,
  ArrowRight,
  Clock,
  AlertTriangle,
  Play,
  Terminal,
} from 'lucide-react';

interface ArchitecturalFlowProps {
  nodes: ArchitectureNode[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const ArchitecturalFlow: React.FC<ArchitecturalFlowProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
}) => {
  const [highlightBottlenecks, setHighlightBottlenecks] = useState(false);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[3];
  const totalLatency = nodes.reduce((acc, curr) => acc + curr.latencyMs, 0);

  const handleSimulateLoad = () => {
    setIsSimulatingLoad(true);
    setTimeout(() => {
      setIsSimulatingLoad(false);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 text-zinc-900 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-950" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
            SYSTEM DATA FLOW & PIPELINE ARCHITECTURE
          </h3>
          <span className="bg-zinc-100 text-zinc-800 font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border border-zinc-200">
            E2E Pipeline: {totalLatency.toFixed(1)}ms
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setHighlightBottlenecks(!highlightBottlenecks)}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-medium ${
              highlightBottlenecks
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200 hover:text-black'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Bottlenecks</span>
          </button>

          <button
            onClick={handleSimulateLoad}
            disabled={isSimulatingLoad}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-medium ${
              isSimulatingLoad
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-black text-white border-black hover:bg-zinc-800'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulatingLoad ? 'animate-spin' : ''}`} />
            <span>{isSimulatingLoad ? 'Simulating 2.4k QPS...' : 'Simulate Load'}</span>
          </button>
        </div>
      </div>

      {/* Pipeline Steps Flow */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-[700px] py-1">
          {nodes.map((node, index) => {
            const isSelected = node.id === selectedNodeId;
            const isHotspot = highlightBottlenecks && (node.status === 'warning' || node.status === 'optimizing');

            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => onSelectNode(node.id)}
                  className={`flex-1 min-w-[130px] rounded-xl border p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-md'
                      : node.status === 'warning'
                      ? 'bg-amber-50 text-zinc-900 border-amber-300 hover:bg-amber-100'
                      : 'bg-zinc-50 text-zinc-900 border-zinc-200 hover:bg-zinc-100'
                  } ${isHotspot ? 'ring-2 ring-amber-500 animate-pulse' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      0{index + 1}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.status === 'healthy'
                          ? 'bg-emerald-500'
                          : node.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-sky-500'
                      }`}
                    />
                  </div>

                  <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-zinc-950'}`}>
                    {node.name}
                  </h4>
                  <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {node.role}
                  </p>

                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                    isSelected ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 text-zinc-600'
                  }`}>
                    <span>{node.latencyMs}ms</span>
                    <span className="font-semibold">{node.throughput.split(' ')[0]}</span>
                  </div>
                </div>

                {index < nodes.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Latency Waterfall Distribution */}
      <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-600 mb-2">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-900">
            <Clock className="w-3.5 h-3.5" /> Latency Waterfall Distribution
          </span>
          <span className="text-zinc-800">
            Critical Path: <strong className="text-black">FlashAttention Kernel (18.6ms / 77.2%)</strong>
          </span>
        </div>

        <div className="flex h-3 w-full rounded-md overflow-hidden bg-zinc-200">
          {nodes.map((node, i) => {
            const widthPct = (node.latencyMs / totalLatency) * 100;
            const colors = ['bg-zinc-400', 'bg-zinc-500', 'bg-zinc-700', 'bg-amber-500', 'bg-black', 'bg-zinc-800'];
            return (
              <div
                key={node.id}
                style={{ width: `${widthPct}%` }}
                title={`${node.name}: ${node.latencyMs}ms`}
                onClick={() => onSelectNode(node.id)}
                className={`${colors[i % colors.length]} hover:opacity-80 transition-opacity cursor-pointer`}
              />
            );
          })}
        </div>
      </div>

      {/* Embedded Nested Black Box: Component Inspector */}
      {activeNode && (
        <div className="bg-black text-white rounded-xl p-4 font-mono text-xs border border-zinc-900 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00FF88]" />
              <span className="font-bold text-white uppercase tracking-wider">
                INSPECTOR: {activeNode.name}
              </span>
            </div>
            <span className="bg-zinc-800 text-[#00FF88] px-2 py-0.5 rounded text-[10px] font-bold">
              STATUS: {activeNode.status.toUpperCase()}
            </span>
          </div>

          <p className="text-zinc-300 text-xs leading-relaxed font-sans font-normal">
            {activeNode.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-zinc-800/80 text-[11px]">
            <div className="bg-zinc-900/80 p-2 rounded-lg">
              <span className="text-zinc-500 block text-[10px]">Latency</span>
              <span className="text-[#00FF88] font-bold">{activeNode.latencyMs} ms / iter</span>
            </div>
            <div className="bg-zinc-900/80 p-2 rounded-lg">
              <span className="text-zinc-500 block text-[10px]">Memory Footprint</span>
              <span className="text-white font-bold">{(activeNode.memoryMb / 1024).toFixed(1)} GB VRAM</span>
            </div>
            <div className="bg-zinc-900/80 p-2 rounded-lg">
              <span className="text-zinc-500 block text-[10px]">Throughput</span>
              <span className="text-white font-bold">{activeNode.throughput}</span>
            </div>
            <div className="bg-zinc-900/80 p-2 rounded-lg">
              <span className="text-zinc-500 block text-[10px]">Stack</span>
              <span className="text-zinc-300 font-semibold">{activeNode.techStack.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

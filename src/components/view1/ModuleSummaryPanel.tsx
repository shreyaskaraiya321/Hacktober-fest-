import React from 'react';
import type { ArchitecturalInsight, FileTreeNode } from '../../types/dashboard';
import {
  FileCode,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface ModuleSummaryPanelProps {
  selectedFile: FileTreeNode | null;
  insights: ArchitecturalInsight[];
  onNavigateToDevOps: () => void;
}

export const ModuleSummaryPanel: React.FC<ModuleSummaryPanelProps> = ({
  selectedFile,
  insights,
  onNavigateToDevOps,
}) => {
  return (
    <div className="space-y-4">
      {/* Module Overview & Cognitive Complexity */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 text-zinc-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-zinc-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
              MODULE COGNITIVE COMPLEXITY & RADAR
            </h3>
          </div>
          <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
            {selectedFile?.path || 'src/cache/paged_allocator.rs'}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Modularity Score</span>
            <span className="text-lg font-bold font-mono text-zinc-950">92 / 100</span>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5">High Decoupling</span>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Concurrency Safety</span>
            <span className="text-lg font-bold font-mono text-red-600">68 / 100</span>
            <span className="text-[10px] text-red-600 font-medium mt-0.5">Contention Detected</span>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Test Coverage</span>
            <span className="text-lg font-bold font-mono text-zinc-950">84.6%</span>
            <span className="text-[10px] text-zinc-600 mt-0.5">18 unit, 4 stress</span>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Cyclomatic Index</span>
            <span className="text-lg font-bold font-mono text-zinc-950">14 (Low)</span>
            <span className="text-[10px] text-zinc-600 mt-0.5">Linear AST Paths</span>
          </div>
        </div>
      </div>

      {/* AI Architectural Insights */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3.5 text-zinc-900 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
              OPEN-WEIGHT AI ARCHITECTURAL INSIGHTS
            </h3>
            <span className="bg-zinc-100 text-zinc-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-zinc-200">
              Llama 3.3 70B
            </span>
          </div>

          <button
            onClick={onNavigateToDevOps}
            className="text-xs font-mono font-bold text-zinc-900 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>Triage in PR Diagnostics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl p-4 transition-all space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      insight.severity === 'critical'
                        ? 'bg-red-600 text-white'
                        : insight.severity === 'warning'
                        ? 'bg-amber-500 text-white'
                        : 'bg-zinc-900 text-white'
                    }`}
                  >
                    {insight.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-zinc-950 font-sans">
                    {insight.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {insight.modelConfidence}% Confidence
                </span>
              </div>

              <div className="text-xs font-mono text-zinc-600">
                Target: <span className="text-zinc-900 font-semibold">{insight.module}</span>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed font-sans font-medium">
                {insight.description}
              </p>

              <div className="bg-white border border-zinc-200 rounded-lg p-2.5 space-y-1 text-xs">
                <div className="text-red-700 font-mono text-[11px]">
                  <strong>Impact:</strong> {insight.impact}
                </div>
                <div className="text-emerald-800 font-mono text-[11px]">
                  <strong>Remediation:</strong> {insight.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

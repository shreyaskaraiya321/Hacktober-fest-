import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, GitPullRequest, ArrowRight, X } from 'lucide-react';
import { Badge } from '../common/Badge';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  activeModelName: string;
}

interface Stage {
  name: string;
  detail: string;
  durationMs: number;
}

const diagnosticStages: Stage[] = [
  {
    name: 'AST Parsing & Symbol Resolution',
    detail: 'Extracted 14 AST function scopes across modified Rust and C++ translation units.',
    durationMs: 700,
  },
  {
    name: 'Lock Ordering Invariant Verification',
    detail: 'Detected ABBA inversion between `free_pool` and `lru_tracker` Mutex guards.',
    durationMs: 900,
  },
  {
    name: 'Memory Footprint & VRAM Simulation',
    detail: 'Simulated 500 concurrent token generation streams with 16-token page blocks.',
    durationMs: 800,
  },
  {
    name: 'Synthesizing Optimal Remediation Patch',
    detail: 'Generated zero-lock contention patch reducing hold time from 320μs to <12μs.',
    durationMs: 600,
  },
];

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  activeModelName,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0);
      setCompleted(false);
      return;
    }

    let accumulatedTime = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    diagnosticStages.forEach((stage, idx) => {
      accumulatedTime += stage.durationMs;
      const timeout = setTimeout(() => {
        if (idx === diagnosticStages.length - 1) {
          setCompleted(true);
        } else {
          setCurrentStageIndex(idx + 1);
        }
      }, accumulatedTime);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                Running Neural Diagnostics
                <Badge variant="cyan" size="sm">
                  {activeModelName}
                </Badge>
              </h3>
              <p className="text-xs text-zinc-400">Analyzing PR #1482 branch diffs and call graph</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stages Progress */}
        <div className="p-5 space-y-4">
          <div className="space-y-3">
            {diagnosticStages.map((stage, idx) => {
              const isDone = completed || idx < currentStageIndex;
              const isCurrent = !completed && idx === currentStageIndex;
              const isPending = !completed && idx > currentStageIndex;

              return (
                <div
                  key={stage.name}
                  className={`p-3 rounded-lg border text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-zinc-900 border-cyan-500/50 shadow-sm'
                      : isDone
                      ? 'bg-zinc-900/30 border-zinc-800/80 text-zinc-400'
                      : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-mono font-medium flex items-center gap-2 ${
                        isCurrent ? 'text-cyan-300 font-semibold' : isDone ? 'text-zinc-200' : 'text-zinc-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-600">
                          {idx + 1}
                        </span>
                      )}
                      {stage.name}
                    </span>
                    {isDone && <span className="text-[10px] font-mono text-emerald-400">Verified</span>}
                    {isCurrent && <span className="text-[10px] font-mono text-cyan-400 animate-pulse">Processing...</span>}
                  </div>
                  {(isDone || isCurrent) && (
                    <p className="text-[11px] text-zinc-400 font-mono pl-6 leading-relaxed">
                      {stage.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {completed && (
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Diagnostics Complete: 1 Deadlock hazard identified, 1 Patch ready.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
            <GitPullRequest className="w-3.5 h-3.5 text-zinc-400" />
            Target: PR #1482
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition-colors"
            >
              Dismiss
            </button>
            <button
              disabled={!completed}
              onClick={() => {
                onComplete();
                onClose();
              }}
              className={`px-4 py-1.5 text-xs font-mono font-medium rounded flex items-center gap-1.5 transition-all ${
                completed
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold shadow-md shadow-cyan-950'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <span>View PR Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

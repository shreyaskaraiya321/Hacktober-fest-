import React, { useState } from 'react';
import type { AIDiagnosticReport } from '../../types/dashboard';
import {
  Check,
  Copy,
  Zap,
  RotateCcw,
  ShieldCheck,
  Clock,
  Cpu,
  AlertTriangle,
} from 'lucide-react';

interface AIDiagnosticCardProps {
  report: AIDiagnosticReport;
  isFixApplied: boolean;
  onApplyFix: () => void;
  onResetFix: () => void;
  activeModelName: string;
}

export const AIDiagnosticCard: React.FC<AIDiagnosticCardProps> = ({
  report,
  isFixApplied,
  onApplyFix,
  onResetFix,
  activeModelName,
}) => {
  const [copiedPatch, setCopiedPatch] = useState(false);

  const activePatch = report.suggestedPatches[0];

  const handleCopy = () => {
    if (activePatch) {
      navigator.clipboard.writeText(activePatch.patchCode);
      setCopiedPatch(true);
      setTimeout(() => setCopiedPatch(false), 2000);
    }
  };

  const riskScore = isFixApplied ? 12 : report.riskMetrics.score;
  const riskLabel = isFixApplied ? 'LOW RISK' : 'CRITICAL RISK';

  return (
    <div className="h-full flex flex-col gap-3.5 overflow-y-auto pr-1">
      {/* Metrics Banner */}
      <div className="bg-zinc-100 rounded-2xl p-3.5 border border-zinc-200 flex items-center justify-between text-zinc-900 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
              isFixApplied ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {riskScore}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-950 uppercase">
                {riskLabel}
              </span>
              <span className="bg-zinc-200 text-zinc-700 font-mono text-[10px] px-2 py-0.5 rounded-full">
                Llama 3.3 AST Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 font-sans mt-0.5">
              {isFixApplied
                ? 'Deadlock resolved • Concurrency hazard cleared'
                : 'Cyclic lock acquisition hazard detected between free pool and LRU'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end font-mono text-xs text-zinc-600 shrink-0">
          <span className="flex items-center gap-1 font-semibold text-zinc-900 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-zinc-700" />
            {isFixApplied ? '-90 min debt' : '-45 min payoff'}
          </span>
          <span className="text-[10px] text-zinc-500">Auto AST Verification</span>
        </div>
      </div>

      {/* Card 1: ROOT CAUSE ANALYSIS (3 VECTORS) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-2.5 shadow-xs shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold text-zinc-950 uppercase tracking-wider">
            ROOT CAUSE ANALYSIS (3 VECTORS)
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">Formally Verified</span>
        </div>

        <div className="space-y-2">
          {report.rootCauseAnalysis.map((cause, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80"
            >
              {/* Black pill badge for number */}
              <span className="bg-black text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0">
                0{idx + 1}
              </span>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-sans font-medium">
                {cause}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: AI REMEDIATED PATCH */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-xs flex-1 flex flex-col justify-between">
        <div>
          {/* Header with AI REMEDIATED PATCH + Status Pill */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-bold text-zinc-950 uppercase tracking-wider">
                AI REMEDIATED PATCH
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                ({activePatch?.filePath})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Pill: Pending Review or Verified */}
              <span
                className={`font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  isFixApplied
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isFixApplied ? '✓ Verified' : 'Pending Review'}
              </span>

              {/* Copy snippet button */}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition-colors"
                title="Copy Patch Code"
              >
                {copiedPatch ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* High-contrast pure black container (bg-[#0a0a0a]) with syntax-highlighted code */}
          <div className="bg-[#0a0a0a] rounded-xl p-3 font-mono text-xs overflow-x-auto max-h-48 overflow-y-auto border border-zinc-900 shadow-inner">
            <div className="text-zinc-500 text-[10px] mb-1.5 select-none border-b border-zinc-800/80 pb-1 flex justify-between">
              <span>// Zero-Contention Remediation (Rust FFI Safe)</span>
              <span className="text-emerald-400">Lock Ordering: LRU → Pool</span>
            </div>
            <pre className="text-zinc-200 leading-relaxed font-mono whitespace-pre text-[11px]">
              <span className="text-sky-400">pub fn</span> <span className="text-yellow-300">allocate_block</span>(&self, seq_id: <span className="text-sky-400">u64</span>) -&gt; <span className="text-sky-400">Result</span>&lt;BlockId, AllocError&gt; &#123;{'\n'}
              {'    '}<span className="text-zinc-500">// 1. Fast-path allocation attempt</span>{'\n'}
              {'    '}&#123;{'\n'}
              {'        '}<span className="text-sky-400">let mut</span> pool = self.free_pool.<span className="text-yellow-300">lock</span>().<span className="text-yellow-300">unwrap</span>();{'\n'}
              {'        '}<span className="text-purple-400">if let</span> <span className="text-sky-400">Some</span>(block_id) = pool.<span className="text-yellow-300">pop</span>() &#123;{'\n'}
              {'            '}self.active_allocations.<span className="text-yellow-300">insert</span>(block_id, seq_id);{'\n'}
              {'            '}<span className="text-purple-400">return</span> <span className="text-sky-400">Ok</span>(block_id);{'\n'}
              {'        '}&#125;{'\n'}
              {'    '}&#125; <span className="text-emerald-400">// Drop free_pool lock immediately</span>{'\n'}
              {'\n'}
              {'    '}<span className="text-zinc-500">// 2. Slow-path: Reclaim pages with correct lock hierarchy (LRU -&gt; Pool)</span>{'\n'}
              {'    '}<span className="text-sky-400">let</span> reclaimed_blocks = self.<span className="text-yellow-300">reclaim_idle_pages_unlocked</span>(16);{'\n'}
              {'    '}<span className="text-purple-400">if</span> reclaimed_blocks.<span className="text-yellow-300">is_empty</span>() &#123;{'\n'}
              {'        '}<span className="text-purple-400">return</span> <span className="text-sky-400">Err</span>(AllocError::OutOfMemory);{'\n'}
              {'    '}&#125;{'\n'}
              {'\n'}
              {'    '}<span className="text-sky-400">let mut</span> pool = self.free_pool.<span className="text-yellow-300">lock</span>().<span className="text-yellow-300">unwrap</span>();{'\n'}
              {'    '}<span className="text-sky-400">let</span> block_id = reclaimed_blocks[0];{'\n'}
              {'    '}pool.<span className="text-yellow-300">extend</span>(&amp;reclaimed_blocks[1..]);{'\n'}
              {'    '}self.active_allocations.<span className="text-yellow-300">insert</span>(block_id, seq_id);{'\n'}
              {'    '}<span className="text-sky-400">Ok</span>(block_id){'\n'}
              &#125;
            </pre>
          </div>
        </div>

        {/* Bottom Action: Full-width solid black button with white bold text */}
        <div className="pt-2">
          {!isFixApplied ? (
            <button
              onClick={onApplyFix}
              className="w-full bg-black hover:bg-zinc-800 text-white font-bold font-mono text-xs rounded-xl py-3 transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ APPLY PATCH TO BRANCH</span>
            </button>
          ) : (
            <button
              onClick={onResetFix}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs rounded-xl py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Diff to Original Unpatched State</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

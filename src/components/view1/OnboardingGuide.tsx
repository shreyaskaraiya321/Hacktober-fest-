import React, { useState } from 'react';
import type { OnboardingStep, CodeConvention } from '../../types/dashboard';
import {
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Compass,
  Sparkles,
} from 'lucide-react';

interface OnboardingGuideProps {
  initialSteps: OnboardingStep[];
  conventions: CodeConvention[];
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({
  initialSteps,
  conventions,
}) => {
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'checklist' | 'conventions'>('checklist');
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const quickPrompts = [
    'Explain lifecycle of an inference request',
    'Where is GPU block allocation handled?',
    'What are the lock hierarchy constraints?',
  ];

  const handleRunCopilotPrompt = (prompt: string) => {
    setCopilotResponse('Reasoning with Llama 3.3 70B...');
    setTimeout(() => {
      if (prompt.includes('lifecycle')) {
        setCopilotResponse(
          'An inference request enters via Axum HTTP Ingress, is decoded into subword tokens by the BPE tokenizer, scheduled into iteration batches by the Continuous Scheduler, references physical 16-token memory chunks in the Paged KV-Cache, and computes FlashAttention tensors on Hopper streaming multiprocessors.'
        );
      } else if (prompt.includes('allocation')) {
        setCopilotResponse(
          '`src/cache/paged_allocator.rs` manages non-contiguous physical blocks via free pools. CUDA Unified Memory handles host-device mappings while RAII PagedBlockGuard guarantees leak-free drops.'
        );
      } else {
        setCopilotResponse(
          'Per LOCK_ORDERING.md: Always acquire LRUTracker Mutex BEFORE FreePool Mutex. Reversing this order triggers high-concurrency deadlocks between worker threads.'
        );
      }
    }, 500);
  };

  return (
    <div className="h-full flex flex-col text-zinc-900">
      {/* Header */}
      <div className="pb-3 border-b border-zinc-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-zinc-800" />
            CONTRIBUTOR RAMP-UP
          </span>
          <span className="bg-zinc-100 text-zinc-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-zinc-200">
            {completedCount}/{steps.length} STEPS
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-200 rounded-full h-1.5 mb-2 overflow-hidden">
          <div
            className="bg-black h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-1 rounded-lg text-center font-medium transition-colors ${
              activeTab === 'checklist'
                ? 'bg-white text-black shadow-xs font-bold'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            Setup Checklist
          </button>
          <button
            onClick={() => setActiveTab('conventions')}
            className={`py-1 rounded-lg text-center font-medium transition-colors ${
              activeTab === 'conventions'
                ? 'bg-white text-black shadow-xs font-bold'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            Conventions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {activeTab === 'checklist' ? (
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  step.completed
                    ? 'bg-zinc-50 border-zinc-200 opacity-75'
                    : 'bg-white border-zinc-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 text-zinc-400 hover:text-black transition-colors"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-black" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4
                        className={`text-xs font-bold ${
                          step.completed
                            ? 'line-through text-zinc-400'
                            : 'text-zinc-950'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {step.timeEstimate}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-600 leading-relaxed mb-2 font-medium">
                      {step.description}
                    </p>

                    {/* Embedded Nested Black Box with #00FF88 text */}
                    {step.command && (
                      <div className="bg-black text-[#00FF88] rounded-xl p-3 font-mono text-xs flex items-center justify-between shadow-xs border border-zinc-900">
                        <span className="truncate mr-2">$ {step.command}</span>
                        <button
                          onClick={() => handleCopy(step.command!, step.id)}
                          className="text-zinc-400 hover:text-white transition-colors shrink-0"
                          title="Copy command"
                        >
                          {copiedId === step.id ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {conventions.map((conv, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-950 font-mono text-[11px]">
                    {conv.rule}
                  </h4>
                  <span className="bg-zinc-200 text-zinc-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {conv.category.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-relaxed font-medium">
                  {conv.description}
                </p>

                {/* Good vs Bad */}
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-emerald-900">
                    <span className="text-emerald-700 font-bold block mb-0.5">✓ RECOMMENDED</span>
                    <pre className="overflow-x-auto whitespace-pre-wrap">{conv.exampleGood}</pre>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-900">
                    <span className="text-red-700 font-bold block mb-0.5">✗ AVOID</span>
                    <pre className="overflow-x-auto whitespace-pre-wrap">{conv.exampleBad}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Architect Copilot Query Box */}
        <div className="pt-3 border-t border-zinc-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950 font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
            <span>ARCHITECT COPILOT</span>
          </div>

          <div className="space-y-1.5 mb-2">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleRunCopilotPrompt(p)}
                className="w-full text-left text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors truncate font-medium"
              >
                › {p}
              </button>
            ))}
          </div>

          {copilotResponse && (
            <div className="p-3 rounded-xl bg-black text-white font-mono text-xs leading-relaxed border border-zinc-900">
              <span className="text-[#00FF88] font-bold block mb-1">
                Llama 3.3 Copilot:
              </span>
              <p className="text-zinc-300">{copilotResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

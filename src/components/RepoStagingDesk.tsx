import React, { useState } from 'react';
import type { RepoOverview, ModifiedFile } from '../types';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileCode,
  Loader2,
  X,
  Sparkles,
  ArrowDown,
  Zap,
} from 'lucide-react';

interface RepoStagingDeskProps {
  overview: RepoOverview;
  selectedFilePath?: string | null;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info';
  text: string;
}

export const RepoStagingDesk: React.FC<RepoStagingDeskProps> = ({
  overview,
  selectedFilePath,
}) => {
  // Accordion state: Set of expanded filenames, default first file open
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (overview.modifiedFiles.length > 0) {
      initial.add(overview.modifiedFiles[0].filename);
    }
    return initial;
  });

  // Commit message input state
  const [commitMessage, setCommitMessage] = useState(
    'fix: handle connection timeout'
  );

  // Async action loading states
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isPushed, setIsPushed] = useState(false);

  // Toast notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Expand file when selectedFilePath changes
  React.useEffect(() => {
    if (selectedFilePath) {
      setExpandedFiles((prev) => {
        const next = new Set(prev);
        next.add(selectedFilePath);
        return next;
      });
    }
  }, [selectedFilePath]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      text,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFile = (filename: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      return next;
    });
  };

  // 4. Git Actions
  const handlePush = () => {
    if (isPushing || isPulling) return;
    setIsPushing(true);

    setTimeout(() => {
      setIsPushing(false);
      setIsPushed(true);
      showToast('Pushed to origin/main successfully!', 'success');
    }, 1200);
  };

  const handlePull = () => {
    if (isPushing || isPulling) return;
    setIsPulling(true);

    setTimeout(() => {
      setIsPulling(false);
      showToast('Already up to date with origin/main', 'info');
    }, 1000);
  };

  // Helper to render diff lines with soft green and soft red backgrounds
  const renderDiffLines = (preview: string) => {
    const lines = preview.split('\n');

    return (
      <div className="rounded-xl overflow-hidden border border-zinc-200/90 text-xs font-mono leading-relaxed bg-white">
        {lines.map((line, idx) => {
          if (line.startsWith('+')) {
            // Addition: soft green background
            return (
              <div
                key={idx}
                className="bg-emerald-50 text-emerald-900 px-3 py-1 border-l-3 border-emerald-500 font-mono text-[11px] flex items-center gap-2 select-text"
              >
                <span className="text-emerald-600 font-bold select-none">+</span>
                <span className="overflow-x-auto whitespace-pre">{line.slice(1)}</span>
              </div>
            );
          } else if (line.startsWith('-')) {
            // Deletion: soft red background
            return (
              <div
                key={idx}
                className="bg-rose-50 text-rose-900 px-3 py-1 border-l-3 border-rose-500 font-mono text-[11px] flex items-center gap-2 select-text"
              >
                <span className="text-rose-600 font-bold select-none">-</span>
                <span className="overflow-x-auto whitespace-pre">{line.slice(1)}</span>
              </div>
            );
          } else if (line.startsWith('@@')) {
            // Hunk header: soft neutral
            return (
              <div
                key={idx}
                className="bg-zinc-100/90 text-zinc-500 px-3 py-1 font-mono text-[10px] font-semibold border-b border-t border-zinc-200/80 select-none"
              >
                {line}
              </div>
            );
          } else {
            // Unchanged line
            return (
              <div
                key={idx}
                className="bg-white text-zinc-700 px-3 py-1 font-mono text-[11px] flex items-center gap-2 select-text"
              >
                <span className="text-zinc-300 select-none">&nbsp;</span>
                <span className="overflow-x-auto whitespace-pre">{line}</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="rounded-3xl bg-[#F4F4F0] p-6 text-[#0f172a] shadow-2xl flex flex-col border border-zinc-200/50 h-full overflow-hidden relative">
      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto shadow-2xl">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-mono font-medium border animate-in fade-in slide-in-from-top-2 duration-200 ${
                toast.type === 'success'
                  ? 'bg-black text-white border-zinc-800'
                  : 'bg-zinc-900 text-zinc-100 border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
                )}
                <span>{toast.text}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 1. Card Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 shrink-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0f172a]">
            REPOSITORY STATE & WORKING TREE
          </span>
          {/* Pill badge: main (ahead by 2 commits) */}
          <span className="bg-black text-white font-mono text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {overview.branch} {isPushed ? '(up to date)' : `(ahead by ${overview.aheadBy} commits)`}
          </span>
        </div>
      </div>

      {/* 2. Metrics Row: 3 compact ivory cards inside */}
      <div className="grid grid-cols-3 gap-3 my-4 shrink-0">
        {/* Card 1: Files Changed */}
        <div className="bg-white rounded-2xl p-3.5 border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
          <span className="font-mono text-[11px] text-zinc-500 font-medium">
            Files Changed
          </span>
          <div className="font-mono text-xl font-bold text-[#0f172a] mt-1">
            {overview.filesChanged}
          </div>
        </div>

        {/* Card 2: Insertions */}
        <div className="bg-white rounded-2xl p-3.5 border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
          <span className="font-mono text-[11px] text-zinc-500 font-medium">
            Insertions
          </span>
          <div className="font-mono text-xl font-bold text-emerald-700 mt-1">
            +{overview.insertions}
          </div>
        </div>

        {/* Card 3: Deletions */}
        <div className="bg-white rounded-2xl p-3.5 border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
          <span className="font-mono text-[11px] text-zinc-500 font-medium">
            Deletions
          </span>
          <div className="font-mono text-xl font-bold text-rose-700 mt-1">
            -{overview.deletions}
          </div>
        </div>
      </div>

      {/* 3. Staged Working Changes: List of modified files with expandable accordion */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5 panel-scroll mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 font-semibold uppercase px-1 pt-1 pb-0.5">
          <span>Staged Changes ({overview.modifiedFiles.length})</span>
          <span>Click file to inspect diff</span>
        </div>

        {overview.modifiedFiles.map((file) => {
          const isExpanded = expandedFiles.has(file.filename);
          const isModified = file.status === 'modified';
          const isAdded = file.status === 'added';
          const isDeleted = file.status === 'deleted';

          return (
            <div
              key={file.filename}
              className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden transition-all"
            >
              {/* Accordion Header Row */}
              <button
                onClick={() => toggleFile(file.filename)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-50/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Status Indicator Tag */}
                  {isModified && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold px-2 py-0.5 rounded-md shrink-0">
                      [M]
                    </span>
                  )}
                  {isAdded && (
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs font-bold px-2 py-0.5 rounded-md shrink-0">
                      [A]
                    </span>
                  )}
                  {isDeleted && (
                    <span className="bg-rose-100 text-rose-900 border border-rose-300 font-mono text-xs font-bold px-2 py-0.5 rounded-md shrink-0">
                      [D]
                    </span>
                  )}

                  {/* File Path */}
                  <span className="font-mono text-xs font-semibold text-[#0f172a] truncate">
                    {file.filename}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  {/* Impact Stats */}
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    {file.insertions > 0 && (
                      <span className="text-emerald-700 font-semibold">
                        +{file.insertions}
                      </span>
                    )}
                    {file.deletions > 0 && (
                      <span className="text-rose-700 font-semibold">
                        -{file.deletions}
                      </span>
                    )}
                  </div>

                  {/* Chevron Toggle Icon */}
                  <div className="text-zinc-400">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-zinc-700" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Accordion Expandable Content: Clean Git Diff Block */}
              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-zinc-100 bg-zinc-50/40">
                  <div className="pt-2.5">
                    {renderDiffLines(file.preview)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Git Actions & Controls */}
      <div className="pt-4 border-t border-zinc-200/80 shrink-0 space-y-3">
        {/* Text Input for commit message */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono text-zinc-500 font-medium">
            Commit message:
          </label>
          <div className="bg-white border border-zinc-300 rounded-2xl p-2 px-3 shadow-2xs focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message: 'fix: handle connection timeout'"
              className="w-full bg-transparent text-xs font-mono text-[#0f172a] placeholder-zinc-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Buttons: Solid Black Push Button & Outline White Pull Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Solid Black Button: ⚡ PUSH TO ORIGIN (2 COMMITS) */}
          <button
            onClick={handlePush}
            disabled={isPushing || isPulling}
            className="bg-black hover:bg-zinc-800 disabled:opacity-50 text-white font-mono font-bold text-xs rounded-2xl px-4 py-3 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            {isPushing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00FF88]" />
                <span>PUSHING TO ORIGIN...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-[#00FF88] fill-current" />
                <span>
                  {isPushed ? '⚡ PUSH TO ORIGIN (0 COMMITS)' : '⚡ PUSH TO ORIGIN (2 COMMITS)'}
                </span>
              </>
            )}
          </button>

          {/* Outline/White Button: ↓ PULL LATEST CHANGES */}
          <button
            onClick={handlePull}
            disabled={isPushing || isPulling}
            className="bg-white hover:bg-zinc-100 disabled:opacity-50 text-[#0f172a] font-mono font-bold text-xs rounded-2xl px-4 py-3 flex items-center justify-center gap-2 border border-zinc-300 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            {isPulling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-600" />
                <span>CHECKING UPSTREAM...</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-3.5 h-3.5 text-zinc-700" />
                <span>↓ PULL LATEST CHANGES</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

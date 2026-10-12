import React, { useState } from 'react';
import type { ViewMode, ModelEngine, RepositoryInfo } from '../../types/dashboard';
import {
  Zap,
  RefreshCw,
  Sparkles,
  GitBranch,
  ChevronDown,
  FolderGit2,
  Check,
  Search,
} from 'lucide-react';

interface TopNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedRepo: RepositoryInfo;
  repositories: RepositoryInfo[];
  onSelectRepo: (repo: RepositoryInfo) => void;
  activeEngine: ModelEngine;
  onOpenModelModal: () => void;
  onRunDiagnostics: () => void;
  isRunningDiagnostics: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onViewChange,
  selectedRepo,
  repositories,
  onSelectRepo,
  activeEngine,
  onOpenModelModal,
  onRunDiagnostics,
  isRunningDiagnostics,
}) => {
  const [repoDropdownOpen, setRepoDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncGit = () => {
    setIsSyncing(true);
    setSyncFeedback('Syncing with remote...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback('Git Synced (HEAD up to date)');
      setTimeout(() => setSyncFeedback(null), 2500);
    }, 900);
  };

  return (
    <header className="w-full bg-black border-b border-zinc-900 px-4 lg:px-6 py-3.5 z-40">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo & App Title + Repo Pill */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shadow-sm">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                DevPulse
                <span className="text-[10px] font-mono text-zinc-400 font-normal px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                  AI ARCHITECT
                </span>
              </span>
            </div>
          </div>

          {/* Repository Selector Dropdown Pill */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setRepoDropdownOpen(!repoDropdownOpen)}
              className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-full px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
              <span>{selectedRepo.id}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {repoDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl p-2 z-50"
                onMouseLeave={() => setRepoDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Select Active Repository
                </div>
                {repositories.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      onSelectRepo(repo);
                      setRepoDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between hover:bg-zinc-900 transition-colors ${
                      repo.id === selectedRepo.id ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-400'
                    }`}
                  >
                    <span className="truncate">{repo.id}</span>
                    {repo.id === selectedRepo.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Encapsulated Dark Pill Toggle */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-1 shadow-inner shrink-0">
          <button
            onClick={() => onViewChange('architect')}
            className={`rounded-full px-5 py-1.5 text-xs transition-all duration-150 ${
              currentView === 'architect'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-transparent text-[#a1a1aa] hover:text-white font-medium'
            }`}
          >
            Architect Mode
          </button>
          <button
            onClick={() => onViewChange('devops')}
            className={`rounded-full px-5 py-1.5 text-xs transition-all duration-150 flex items-center gap-1.5 ${
              currentView === 'devops'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-transparent text-[#a1a1aa] hover:text-white font-medium'
            }`}
          >
            <span>PR Diagnostics</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentView === 'devops' ? 'bg-amber-500' : 'bg-amber-400 animate-pulse'
              }`}
            />
          </button>
        </div>

        {/* Right: Tactical Status Pill & Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Tactical status pill with green pulsing dot */}
          <button
            onClick={onOpenModelModal}
            title="Inspect Model Connection"
            className="font-mono text-xs text-green-400 bg-zinc-900 border border-zinc-800 rounded-full px-3.5 py-1.5 flex items-center gap-2 hover:border-zinc-700 transition-colors shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="font-medium tracking-tight">
              Open-Weight {activeEngine.name.split(' ')[0]} 3.3 Connected
            </span>
          </button>

          {/* Quick AI Diagnostics Trigger */}
          <button
            onClick={onRunDiagnostics}
            disabled={isRunningDiagnostics}
            className="hidden xl:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-full px-3 py-1.5 text-xs font-mono transition-colors"
            title="Run AST analysis"
          >
            <Sparkles className={`w-3 h-3 text-white ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
            <span>{isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}</span>
          </button>

          {/* Rounded Dark Action Button: Sync Git */}
          <button
            onClick={handleSyncGit}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs border border-zinc-800 rounded-full px-4 py-1.5 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-300 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncFeedback || 'Sync Git'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

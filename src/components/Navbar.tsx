import React, { useState } from 'react';
import type { NavTab } from '../types';
import { GitBranch, Download, Check } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  branchName?: string;
  onExportReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  branchName = 'main',
  onExportReport,
}) => {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    if (onExportReport) {
      onExportReport();
    }
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <header className="w-full bg-[#000000] border-b border-zinc-900 px-4 lg:px-6 py-3.5 z-40 select-none">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Left: App Brand & Left-Center Pill Switcher */}
        <div className="flex items-center gap-5 sm:gap-8 shrink-0">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm sm:text-base tracking-tight flex items-center gap-2">
              <span className="font-mono text-zinc-400 font-semibold">⌘</span>
              <span>Dev Assist AI</span>
            </span>
          </div>

          {/* Left-Center Pill Switcher */}
          <nav className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-1 shadow-inner shrink-0">
            {/* Tab A: Workbench */}
            <button
              onClick={() => onTabChange('workbench')}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs transition-all duration-150 ${
                activeTab === 'workbench'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-transparent text-[#a1a1aa] hover:text-white font-medium'
              }`}
            >
              Workbench
            </button>

            {/* Tab B: Push & Commit History */}
            <button
              onClick={() => onTabChange('history')}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs transition-all duration-150 ${
                activeTab === 'history'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-transparent text-[#a1a1aa] hover:text-white font-medium'
              }`}
            >
              Push & Commit History
            </button>
          </nav>
        </div>

        {/* Right: Open-weight Badge, Branch Pill, Export Report */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Open-weight badge: ● Gemma-2-9B Active with neon green pulse dot */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]" />
            </span>
            <span className="font-mono text-xs text-[#00FF88] font-medium tracking-tight whitespace-nowrap">
              Gemma-2-9B Active
            </span>
          </div>

          {/* Branch Pill: main */}
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-full px-3 py-1.5">
            <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
            <span>{branchName}</span>
          </div>

          {/* Export Report Action Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs border border-zinc-800 rounded-full px-4 py-1.5 transition-all shadow-sm active:scale-95"
            title="Export audit & session report"
          >
            {exported ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00FF88]" />
                <span className="text-[#00FF88]">Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Export Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

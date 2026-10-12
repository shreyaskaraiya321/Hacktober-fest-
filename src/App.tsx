import React, { useState } from 'react';
import type { NavTab } from './types';
import { Navbar } from './components/Navbar';
import { RepoChatPanel } from './components/RepoChatPanel';
import { RepoStagingDesk } from './components/RepoStagingDesk';
import { CommitHistoryView } from './components/CommitHistoryView';
import {
  mockRepoOverview,
  mockChatMessages,
  mockCommits,
} from './mockData';
import { AnimatePresence, motion } from 'framer-motion';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('workbench');
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  return (
    <div className="h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white overflow-hidden">
      {/* Top Navigation Shell */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        branchName={mockRepoOverview.branch}
      />

      {/* Main Container for Active View */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto p-3 lg:px-6 lg:pb-4 lg:pt-2 bg-[#000000] flex flex-col min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'workbench' ? (
            /* Workbench Active Container: Floating Ivory/Off-White Panels with 16px gap */
            <motion.div
              key="workbench"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 h-full"
            >
              {/* Left Card: Repo AI Chatbot Panel */}
              <div className="lg:col-span-5 h-full min-h-0 overflow-hidden">
                <RepoChatPanel
                  initialMessages={mockChatMessages}
                  onSelectFileChip={(path) => {
                    setSelectedFilePath(path);
                  }}
                />
              </div>

              {/* Right Card: Git Repo Overview & Staging Desk */}
              <div className="lg:col-span-7 h-full min-h-0 overflow-hidden">
                <RepoStagingDesk
                  overview={mockRepoOverview}
                  selectedFilePath={selectedFilePath}
                />
              </div>
            </motion.div>
          ) : (
            /* Push & Commit History Active Container: Large Floating Off-White Container */
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 min-h-0 h-full overflow-hidden"
            >
              <CommitHistoryView
                commits={mockCommits}
                branchName={mockRepoOverview.branch}
                aheadBy={mockRepoOverview.aheadBy}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Minimal Black Footer */}
      <footer className="h-8 bg-[#000000] border-t border-zinc-900 px-6 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-400">
            {/* Active beacon: Neon green dot */}
            <span className="h-2 w-2 rounded-full bg-[#00FF88]" />
            <span>Open-Weight Node: <strong className="text-zinc-200">Gemma-2-9B (Local)</strong></span>
          </span>
          <span className="hidden sm:inline text-zinc-800">|</span>
          <span className="hidden sm:inline text-zinc-400">
            Branch: <strong className="text-zinc-200">{mockRepoOverview.branch}</strong> ({mockRepoOverview.aheadBy} ahead)
          </span>
        </div>

        <div className="text-zinc-500">
          ⌘ Dev Assist AI • Workspace & Staging Desk Active
        </div>
      </footer>
    </div>
  );
};

export default App;

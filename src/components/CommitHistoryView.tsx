import React, { useState } from 'react';
import type { CommitItem } from '../types';
import {
  GitCommit,
  GitBranch,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  FileCode,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
} from 'lucide-react';
import { ActivityHeatmap } from './ui/activity-heatmap';

interface CommitHistoryViewProps {
  commits: CommitItem[];
  branchName: string;
  aheadBy: number;
}

export const CommitHistoryView: React.FC<CommitHistoryViewProps> = ({
  commits,
  branchName,
  aheadBy,
}) => {
  // Accordion state: Set of expanded commit IDs (first one open by default)
  const [expandedCommitIds, setExpandedCommitIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (commits.length > 0) {
      initial.add(commits[0].id);
    }
    return initial;
  });

  // Copied hash feedback state
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Optional search filter
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCommitAccordion = (commitId: string) => {
    setExpandedCommitIds((prev) => {
      const next = new Set(prev);
      if (next.has(commitId)) {
        next.delete(commitId);
      } else {
        next.add(commitId);
      }
      return next;
    });
  };

  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredCommits = commits.filter(
    (c) =>
      c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.touchedFiles.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="rounded-3xl bg-[#F4F4F0] p-6 lg:p-8 text-[#0f172a] shadow-2xl flex flex-col border border-zinc-200/50 h-full overflow-hidden">
      {/* 1. Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-[#0f172a]">
              Recent Pushes & Commit Timeline
            </h2>
            {/* Ahead Badge */}
            <span className="hidden sm:inline-flex bg-black text-white font-mono text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {branchName} (ahead by {aheadBy})
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Tracking push trajectory, differential AST impact, and AI regression diagnostics.
          </p>
        </div>

        {/* Telemetry Badge: ● Live Sync Active */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-3.5 py-1.5 rounded-full font-mono text-xs flex items-center gap-2 font-semibold shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter commits by hash, author, or touched file..."
            className="w-full bg-white border border-zinc-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-[#0f172a] placeholder-zinc-400 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-all shadow-2xs"
          />
        </div>

        <span className="font-mono text-xs text-zinc-500 font-medium">
          {filteredCommits.length} of {commits.length} commits listed
        </span>
      </div>

      {/* 2. Commit Timeline & Activity Heatmap */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3.5 panel-scroll pt-1">
        {/* Activity Heatmap Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                ANNUAL CONTRIBUTION & MERGE STREAM
              </span>
              <span className="bg-black text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-semibold">
                52 WEEKS
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Hover cells for daily metrics
            </span>
          </div>
          <ActivityHeatmap showLegend={true} />
        </div>
        {filteredCommits.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-zinc-400 font-mono text-xs">
            <GitCommit className="w-8 h-8 text-zinc-400 mb-2 stroke-1" />
            <p className="font-semibold text-zinc-600">No commits matched your query</p>
            <p className="text-[11px] text-zinc-500 mt-1">Try clearing the search filter.</p>
          </div>
        ) : (
          filteredCommits.map((commit, index) => {
            const isExpanded = expandedCommitIds.has(commit.id);
            const isCopied = copiedHash === commit.hash;

            return (
              <div
                key={commit.id}
                className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all space-y-3.5"
              >
                {/* Top Row: Commit SHA pill, subject line, relative timestamp pill */}
                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Commit SHA Pill with functional copy */}
                    <button
                      onClick={(e) => handleCopyHash(commit.hash, e)}
                      title="Click to copy full commit hash"
                      className="bg-black hover:bg-zinc-800 text-white font-mono px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      <GitCommit className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span>{commit.hash}</span>
                      {isCopied ? (
                        <Check className="w-3 h-3 text-[#00FF88] ml-0.5" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-400 ml-0.5" />
                      )}
                    </button>

                    {/* Commit Subject Line */}
                    <h3 className="font-bold text-xs sm:text-sm text-[#0f172a] leading-snug break-words">
                      {commit.message}
                    </h3>
                  </div>

                  {/* Relative Timestamp Pill */}
                  <div className="bg-zinc-100 text-zinc-600 font-mono text-[11px] px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span>{commit.timeAgo}</span>
                  </div>
                </div>

                {/* Middle Row: Author badge with avatar/initials & Impact stats */}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-zinc-100 flex-wrap">
                  {/* Author Badge with Avatar / Initials */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-900 text-white font-mono text-xs flex items-center justify-center font-bold shadow-2xs">
                      {commit.avatarInitials || commit.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-xs font-semibold text-zinc-900">
                        {commit.author}
                      </span>
                      {commit.authorRole && (
                        <span className="bg-zinc-100 text-zinc-600 font-mono text-[10px] px-2 py-0.5 rounded font-medium">
                          {commit.authorRole}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Impact Stats Pill: +84 / -12 lines */}
                  <div className="flex items-center gap-2">
                    <div className="bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 font-semibold">
                      <span className="text-emerald-700">+{commit.impactStats.insertions}</span>
                      <span className="text-zinc-300">/</span>
                      <span className="text-rose-700">-{commit.impactStats.deletions}</span>
                      <span className="text-zinc-500 text-[11px] font-normal ml-1">
                        ({commit.impactStats.filesCount} {commit.impactStats.filesCount === 1 ? 'file' : 'files'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* List of Touched Files */}
                {commit.touchedFiles && commit.touchedFiles.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mr-1">
                      Touched:
                    </span>
                    {commit.touchedFiles.map((file, fIdx) => (
                      <span
                        key={fIdx}
                        className="bg-zinc-100 text-zinc-800 border border-zinc-200/80 font-mono text-[11px] px-2.5 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <FileCode className="w-3 h-3 text-zinc-500" />
                        <span>{file}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Summary Accordion */}
                <div className="pt-1">
                  <button
                    onClick={() => toggleCommitAccordion(commit.id)}
                    className="w-full bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200/90 rounded-xl p-2.5 px-3 flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      <span className="font-mono text-xs font-bold text-zinc-900">
                        AI Commit Summary
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        • Verified by Gemma-2-9B
                      </span>
                    </div>

                    <div className="text-zinc-500">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-zinc-800" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </button>

                  {/* Expanded AI Summary Content */}
                  {isExpanded && commit.aiSummary && (
                    <div className="mt-2 bg-zinc-50/60 rounded-xl p-4 border border-zinc-200 text-xs space-y-3 animate-in fade-in duration-150">
                      {/* What Changed */}
                      <div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Architectural & Logic Modifications</span>
                        </div>
                        <ul className="space-y-1 pl-5 list-disc text-zinc-700 leading-relaxed font-sans text-xs">
                          {commit.aiSummary.changes.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Potential Regression Risks */}
                      {commit.aiSummary.risks && commit.aiSummary.risks.length > 0 && (
                        <div className="pt-2 border-t border-zinc-200/80">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Potential Regression Risks</span>
                          </div>
                          <ul className="space-y-1 pl-5 list-disc text-zinc-700 leading-relaxed font-sans text-xs">
                            {commit.aiSummary.risks.map((risk, idx) => (
                              <li key={idx} className="text-zinc-800">
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

import React from 'react';
import type { PullRequest, DiffLine } from '../../types/dashboard';
import {
  FileCode,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  GitCommit,
  GitBranch,
} from 'lucide-react';

interface GitDiffViewerProps {
  pr: PullRequest;
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  isFixApplied: boolean;
}

export const GitDiffViewer: React.FC<GitDiffViewerProps> = ({
  pr,
  activeFileId,
  onSelectFile,
  isFixApplied,
}) => {
  const activeFile = pr.files.find((f) => f.id === activeFileId) || pr.files[0];

  const renderDiffLine = (line: DiffLine, idx: number) => {
    let rowClass = 'hover:bg-zinc-50/80 text-zinc-800';
    let signClass = 'text-zinc-400';
    let lineNumClass = 'text-zinc-400';
    let sign = ' ';

    if (line.type === 'delete') {
      rowClass = 'bg-red-50 text-red-700';
      signClass = 'text-red-500 font-bold';
      lineNumClass = 'text-red-400';
      sign = '-';
    } else if (line.type === 'add') {
      rowClass = 'bg-emerald-50 text-emerald-800';
      signClass = 'text-emerald-600 font-bold';
      lineNumClass = 'text-emerald-500';
      sign = '+';
    } else if (line.type === 'header') {
      return (
        <div
          key={idx}
          className="bg-zinc-100 text-zinc-600 font-mono text-xs font-semibold py-1 px-4 border-y border-zinc-200 select-none"
        >
          {line.content}
        </div>
      );
    }

    return (
      <React.Fragment key={idx}>
        <div className={`flex items-start text-xs font-mono py-1 px-3 select-text transition-colors ${rowClass}`}>
          {/* Old Line Number */}
          <div className={`w-9 text-right pr-2 select-none shrink-0 ${lineNumClass}`}>
            {line.oldLineNumber || ''}
          </div>
          {/* New Line Number */}
          <div className={`w-9 text-right pr-2 select-none shrink-0 ${lineNumClass}`}>
            {line.newLineNumber || ''}
          </div>
          {/* Sign Indicator */}
          <div className={`w-5 text-center select-none shrink-0 ${signClass}`}>
            {sign}
          </div>
          {/* Code Line Content */}
          <div className="flex-1 whitespace-pre-wrap break-all leading-relaxed font-mono">
            {line.content}
          </div>
        </div>

        {/* In-line AI Warning Callouts: Floating cards right below affected lines */}
        {line.annotation && !isFixApplied && (
          <div className="my-2.5 mx-4 bg-zinc-900 text-zinc-100 rounded-xl p-3.5 border-l-4 border-amber-500 shadow-md space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
                {line.annotation.severity === 'critical' ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span>AI IN-LINE REVIEW: {line.annotation.rule}</span>
              </span>
              <span className="bg-zinc-800 text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded-md">
                Line {line.newLineNumber}
              </span>
            </div>
            <p className="text-zinc-300 text-xs font-mono leading-relaxed pl-6">
              {line.annotation.message}
            </p>
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="border-b border-zinc-200 pb-4 mb-4">
        {/* Monospace small label + Commit SHA pill */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              COMMIT DIFF INSPECTOR
            </span>
            <span className="bg-zinc-200 text-zinc-900 rounded-md px-2 py-0.5 text-xs font-mono font-medium flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-zinc-600" />
              <span>a8f7e2d9</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
            <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
            <span>feat/paged-kv-reclaim → main</span>
          </div>
        </div>

        {/* Clean Bold Filename Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight font-mono">
            {activeFile.filename}
          </h2>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
              +{activeFile.additions}
            </span>
            <span className="text-red-700 bg-red-100 font-semibold px-2 py-0.5 rounded">
              -{activeFile.deletions}
            </span>
          </div>
        </div>

        {/* File Tabs Switcher */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pt-1">
          {pr.files.map((file) => {
            const isSelected = file.id === activeFile.id;
            return (
              <button
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-medium shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.filename.split('/').pop()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applied Fix Banner */}
      {isFixApplied && activeFile.id === 'diff-paged-allocator' && (
        <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Hot-patch applied: Nested locks eliminated & ABBA deadlock verified fixed!
            </span>
          </div>
          <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
            PASSED
          </span>
        </div>
      )}

      {/* Diff Viewer Body */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-200 bg-white">
        <div className="divide-y divide-zinc-100">
          {activeFile.lines.map((line, idx) => renderDiffLine(line, idx))}
        </div>
      </div>
    </div>
  );
};

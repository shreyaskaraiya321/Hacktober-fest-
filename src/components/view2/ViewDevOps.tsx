import React, { useState } from 'react';
import type { PullRequest, AIDiagnosticReport } from '../../types/dashboard';
import { GitDiffViewer } from './GitDiffViewer';
import { AIDiagnosticCard } from './AIDiagnosticCard';

interface ViewDevOpsProps {
  pullRequest: PullRequest;
  report: AIDiagnosticReport;
  activeModelName: string;
}

export const ViewDevOps: React.FC<ViewDevOpsProps> = ({
  pullRequest,
  report,
  activeModelName,
}) => {
  const [activeFileId, setActiveFileId] = useState<string>('diff-paged-allocator');
  const [isFixApplied, setIsFixApplied] = useState<boolean>(false);

  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto p-4 lg:p-6 bg-black">
      {/* Outer Container: Two floating, rounded-3xl white panels side-by-side with a 16px gap on black canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-6.5rem)] min-h-[640px]">
        {/* Left Floating White Panel: Git Diff & In-line Analysis (7 Cols) */}
        <section className="lg:col-span-7 h-full bg-white rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col text-zinc-900 border border-zinc-200/50">
          <GitDiffViewer
            pr={pullRequest}
            activeFileId={activeFileId}
            onSelectFile={(id) => setActiveFileId(id)}
            isFixApplied={isFixApplied}
          />
        </section>

        {/* Right Floating White Panel: DevOps Triage & AI Patches (5 Cols) */}
        <section className="lg:col-span-5 h-full bg-white rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col text-zinc-900 border border-zinc-200/50">
          <AIDiagnosticCard
            report={report}
            isFixApplied={isFixApplied}
            onApplyFix={() => setIsFixApplied(true)}
            onResetFix={() => setIsFixApplied(false)}
            activeModelName={activeModelName}
          />
        </section>
      </div>
    </div>
  );
};

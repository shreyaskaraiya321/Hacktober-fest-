import React, { useState } from 'react';
import type {
  FileTreeNode,
  ArchitectureNode,
  ArchitecturalInsight,
  OnboardingStep,
  CodeConvention,
} from '../../types/dashboard';
import { ModuleExplorer } from './ModuleExplorer';
import { ArchitecturalFlow } from './ArchitecturalFlow';
import { ModuleSummaryPanel } from './ModuleSummaryPanel';
import { OnboardingGuide } from './OnboardingGuide';

interface ViewArchitectProps {
  files: FileTreeNode[];
  architectureNodes: ArchitectureNode[];
  insights: ArchitecturalInsight[];
  onboardingSteps: OnboardingStep[];
  conventions: CodeConvention[];
  onNavigateToDevOps: () => void;
}

export const ViewArchitect: React.FC<ViewArchitectProps> = ({
  files,
  architectureNodes,
  insights,
  onboardingSteps,
  conventions,
  onNavigateToDevOps,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(
    files[0]?.children?.[0]?.children?.[0] || null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-cache');

  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto p-4 lg:p-6 bg-black">
      {/* Floating White Panels with 16px gap on black canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-6.5rem)] min-h-[640px]">
        {/* Left Floating White Panel: Module Explorer (3 Cols) */}
        <section className="lg:col-span-3 h-full bg-white rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col text-zinc-900 border border-zinc-200/50">
          <ModuleExplorer
            files={files}
            selectedFile={selectedFile}
            onSelectFile={(file) => setSelectedFile(file)}
          />
        </section>

        {/* Center Section: Pipeline Architecture Flow & Insights (6 Cols) */}
        <section className="lg:col-span-6 h-full overflow-y-auto space-y-4 pr-1">
          <ArchitecturalFlow
            nodes={architectureNodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
          />
          <ModuleSummaryPanel
            selectedFile={selectedFile}
            insights={insights}
            onNavigateToDevOps={onNavigateToDevOps}
          />
        </section>

        {/* Right Floating White Panel: Contributor Ramp-Up Guide (3 Cols) */}
        <section className="lg:col-span-3 h-full bg-white rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col text-zinc-900 border border-zinc-200/50">
          <OnboardingGuide
            initialSteps={onboardingSteps}
            conventions={conventions}
          />
        </section>
      </div>
    </div>
  );
};

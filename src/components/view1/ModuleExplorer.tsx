import React, { useState } from 'react';
import type { FileTreeNode } from '../../types/dashboard';
import {
  Folder,
  FolderOpen,
  FileCode,
  Search,
  Sparkles,
  ChevronRight,
  ChevronDown,
  FileBox,
} from 'lucide-react';

interface ModuleExplorerProps {
  files: FileTreeNode[];
  selectedFile: FileTreeNode | null;
  onSelectFile: (file: FileTreeNode) => void;
}

export const ModuleExplorer: React.FC<ModuleExplorerProps> = ({
  files,
  selectedFile,
  onSelectFile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'root-src': true,
    'cache-dir': true,
    'engine-dir': true,
    'root-config': false,
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const renderComplexity = (complexity?: string) => {
    switch (complexity) {
      case 'critical':
        return (
          <span className="bg-red-100 text-red-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
            CRIT
          </span>
        );
      case 'high':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="bg-zinc-200 text-zinc-700 text-[10px] font-mono px-1.5 py-0.5 rounded">
            MED
          </span>
        );
      default:
        return null;
    }
  };

  const renderTree = (nodes: FileTreeNode[], depth = 0) => {
    return nodes
      .filter((node) => {
        if (!searchTerm) return true;
        return (
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.path.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .map((node) => {
        const isFolder = node.type === 'folder';
        const isExpanded = expandedFolders[node.id] ?? false;
        const isSelected = selectedFile?.id === node.id;

        return (
          <div key={node.id} className="select-none">
            <div
              onClick={() => {
                if (isFolder) {
                  toggleFolder(node.id);
                } else {
                  onSelectFile(node);
                }
              }}
              style={{ paddingLeft: `${Math.max(6, depth * 12)}px` }}
              className={`flex items-center justify-between py-1.5 pr-2 rounded-xl text-xs font-mono cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-zinc-700 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {isFolder ? (
                  <span className={isSelected ? 'text-zinc-400' : 'text-zinc-400'}>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                ) : (
                  <span className="w-3.5" />
                )}

                {isFolder ? (
                  isExpanded ? (
                    <FolderOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-zinc-700'}`} />
                  ) : (
                    <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`} />
                  )
                ) : (
                  <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                )}

                <span className="truncate">{node.name}</span>

                {node.hasAiInsight && (
                  <Sparkles className={`w-3 h-3 shrink-0 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                )}
              </div>

              {!isFolder && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {renderComplexity(node.complexity)}
                  {node.lines && (
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                      {node.lines}L
                    </span>
                  )}
                </div>
              )}
            </div>

            {isFolder && isExpanded && node.children && (
              <div className="border-l border-zinc-200 ml-2.5">
                {renderTree(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="h-full flex flex-col text-zinc-900">
      {/* Header */}
      <div className="pb-3 border-b border-zinc-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono flex items-center gap-1.5">
            <FileBox className="w-3.5 h-3.5 text-zinc-800" />
            MODULE EXPLORER
          </span>
          <span className="bg-zinc-100 text-zinc-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-zinc-200">
            AST INDEXED
          </span>
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files & modules..."
            className="w-full bg-zinc-100 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Tree content */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5 pr-1">
        {renderTree(files)}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span>14 system modules</span>
        <span className="font-semibold text-zinc-800">4,892 LOC</span>
      </div>
    </div>
  );
};

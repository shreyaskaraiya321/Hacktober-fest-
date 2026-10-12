export type ViewMode = 'architect' | 'devops';

export interface ModelEngine {
  id: string;
  name: string;
  provider: string;
  parameters: string;
  contextWindow: string;
  quantization: string;
  tokensPerSec: number;
  memoryUsage: string;
  status: 'online' | 'warm' | 'offline';
  description: string;
}

export interface RepositoryInfo {
  id: string;
  name: string;
  owner: string;
  branch: string;
  commitHash: string;
  stars: number;
  forks: number;
  openPRs: number;
  ciStatus: 'passing' | 'running' | 'failing';
  description: string;
  language: string;
  license: string;
}

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: string;
  lines?: number;
  complexity?: 'low' | 'medium' | 'high' | 'critical';
  hasAiInsight?: boolean;
  children?: FileTreeNode[];
  language?: string;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'memory' | 'compute' | 'output';
  role: string;
  latencyMs: number;
  memoryMb: number;
  throughput: string;
  status: 'healthy' | 'warning' | 'optimizing';
  dependencies: string[];
  description: string;
  techStack: string[];
}

export interface ArchitecturalInsight {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info' | 'optimization';
  module: string;
  description: string;
  impact: string;
  recommendation: string;
  modelConfidence: number;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  completed: boolean;
  category: 'environment' | 'testing' | 'conventions';
  timeEstimate: string;
}

export interface CodeConvention {
  rule: string;
  description: string;
  exampleGood: string;
  exampleBad: string;
  category: 'memory' | 'async' | 'concurrency' | 'api';
}

export interface DiffLine {
  type: 'add' | 'delete' | 'context' | 'header';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
  annotation?: {
    severity: 'critical' | 'warning' | 'info';
    message: string;
    rule: string;
  };
}

export interface DiffFile {
  id: string;
  filename: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
  lines: DiffLine[];
}

export interface PullRequest {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  sourceBranch: string;
  targetBranch: string;
  createdAt: string;
  status: 'open' | 'merged' | 'draft';
  checksPassed: number;
  totalChecks: number;
  files: DiffFile[];
}

export interface DiagnosticRiskGauge {
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number; // 0-100
  technicalDebtDeltaMinutes: number; // e.g. -45 or +30
  memorySafetyScore: number; // 0-100
  concurrencyHazardIndex: number; // 0-100
  testCoverageRisk: number; // 0-100
}

export interface SuggestedPatch {
  id: string;
  filePath: string;
  description: string;
  patchCode: string;
  rationale: string;
  applied: boolean;
}

export interface AIDiagnosticReport {
  prId: number;
  modelName: string;
  timestamp: string;
  issueSummary: string;
  rootCauseAnalysis: string[];
  riskMetrics: DiagnosticRiskGauge;
  suggestedPatches: SuggestedPatch[];
  securityAudits: {
    category: string;
    passed: boolean;
    details: string;
  }[];
}

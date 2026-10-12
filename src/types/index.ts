export type NavTab = 'workbench' | 'history';

export interface FileChip {
  path: string;
  lines?: string;
  status?: 'modified' | 'added' | 'deleted';
}

export interface CodeSnippet {
  language: string;
  filename?: string;
  code: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  content: string;
  thinking?: string;
  fileChips?: FileChip[];
  codeSnippets?: CodeSnippet[];
}

export interface ModifiedFile {
  filename: string;
  status: 'modified' | 'added' | 'deleted';
  insertions: number;
  deletions: number;
  preview: string;
}

export interface RepoOverview {
  branch: string;
  aheadBy: number;
  filesChanged: number;
  insertions: number;
  deletions: number;
  modifiedFiles: ModifiedFile[];
}

export interface CommitAiSummary {
  changes: string[];
  risks: string[];
}

export interface CommitItem {
  id: string;
  hash: string;
  message: string;
  author: string;
  authorRole?: string;
  avatarInitials?: string;
  timeAgo: string;
  impactStats: {
    insertions: number;
    deletions: number;
    filesCount: number;
  };
  touchedFiles: string[];
  aiSummary: CommitAiSummary;
}

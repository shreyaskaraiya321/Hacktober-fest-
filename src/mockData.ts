import type {
  ChatMessage,
  RepoOverview,
  CommitItem,
} from './types';
import type { ActivityDay } from './components/ui/activity-heatmap';

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    timestamp: '10:42 AM',
    content: 'We need to audit `src/auth/session.ts` for race conditions during token rotation. Can you verify if our Redis sliding window locks prevent double-spend of refresh tokens?',
    fileChips: [
      {
        path: 'src/auth/session.ts',
        lines: 'L42-L88',
        status: 'modified',
      },
    ],
  },
  {
    id: 'msg-2',
    role: 'assistant',
    timestamp: '10:42 AM',
    thinking: `Inspecting token rotation logic in \`src/auth/session.ts\`.
1. Traced \`rotateSessionTokens()\` execution path across concurrent worker threads.
2. Found a 45ms window where the old refresh token is validated before Redis atomic TTL update executes.
3. Concurrent requests with identical refresh tokens could both pass validation and receive two distinct new sessions.
4. Proposed atomic Lua script to enforce CAS (Compare-And-Swap) revocation.`,
    content: `I've analyzed the token rotation pipeline in \`src/auth/session.ts\`. There is a potential **double-spend concurrency vulnerability** between the token validation step and the Redis key invalidation.

If two parallel API calls execute simultaneously with the same refresh token, both could succeed before the old token is marked as revoked.

### Recommended Fix:
Use an atomic Lua CAS script or Redis \`MULTI/EXEC\` transaction with an in-flight grace period:

\`\`\`typescript
// src/auth/session.ts
export async function rotateSessionTokens(oldTokenHash: string, userId: string): Promise<SessionTokens> {
  const luaScript = \`
    local current = redis.call('GET', KEYS[1])
    if current == ARGV[1] then
      redis.call('SETEX', KEYS[1], ARGV[2], ARGV[3])
      return 1
    else
      return 0
    end
  \`;
  
  const rotated = await redis.eval(luaScript, 1, \`session:\${userId}\`, oldTokenHash, 86400, newHash);
  if (!rotated) {
    throw new SecurityException("TOKEN_REUSE_DETECTED: Refresh token was already consumed");
  }
  return generateTokenPair(userId);
}
\`\`\`
`,
    fileChips: [
      {
        path: 'src/auth/session.ts',
        lines: 'L64-L95',
        status: 'modified',
      },
      {
        path: 'src/middleware/rateLimiter.ts',
        lines: 'L12-L30',
        status: 'modified',
      },
    ],
    codeSnippets: [
      {
        language: 'typescript',
        filename: 'src/auth/session.ts',
        code: `export async function rotateSessionTokens(oldTokenHash: string, userId: string): Promise<SessionTokens> {
  const rotated = await redis.eval(CAS_ROTATE_SCRIPT, 1, \`session:\${userId}\`, oldTokenHash, 86400, newHash);
  if (!rotated) throw new SecurityException("TOKEN_REUSE_DETECTED");
  return generateTokenPair(userId);
}`,
      },
    ],
  },
  {
    id: 'msg-3',
    role: 'user',
    timestamp: '10:45 AM',
    content: 'Does this change require modifications to `src/middleware/rateLimiter.ts` to prevent brute force replay attempts?',
  },
  {
    id: 'msg-4',
    role: 'assistant',
    timestamp: '10:45 AM',
    thinking: `Evaluating rate limiting thresholds for session regeneration.
Adding dedicated sliding window bucket for token regeneration endpoints to isolate auth load.`,
    content: `Yes, we should add a tight rate-limiting bucket of **5 rotations per minute per IP** in \`src/middleware/rateLimiter.ts\` to quickly isolate compromised client tokens.

I've queued this patch in the active working branch.`,
    fileChips: [
      {
        path: 'src/middleware/rateLimiter.ts',
        lines: 'L34-L52',
        status: 'modified',
      },
    ],
  },
];

export const mockRepoOverview: RepoOverview = {
  branch: 'main',
  aheadBy: 2,
  filesChanged: 3,
  insertions: 142,
  deletions: 38,
  modifiedFiles: [
    {
      filename: 'src/services/database.ts',
      status: 'modified',
      insertions: 72,
      deletions: 18,
      preview: `@@ -14,10 +14,18 @@ export class DatabaseConnectionPool {
-  private connectionTimeoutMs = 5000;
-  private maxPoolSize = 10;
+  private connectionTimeoutMs = 12000;
+  private maxPoolSize = 25;
+  private idleTimeoutMs = 30000;

   async acquireConnection(): Promise<PooledClient> {
-    return this.client.connect();
+    return this.connectWithExponentialBackoff({
+      retries: 3,
+      factor: 2,
+      timeoutMs: this.connectionTimeoutMs,
+    });
   }`,
    },
    {
      filename: 'src/controllers/auth.ts',
      status: 'added',
      insertions: 64,
      deletions: 0,
      preview: `@@ -0,0 +1,22 @@
+import { Request, Response } from 'express';
+import { rotateSessionTokens } from '../auth/session';
+import { logger } from '../utils/logger';
+
+export async function handleTokenExchange(req: Request, res: Response) {
+  try {
+    const { oldTokenHash, userId } = req.body;
+    const tokens = await rotateSessionTokens(oldTokenHash, userId);
+    return res.status(200).json({ status: 'ok', tokens });
+  } catch (err: any) {
+    logger.warn('Token rotation violation detected', { err: err.message });
+    return res.status(401).json({ error: 'TOKEN_REUSE_DETECTED' });
+  }
+}`,
    },
    {
      filename: 'package.json',
      status: 'modified',
      insertions: 6,
      deletions: 20,
      preview: `@@ -18,12 +18,8 @@
     "express": "^4.19.2",
-    "express-rate-limit": "^6.8.0",
-    "redis": "^3.1.2",
+    "express-rate-limit": "^7.1.5",
+    "ioredis": "^5.3.2",
     "zod": "^3.22.4"
   }`,
    },
  ],
};

export const mockCommits: CommitItem[] = [
  {
    id: 'commit-1',
    hash: 'a1b2c3d',
    message: 'feat(auth): implement atomic CAS token rotation & reuse detection',
    author: 'Sarah (Backend)',
    authorRole: 'Backend Lead',
    avatarInitials: 'SB',
    date: '2026-10-12',
    timeAgo: '2 hours ago',
    impactStats: {
      insertions: 84,
      deletions: 22,
      filesCount: 2,
    },
    touchedFiles: [
      'src/auth/session.ts',
      'src/controllers/auth.ts',
    ],
    aiSummary: {
      changes: [
        'Introduced Redis Compare-And-Swap (CAS) evaluation script to invalidate consumed refresh tokens atomically.',
        'Attached strict single-use validation checks to eliminate double-spend concurrency windows.',
      ],
      risks: [
        'Slight Redis command round-trip latency overhead (~2-4ms) under peak concurrent rotation bursts.',
        'Replay attempts by legacy non-compliant clients will now throw 401 exceptions immediately.',
      ],
    },
  },
  {
    id: 'commit-2',
    hash: '9f8e7d6',
    message: 'fix(rate-limit): configure 5 req/min burst limiter for auth endpoints',
    author: 'Alex (Lead Dev)',
    authorRole: 'Tech Lead',
    avatarInitials: 'AL',
    date: '2026-10-12',
    timeAgo: '4 hours ago',
    impactStats: {
      insertions: 46,
      deletions: 12,
      filesCount: 1,
    },
    touchedFiles: [
      'src/middleware/rateLimiter.ts',
    ],
    aiSummary: {
      changes: [
        'Configured isolated sliding-window rate limit bucket for token exchange and refresh routes.',
        'Standardized 429 Too Many Requests response payload and Retry-After HTTP headers.',
      ],
      risks: [
        'Shared enterprise NAT/proxy IPs may experience false-positive throttle limits if unkeyed by user agent.',
      ],
    },
  },
  {
    id: 'commit-3',
    hash: '3c4d5e6',
    message: 'refactor(cache): replace memory session store with pooled Redis cluster',
    author: 'David (Infra)',
    authorRole: 'Platform Eng',
    avatarInitials: 'DI',
    date: '2026-10-11',
    timeAgo: 'yesterday',
    impactStats: {
      insertions: 112,
      deletions: 89,
      filesCount: 4,
    },
    touchedFiles: [
      'src/cache/pool.ts',
      'src/config/redis.ts',
      'src/server.ts',
      'src/types/cache.ts',
    ],
    aiSummary: {
      changes: [
        'Replaced localized process memory map with pooled clustered Redis connection provider.',
        'Implemented round-robin read replicas and socket error detachment cleanup.',
      ],
      risks: [
        'Network partitions between application pods and Redis master node will yield transient read fallbacks.',
      ],
    },
  },
  {
    id: 'commit-4',
    hash: '8b7a6c5',
    message: 'test(auth): add concurrent multi-client race simulation test harness',
    author: 'Marcus (QA & Sec)',
    authorRole: 'Security Eng',
    avatarInitials: 'MQ',
    date: '2026-10-10',
    timeAgo: '2 days ago',
    impactStats: {
      insertions: 195,
      deletions: 14,
      filesCount: 3,
    },
    touchedFiles: [
      'tests/auth_stress.test.ts',
      'tests/fixtures/tokens.ts',
      'jest.config.ts',
    ],
    aiSummary: {
      changes: [
        'Constructed parallel load test dispatching 50 concurrent requests with identical refresh credentials.',
        'Verified assertion that exactly 1 request succeeds (HTTP 200) and 49 receive 401 SecurityException.',
      ],
      risks: [
        'CI pipeline duration extended by ~3.2s per test run.',
      ],
    },
  },
  {
    id: 'commit-5',
    hash: '5e6f7a8',
    message: 'chore(deps): bump redis client driver and token validation library',
    author: 'Sarah (Backend)',
    authorRole: 'Backend Lead',
    avatarInitials: 'SB',
    date: '2026-10-09',
    timeAgo: '3 days ago',
    impactStats: {
      insertions: 18,
      deletions: 8,
      filesCount: 2,
    },
    touchedFiles: [
      'package.json',
      'package-lock.json',
    ],
    aiSummary: {
      changes: [
        'Bumped ioredis to 5.3.2 to patch client memory retention issue during abnormal connection drops.',
        'Upgraded Zod schema validator to 3.22.4.',
      ],
      risks: [
        'Minimal patch update; low risk of breaking interface changes.',
      ],
    },
  },
];

export function generateHeatmapDataFromCommits(commits: typeof mockCommits): ActivityDay[] {
  // Aggregate commit counts by date 'YYYY-MM-DD'
  const countsByDate = new Map<string, number>();
  for (const commit of commits) {
    if (commit.date) {
      countsByDate.set(commit.date, (countsByDate.get(commit.date) || 0) + 1);
    }
  }

  // 365-day array ending today (2026-10-12)
  const result: ActivityDay[] = [];
  const baseTime = Date.UTC(2026, 9, 12); // October 12, 2026
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (let i = 364; i >= 0; i--) {
    const dayTime = baseTime - i * ONE_DAY_MS;
    const d = new Date(dayTime);
    const dateStr = d.toISOString().split('T')[0];

    const count = countsByDate.get(dateStr) || 0;

    result.push({
      date: dateStr,
      count,
    });
  }

  return result;
}

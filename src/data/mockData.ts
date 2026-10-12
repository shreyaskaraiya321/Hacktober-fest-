import {
  ModelEngine,
  RepositoryInfo,
  FileTreeNode,
  ArchitectureNode,
  ArchitecturalInsight,
  OnboardingStep,
  CodeConvention,
  PullRequest,
  AIDiagnosticReport,
} from '../types/dashboard';
import type { CommitItem } from '../types';
import type { ActivityDay } from '../components/ui/activity-heatmap';

export const mockEngines: ModelEngine[] = [
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta AI / Local vLLM',
    parameters: '70.6 Billion',
    contextWindow: '128k Tokens',
    quantization: 'AWQ 4-bit (INT4)',
    tokensPerSec: 46.8,
    memoryUsage: '38.4 GB / 48 GB VRAM',
    status: 'online',
    description: 'High-density instruction-tuned model specialized in systems architecture, Rust/C++ AST reasoning, and concurrency analysis.',
  },
  {
    id: 'deepseek-r1-70b',
    name: 'DeepSeek R1 Distill 70B',
    provider: 'DeepSeek / Ollama Local',
    parameters: '70.0 Billion',
    contextWindow: '64k Tokens',
    quantization: 'GGUF Q5_K_M',
    tokensPerSec: 34.2,
    memoryUsage: '44.1 GB / 48 GB VRAM',
    status: 'warm',
    description: 'Deep reasoning chain-of-thought engine tailored for formal verification and race condition proofs.',
  },
  {
    id: 'qwen-2.5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba Cloud / Local TensorRT',
    parameters: '32.5 Billion',
    contextWindow: '131k Tokens',
    quantization: 'FP8 E4M3',
    tokensPerSec: 72.4,
    memoryUsage: '31.2 GB / 48 GB VRAM',
    status: 'online',
    description: 'Blazing fast syntax analyzer and automated patch generation engine with 92+ HumanEval pass rate.',
  },
];

export const mockRepositories: RepositoryInfo[] = [
  {
    id: 'vllm-project/vllm',
    name: 'vllm',
    owner: 'vllm-project',
    branch: 'main',
    commitHash: 'a8f7e2d9',
    stars: 38400,
    forks: 6200,
    openPRs: 84,
    ciStatus: 'passing',
    description: 'A high-throughput and memory-efficient inference and serving engine for LLMs.',
    language: 'Rust / C++ / Python',
    license: 'Apache 2.0',
  },
  {
    id: 'triton-inference-server/server',
    name: 'server',
    owner: 'triton-inference-server',
    branch: 'main',
    commitHash: 'f419c80b',
    stars: 12400,
    forks: 3100,
    openPRs: 42,
    ciStatus: 'running',
    description: 'NVIDIA Triton Inference Server providing high-performance production serving.',
    language: 'C++ / CUDA',
    license: 'BSD-3-Clause',
  },
  {
    id: 'tokio-rs/axum',
    name: 'axum',
    owner: 'tokio-rs',
    branch: 'main',
    commitHash: '39c1b7e4',
    stars: 19800,
    forks: 1400,
    openPRs: 23,
    ciStatus: 'passing',
    description: 'Ergonomic and modular web framework built with Tokio, Tower, and Hyper.',
    language: 'Rust',
    license: 'MIT',
  },
];

export const mockFileTree: FileTreeNode[] = [
  {
    id: 'root-src',
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      {
        id: 'cache-dir',
        name: 'cache',
        path: 'src/cache',
        type: 'folder',
        children: [
          {
            id: 'paged-allocator',
            name: 'paged_allocator.rs',
            path: 'src/cache/paged_allocator.rs',
            type: 'file',
            size: '18.4 KB',
            lines: 482,
            complexity: 'high',
            hasAiInsight: true,
            language: 'rust',
          },
          {
            id: 'kv-cache-manager',
            name: 'kv_cache_manager.rs',
            path: 'src/cache/kv_cache_manager.rs',
            type: 'file',
            size: '24.1 KB',
            lines: 620,
            complexity: 'critical',
            hasAiInsight: true,
            language: 'rust',
          },
          {
            id: 'eviction-policy',
            name: 'eviction_policy.rs',
            path: 'src/cache/eviction_policy.rs',
            type: 'file',
            size: '12.8 KB',
            lines: 340,
            complexity: 'medium',
            hasAiInsight: false,
            language: 'rust',
          },
        ],
      },
      {
        id: 'engine-dir',
        name: 'engine',
        path: 'src/engine',
        type: 'folder',
        children: [
          {
            id: 'scheduler-cpp',
            name: 'scheduler.cpp',
            path: 'src/engine/scheduler.cpp',
            type: 'file',
            size: '38.2 KB',
            lines: 940,
            complexity: 'critical',
            hasAiInsight: true,
            language: 'cpp',
          },
          {
            id: 'batch-builder',
            name: 'batch_builder.cpp',
            path: 'src/engine/batch_builder.cpp',
            type: 'file',
            size: '19.0 KB',
            lines: 512,
            complexity: 'high',
            hasAiInsight: false,
            language: 'cpp',
          },
          {
            id: 'async-executor',
            name: 'async_executor.rs',
            path: 'src/engine/async_executor.rs',
            type: 'file',
            size: '15.6 KB',
            lines: 410,
            complexity: 'medium',
            hasAiInsight: true,
            language: 'rust',
          },
        ],
      },
      {
        id: 'runtime-dir',
        name: 'runtime',
        path: 'src/runtime',
        type: 'folder',
        children: [
          {
            id: 'worker-pool',
            name: 'worker_pool.rs',
            path: 'src/runtime/worker_pool.rs',
            type: 'file',
            size: '22.3 KB',
            lines: 574,
            complexity: 'medium',
            hasAiInsight: false,
            language: 'rust',
          },
          {
            id: 'cuda-interop',
            name: 'cuda_interop.cu',
            path: 'src/runtime/cuda_interop.cu',
            type: 'file',
            size: '31.5 KB',
            lines: 830,
            complexity: 'high',
            hasAiInsight: true,
            language: 'cuda',
          },
        ],
      },
      {
        id: 'api-dir',
        name: 'api',
        path: 'src/api',
        type: 'folder',
        children: [
          {
            id: 'openai-routes',
            name: 'openai_routes.rs',
            path: 'src/api/openai_routes.rs',
            type: 'file',
            size: '14.2 KB',
            lines: 390,
            complexity: 'low',
            hasAiInsight: false,
            language: 'rust',
          },
          {
            id: 'streaming-sse',
            name: 'streaming_sse.rs',
            path: 'src/api/streaming_sse.rs',
            type: 'file',
            size: '11.8 KB',
            lines: 280,
            complexity: 'low',
            hasAiInsight: false,
            language: 'rust',
          },
        ],
      },
    ],
  },
  {
    id: 'root-config',
    name: 'config',
    path: 'config',
    type: 'folder',
    children: [
      {
        id: 'defaults-yaml',
        name: 'defaults.yaml',
        path: 'config/defaults.yaml',
        type: 'file',
        size: '4.2 KB',
        lines: 110,
        complexity: 'low',
        hasAiInsight: true,
        language: 'yaml',
      },
      {
        id: 'cluster-spec',
        name: 'cluster_spec.json',
        path: 'config/cluster_spec.json',
        type: 'file',
        size: '6.8 KB',
        lines: 195,
        complexity: 'low',
        hasAiInsight: false,
        language: 'json',
      },
    ],
  },
  {
    id: 'root-dockerfile',
    name: 'Dockerfile',
    path: 'Dockerfile',
    type: 'file',
    size: '2.1 KB',
    lines: 65,
    complexity: 'low',
    hasAiInsight: false,
    language: 'dockerfile',
  },
  {
    id: 'root-cargo-toml',
    name: 'Cargo.toml',
    path: 'Cargo.toml',
    type: 'file',
    size: '3.4 KB',
    lines: 95,
    complexity: 'low',
    hasAiInsight: false,
    language: 'toml',
  },
];

export const mockArchitectureNodes: ArchitectureNode[] = [
  {
    id: 'node-ingress',
    name: 'HTTP / gRPC Ingress',
    type: 'input',
    role: 'API Request Serialization & Stream Handlers',
    latencyMs: 1.2,
    memoryMb: 120,
    throughput: '12,400 req/s',
    status: 'healthy',
    dependencies: ['node-tokenizer'],
    description: 'High-throughput Tokio event loop parsing OpenAI-compatible JSON and gRPC protobuf payloads with zero-copy buffer slices.',
    techStack: ['Axum', 'Hyper', 'Protobuf'],
  },
  {
    id: 'node-tokenizer',
    name: 'Fast BPE Tokenizer Engine',
    type: 'processing',
    role: 'Subword Encoding & Prompt Padding',
    latencyMs: 0.8,
    memoryMb: 450,
    throughput: '3.2M tokens/s',
    status: 'healthy',
    dependencies: ['node-scheduler'],
    description: 'HuggingFace Tokenizers Rust crate integrated with AVX-512 vectorization and thread-safe vocabulary cache.',
    techStack: ['Rust', 'AVX-512', 'Rayon'],
  },
  {
    id: 'node-scheduler',
    name: 'Continuous Dynamic Batcher',
    type: 'compute',
    role: 'Iteration-level Sequence Scheduling',
    latencyMs: 2.4,
    memoryMb: 890,
    throughput: '2,800 active seqs',
    status: 'optimizing',
    dependencies: ['node-cache', 'node-kernel'],
    description: 'Preemption-aware priority queue dynamically interleaving prompt prefill and generation decode steps without pipeline stalls.',
    techStack: ['C++20', 'Lock-Free RingQueue'],
  },
  {
    id: 'node-cache',
    name: 'Paged KV-Cache Manager',
    type: 'memory',
    role: 'Non-contiguous GPU Block Allocator',
    latencyMs: 0.4,
    memoryMb: 36800,
    throughput: '1.4 TB/s Mem BW',
    status: 'warning',
    dependencies: ['node-kernel'],
    description: 'Virtual-memory inspired paging system dividing Key-Value tensors into 16-token physical blocks, eliminating external fragmentation.',
    techStack: ['CUDA Unified Memory', 'Rust FFI'],
  },
  {
    id: 'node-kernel',
    name: 'FlashAttention-3 Tensor Core Engine',
    type: 'compute',
    role: 'Fused Multi-Head Attention Compute',
    latencyMs: 18.6,
    memoryMb: 8200,
    throughput: '890 TFLOPS (FP8)',
    status: 'healthy',
    dependencies: ['node-sampler'],
    description: 'Custom Triton & CUDA warp-specialized kernels running asynchronous Hopper tensor memory accelerator (TMA) loads.',
    techStack: ['Triton', 'CUDA 12.4', 'CUTLASS'],
  },
  {
    id: 'node-sampler',
    name: 'Parallel Nucleus Sampler',
    type: 'output',
    role: 'Logit Softmax, Top-K/Top-P & Token Emission',
    latencyMs: 1.1,
    memoryMb: 310,
    throughput: '48.2 tok/s/user',
    status: 'healthy',
    dependencies: [],
    description: 'GPU-side greedy and stochastic sampling with temperature scaling and frequency penalties streamed back via chunked SSE.',
    techStack: ['CUDA C++', 'Tokio MPSC'],
  },
];

export const mockArchitecturalInsights: ArchitecturalInsight[] = [
  {
    id: 'insight-1',
    title: 'High Mutex Contention during Concurrent Chunk Allocation',
    severity: 'critical',
    module: 'src/cache/paged_allocator.rs',
    description: 'The global free-block allocation lock is held across the entire reclamation loop. Under 500+ concurrent decode streams, tail latency p99 degrades by 340%.',
    impact: 'Elevated p99 latency spike (from 14ms to 62ms) under saturating workloads.',
    recommendation: 'Replace global std::sync::Mutex with per-NUMA thread-local free lists and crossbeam-epoch lock-free reclamation.',
    modelConfidence: 96,
  },
  {
    id: 'insight-2',
    title: 'Zero-Copy Buffer Sharing Opportunity in Triton Kernel Bridge',
    severity: 'optimization',
    module: 'src/runtime/cuda_interop.cu',
    description: 'Host-to-device memory copy for attention metadata can be bypassed by utilizing unified pinned host memory and asynchronous cudaMemcpyAsync.',
    impact: 'Saves 1.8ms per batch generation step, increasing throughput by ~11.2%.',
    recommendation: 'Enable cudaHostAllocMapped flag on tensor metadata pools.',
    modelConfidence: 91,
  },
  {
    id: 'insight-3',
    title: 'Divergent Error Semantics between C++ Scheduler and Rust API',
    severity: 'warning',
    module: 'src/engine/scheduler.cpp',
    description: 'Scheduler throws raw std::runtime_error on queue saturation, which unwinds across the C FFI boundary, risking undefined behavior.',
    impact: 'Potential process abort under unexpected memory pressure.',
    recommendation: 'Wrap FFI boundary with catch (...) and map to Result<ScheduledBatch, EngineErrorCode>.',
    modelConfidence: 98,
  },
];

export const mockOnboardingSteps: OnboardingStep[] = [
  {
    id: 'step-1',
    title: 'Initialize Toolchain & CUDA SDK',
    description: 'Ensure Rust 1.82+, Clang 18, and CUDA Toolkit 12.4+ are present in your local environment.',
    command: 'rustup default 1.82.0 && nvcc --version',
    completed: true,
    category: 'environment',
    timeEstimate: '5 mins',
  },
  {
    id: 'step-2',
    title: 'Configure Clang-Tidy & Cargo Clippy Git Hooks',
    description: 'Install strict pre-commit hooks enforcing zero unsafe leaks and Google C++ / Rust API guidelines.',
    command: 'git config core.hooksPath .githooks && cargo install cargo-deny',
    completed: true,
    category: 'environment',
    timeEstimate: '3 mins',
  },
  {
    id: 'step-3',
    title: 'Run Synthetic End-to-End Test Harness',
    description: 'Execute the mock GPU memory stress test verifying paged allocator block stability.',
    command: 'cargo test --test cache_stress -- --nocapture',
    completed: false,
    category: 'testing',
    timeEstimate: '8 mins',
  },
  {
    id: 'step-4',
    title: 'Simulate High-Concurrency Load with Locust/wrk',
    description: 'Spin up 200 virtual clients against the local dummy OpenAI endpoint on port 8080.',
    command: 'python3 benchmarks/benchmark_serving.py --num-prompts 500',
    completed: false,
    category: 'testing',
    timeEstimate: '10 mins',
  },
  {
    id: 'step-5',
    title: 'Review Memory Safety & Lock Ordering Manifesto',
    description: 'Read docs/architecture/LOCK_ORDERING.md before submitting PRs modifying cache or scheduler.',
    completed: false,
    category: 'conventions',
    timeEstimate: '15 mins',
  },
];

export const mockCodeConventions: CodeConvention[] = [
  {
    rule: 'Never hold Mutex across .await points',
    description: 'Tokio async tasks scheduled on multi-threaded runtimes can yield while holding OS Mutexes, causing starvation or deadlocks.',
    exampleGood: 'let value = { state.lock().unwrap().get_val() }; do_async_work().await;',
    exampleBad: 'let guard = state.lock().unwrap(); do_async_work().await;',
    category: 'async',
  },
  {
    rule: 'Explicit FFI Boundary Exception Handling',
    description: 'C++ exceptions must never cross foreign function interfaces into Rust. Unwinding through foreign stack frames is undefined behavior.',
    exampleGood: 'try { return execute(); } catch (...) { return ERR_INTERNAL; }',
    exampleBad: 'return execute(); // throws std::runtime_error directly into extern "C"',
    category: 'api',
  },
  {
    rule: 'Strict Pinned Memory Deallocation',
    description: 'All CUDA device allocations must be tracked in the RAII BlockManager to prevent VRAM fragmentation during unexpected client disconnects.',
    exampleGood: 'let _guard = PagedBlockGuard::new(block_id, &allocator);',
    exampleBad: 'let block = allocator.raw_alloc(size); // unprotected if error occurs',
    category: 'memory',
  },
];

export const mockPullRequest: PullRequest = {
  id: 1482,
  title: 'feat(cache): implement paged KV-cache chunk reclamation to prevent OOM under high concurrency',
  author: {
    name: 'Elena Rostova',
    handle: 'erostova-sys',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  sourceBranch: 'feat/paged-kv-reclaim',
  targetBranch: 'main',
  createdAt: '2 hours ago',
  status: 'open',
  checksPassed: 18,
  totalChecks: 19,
  files: [
    {
      id: 'diff-paged-allocator',
      filename: 'src/cache/paged_allocator.rs',
      status: 'modified',
      additions: 42,
      deletions: 18,
      lines: [
        { type: 'header', content: '@@ -142,18 +142,42 @@ impl PagedBlockAllocator {' },
        { type: 'context', oldLineNumber: 142, newLineNumber: 142, content: '     pub fn allocate_block(&self, seq_id: u64) -> Result<BlockId, AllocError> {' },
        { type: 'context', oldLineNumber: 143, newLineNumber: 143, content: '         let mut pool = self.free_pool.lock().unwrap();' },
        { type: 'delete', oldLineNumber: 144, content: '         if pool.is_empty() {' },
        { type: 'delete', oldLineNumber: 145, content: '             return Err(AllocError::OutOfMemory);' },
        { type: 'delete', oldLineNumber: 146, content: '         }' },
        { type: 'delete', oldLineNumber: 147, content: '         let block_id = pool.pop().unwrap();' },
        { type: 'add', newLineNumber: 144, content: '         if pool.is_empty() {' },
        { type: 'add', newLineNumber: 145, content: '             // Trigger opportunistic lazy reclamation across idle sequences' },
        { type: 'add', newLineNumber: 146, content: '             log::warn!("Free pool exhausted; triggering paged reclamation for seq={}", seq_id);' },
        { type: 'add', newLineNumber: 147, content: '             self.reclaim_idle_pages(&mut pool, 16);' },
        { type: 'add', newLineNumber: 148, content: '         }' },
        { type: 'add', newLineNumber: 149, content: '         ' },
        {
          type: 'add',
          newLineNumber: 150,
          content: '         let block_id = pool.pop().ok_or(AllocError::OutOfMemory)?;',
          annotation: {
            severity: 'warning',
            rule: 'LOCK_CONTENTION_RISK',
            message: 'Holding `free_pool` Mutex lock during `reclaim_idle_pages` causes severe thread stalls when multiple workers run out of pages simultaneously.',
          },
        },
        { type: 'context', oldLineNumber: 148, newLineNumber: 151, content: '         self.active_allocations.insert(block_id, seq_id);' },
        { type: 'context', oldLineNumber: 149, newLineNumber: 152, content: '         Ok(block_id)' },
        { type: 'context', oldLineNumber: 150, newLineNumber: 153, content: '     }' },
        { type: 'header', content: '@@ -210,12 +234,32 @@ impl PagedBlockAllocator {' },
        { type: 'context', oldLineNumber: 210, newLineNumber: 234, content: '     pub fn reclaim_idle_pages(&self, pool: &mut Vec<BlockId>, target: usize) -> usize {' },
        { type: 'delete', oldLineNumber: 211, content: '         // previous synchronous purge' },
        { type: 'delete', oldLineNumber: 212, content: '         0' },
        { type: 'add', newLineNumber: 235, content: '         let mut reclaimed = 0;' },
        { type: 'add', newLineNumber: 236, content: '         let mut candidates = self.lru_tracker.lock().unwrap();' },
        {
          type: 'add',
          newLineNumber: 237,
          content: '         while reclaimed < target && let Some(block) = candidates.pop_front() {',
          annotation: {
            severity: 'critical',
            rule: 'POTENTIAL_DEADLOCK',
            message: 'Cyclic lock acquisition: `free_pool` lock is already held by caller; acquiring `lru_tracker` here reverses the global lock hierarchy defined in LOCK_ORDERING.md.',
          },
        },
        { type: 'add', newLineNumber: 238, content: '             pool.push(block);' },
        { type: 'add', newLineNumber: 239, content: '             reclaimed += 1;' },
        { type: 'add', newLineNumber: 240, content: '         }' },
        { type: 'add', newLineNumber: 241, content: '         reclaimed' },
        { type: 'context', oldLineNumber: 213, newLineNumber: 242, content: '     }' },
      ],
    },
    {
      id: 'diff-scheduler-cpp',
      filename: 'src/engine/scheduler.cpp',
      status: 'modified',
      additions: 15,
      deletions: 4,
      lines: [
        { type: 'header', content: '@@ -88,4 +88,15 @@ void Scheduler::scheduleNextBatch() {' },
        { type: 'context', oldLineNumber: 88, newLineNumber: 88, content: '     std::vector<SequenceGroup*> selected;' },
        { type: 'delete', oldLineNumber: 89, content: '     if (allocator_->getFreeBlocks() < min_reserve_) return;' },
        { type: 'add', newLineNumber: 89, content: '     if (allocator_->getFreeBlocks() < min_reserve_) {' },
        { type: 'add', newLineNumber: 90, content: '         // Allow speculative batching if preemption queue is empty' },
        { type: 'add', newLineNumber: 91, content: '         if (preemptionQueue_.empty()) {' },
        { type: 'add', newLineNumber: 92, content: '             LOG(INFO) << "Speculative scheduling triggered with reserve: " << min_reserve_;' },
        { type: 'add', newLineNumber: 93, content: '         } else {' },
        { type: 'add', newLineNumber: 94, content: '             return;' },
        { type: 'add', newLineNumber: 95, content: '         }' },
        { type: 'add', newLineNumber: 96, content: '     }' },
        { type: 'context', oldLineNumber: 90, newLineNumber: 97, content: '     dispatchToCudaStreams(selected);' },
      ],
    },
    {
      id: 'diff-defaults-yaml',
      filename: 'config/defaults.yaml',
      status: 'modified',
      additions: 6,
      deletions: 2,
      lines: [
        { type: 'header', content: '@@ -24,4 +24,8 @@ cache_engine:' },
        { type: 'context', oldLineNumber: 24, newLineNumber: 24, content: '   block_size: 16' },
        { type: 'delete', oldLineNumber: 25, content: '   gpu_memory_utilization: 0.90' },
        { type: 'add', newLineNumber: 25, content: '   gpu_memory_utilization: 0.94' },
        { type: 'add', newLineNumber: 26, content: '   enable_lazy_page_reclamation: true' },
        { type: 'add', newLineNumber: 27, content: '   reclamation_batch_target: 32' },
        { type: 'context', oldLineNumber: 26, newLineNumber: 28, content: '   swap_space_gb: 4' },
      ],
    },
  ],
};

export const mockAIDiagnosticReport: AIDiagnosticReport = {
  prId: 1482,
  modelName: 'Llama 3.3 70B (Meta-Llama-3.3-70B-Instruct)',
  timestamp: 'Just now (cached AST graph)',
  issueSummary:
    'PR #1482 attempts to resolve Out-Of-Memory thrashing by adding lazy page reclamation. However, it introduces an inverted lock hierarchy (`free_pool` -> `lru_tracker`) creating a deterministic deadlock under concurrent high-throughput workloads, alongside elevated tail latency due to holding Mutex guards across container iteration.',
  rootCauseAnalysis: [
    'Lock Order Inversion: `allocate_block` acquires `self.free_pool` lock first, then calls `reclaim_idle_pages` which acquires `self.lru_tracker`. Elsewhere in `evict_expired()`, `lru_tracker` is acquired before `free_pool`. Under concurrent multi-threaded sequence completion, threads will deadlock.',
    'Granularity Bottleneck: The global free pool lock is held while popping 16 elements from the candidate queue, stalling other threads trying to allocate ordinary blocks.',
    'Unchecked Speculative Dispatch: In `scheduler.cpp:91`, scheduling sequences without checking memory headroom can push VRAM usage above 98%, risking driver-level CUDA OOM aborts.',
  ],
  riskMetrics: {
    overallRisk: 'High',
    score: 78,
    technicalDebtDeltaMinutes: -45, // Saves 45m of future debugging if resolved now
    memorySafetyScore: 68,
    concurrencyHazardIndex: 89,
    testCoverageRisk: 42,
  },
  suggestedPatches: [
    {
      id: 'patch-1',
      filePath: 'src/cache/paged_allocator.rs',
      description: 'Acquire `lru_tracker` first outside the `free_pool` lock scope, drain candidates into a temporary local buffer, and batch-insert without nested locking.',
      patchCode: `// Proposed Zero-Contention Fix:
pub fn allocate_block(&self, seq_id: u64) -> Result<BlockId, AllocError> {
    // 1. Fast-path allocation attempt
    {
        let mut pool = self.free_pool.lock().unwrap();
        if let Some(block_id) = pool.pop() {
            self.active_allocations.insert(block_id, seq_id);
            return Ok(block_id);
        }
    } // Drop free_pool lock immediately before reclamation

    // 2. Slow-path: Reclaim pages with correct lock hierarchy (LRU -> Pool)
    let reclaimed_blocks = self.reclaim_idle_pages_unlocked(16);
    if reclaimed_blocks.is_empty() {
        return Err(AllocError::OutOfMemory);
    }

    let mut pool = self.free_pool.lock().unwrap();
    let block_id = reclaimed_blocks[0];
    // Return remaining reclaimed blocks to pool in batch
    pool.extend(&reclaimed_blocks[1..]);
    self.active_allocations.insert(block_id, seq_id);
    Ok(block_id)
}`,
      rationale:
        'Eliminates nested mutex acquisition, conforms strictly to LOCK_ORDERING.md hierarchy, and reduces lock hold time from ~320μs down to <12μs.',
      applied: false,
    },
  ],
  securityAudits: [
    {
      category: 'Concurrency Safety',
      passed: false,
      details: 'Detected ABBA deadlock hazard between Mutex<free_pool> and Mutex<lru_tracker>.',
    },
    {
      category: 'Memory Bounds & Safety',
      passed: true,
      details: 'All block indices are verified against MaxPhysicalBlocks (65536). No buffer overflows.',
    },
    {
      category: 'Resource Leak Prevention',
      passed: true,
      details: 'RAII PagedBlockGuard ensures dropped streams reclaim active VRAM blocks automatically.',
    },
    {
      category: 'Regression Guard',
      passed: false,
      details: 'CI test `test_high_concurrency_400_streams` failed with timeout (deadlock reproduction).',
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

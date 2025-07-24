// Database Models for Netlify Clone

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  githubConnected: boolean;
  githubUsername?: string;
  githubToken?: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  plan: "free" | "pro" | "business" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: "owner" | "admin" | "editor" | "viewer";
  joinedAt: Date;
  invitedBy: string;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  description?: string;
  teamId: string;
  ownerId: string;

  // Git Configuration
  gitProvider: "github" | "gitlab" | "bitbucket" | null;
  gitRepo?: string;
  gitBranch: string;

  // Build Configuration
  buildCommand?: string;
  publishDirectory: string;
  nodeVersion: string;
  environmentVariables: Record<string, string>;

  // Domain Configuration
  defaultDomain: string; // site-name.appstop.pro
  customDomains: string[];

  // Status
  status: "active" | "paused" | "archived";
  deployStatus: "idle" | "building" | "deployed" | "failed";
  lastDeployAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface Build {
  id: string;
  siteId: string;
  deployId: string;

  // Build Info
  branch: string;
  commitSha?: string;
  commitMessage?: string;
  buildCommand?: string;
  publishDirectory: string;

  // Status
  status: "pending" | "building" | "success" | "failed" | "cancelled";
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in seconds

  // Logs and Output
  buildLogs: string;
  errorMessage?: string;

  // Trigger Info
  triggeredBy: "webhook" | "manual" | "api";
  triggeredByUser?: string;

  createdAt: Date;
}

export interface Deploy {
  id: string;
  siteId: string;
  buildId?: string;

  // Deploy Info
  url: string;
  branch: string;
  commitSha?: string;
  commitMessage?: string;

  // Status
  status: "pending" | "building" | "ready" | "failed" | "cancelled";
  published: boolean;

  // File Info
  filesCount: number;
  totalSize: number; // in bytes

  // Preview
  isPreview: boolean;
  previewUrl?: string;

  createdAt: Date;
  publishedAt?: Date;
}

export interface Domain {
  id: string;
  siteId: string;
  domain: string;

  // SSL Configuration
  sslEnabled: boolean;
  sslStatus: "pending" | "active" | "failed" | "expired";
  sslCertificate?: string;
  sslExpiresAt?: Date;

  // DNS Configuration
  dnsStatus: "pending" | "configured" | "failed";
  dnsRecords: DNSRecord[];

  // Status
  status: "pending" | "active" | "failed";
  verifiedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface DNSRecord {
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT";
  name: string;
  value: string;
  ttl: number;
}

export interface Webhook {
  id: string;
  siteId: string;
  url: string;
  events: WebhookEvent[];
  secret?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type WebhookEvent =
  | "deploy_created"
  | "deploy_building"
  | "deploy_ready"
  | "deploy_failed"
  | "deploy_cancelled";

export interface Notification {
  id: string;
  userId: string;
  teamId?: string;
  siteId?: string;

  type:
    | "deploy_success"
    | "deploy_failed"
    | "team_invite"
    | "domain_configured"
    | "ssl_renewed";
  title: string;
  message: string;
  data?: Record<string, any>;

  read: boolean;
  createdAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  siteId: string;
  type: "page_view" | "form_submission" | "function_invocation";
  timestamp: Date;
  data: Record<string, any>;
}

// API Request/Response Types

export interface CreateSiteRequest {
  name: string;
  teamId: string;
  gitRepo?: string;
  gitBranch?: string;
  buildCommand?: string;
  publishDirectory?: string;
}

export interface CreateSiteResponse {
  success: boolean;
  site?: Site;
  error?: string;
}

export interface TriggerBuildRequest {
  siteId: string;
  branch?: string;
  commitSha?: string;
  clear_cache?: boolean;
}

export interface TriggerBuildResponse {
  success: boolean;
  build?: Build;
  error?: string;
}

export interface GetBuildsResponse {
  success: boolean;
  builds: Build[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UpdateSiteRequest {
  name?: string;
  description?: string;
  buildCommand?: string;
  publishDirectory?: string;
  nodeVersion?: string;
  environmentVariables?: Record<string, string>;
}

export interface TeamInviteRequest {
  email: string;
  role: "admin" | "editor" | "viewer";
}

export interface TeamInviteResponse {
  success: boolean;
  invite?: {
    id: string;
    email: string;
    role: string;
    expiresAt: Date;
  };
  error?: string;
}

export interface GitHubWebhookPayload {
  ref: string;
  repository: {
    full_name: string;
    default_branch: string;
  };
  head_commit: {
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
  };
  commits: Array<{
    id: string;
    message: string;
    added: string[];
    modified: string[];
    removed: string[];
  }>;
}

// Build System Types

export interface BuildContext {
  siteId: string;
  buildId: string;
  site: Site;

  // Source
  gitRepo?: string;
  gitBranch: string;
  commitSha?: string;

  // Build Config
  buildCommand?: string;
  publishDirectory: string;
  nodeVersion: string;
  environmentVariables: Record<string, string>;

  // Paths
  workspaceDir: string;
  outputDir: string;

  // Callbacks
  onLog: (message: string) => void;
  onProgress: (step: string, progress: number) => void;
  onComplete: (success: boolean, error?: string) => void;
}

export interface BuildStep {
  name: string;
  status: "pending" | "running" | "success" | "failed" | "skipped";
  startTime?: Date;
  endTime?: Date;
  logs: string[];
  error?: string;
}

export interface BuildResult {
  success: boolean;
  steps: BuildStep[];
  outputPath?: string;
  filesCount?: number;
  totalSize?: number;
  duration: number;
  error?: string;
}

// Frontend Framework Detection
export interface FrameworkDetection {
  framework:
    | "react"
    | "vue"
    | "angular"
    | "svelte"
    | "next"
    | "nuxt"
    | "gatsby"
    | "vite"
    | "static"
    | "unknown";
  buildCommand: string;
  publishDirectory: string;
  installCommand: string;
  devCommand?: string;
  confidence: number; // 0-1
}

// Josey AI Assistant Types
export interface JoseyBuildAnalysis {
  issues: BuildIssue[];
  suggestions: BuildSuggestion[];
  optimizations: BuildOptimization[];
  frameworkDetection?: FrameworkDetection;
}

export interface BuildIssue {
  type: "error" | "warning" | "info";
  category: "dependency" | "configuration" | "build" | "deployment";
  message: string;
  solution?: string;
  documentation?: string;
}

export interface BuildSuggestion {
  type: "performance" | "security" | "best-practice" | "optimization";
  title: string;
  description: string;
  implementation?: string;
  impact: "low" | "medium" | "high";
}

export interface BuildOptimization {
  name: string;
  description: string;
  estimatedSavings: string; // e.g., "30% faster builds"
  difficulty: "easy" | "medium" | "hard";
  steps: string[];
}

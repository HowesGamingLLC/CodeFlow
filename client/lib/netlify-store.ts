import { create } from "zustand";
import {
  User,
  Team,
  Site,
  Build,
  Deploy,
  Domain,
  Notification,
  TeamMember,
  CreateSiteRequest,
  TriggerBuildRequest,
} from "@shared/netlify-types";

export interface NetlifyState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  currentTeam: Team | null;
  teams: Team[];
  teamMembers: TeamMember[];

  // Sites
  sites: Site[];
  currentSite: Site | null;
  builds: Build[];
  deploys: Deploy[];
  domains: Domain[];

  // UI State
  loading: boolean;
  error: string | null;
  notifications: Notification[];
  unreadCount: number;

  // Dashboard
  dashboardStats: {
    totalSites: number;
    totalBuilds: number;
    successfulBuilds: number;
    failedBuilds: number;
    totalBandwidth: number;
    totalRequests: number;
  };

  // Build Logs (real-time)
  buildLogs: Record<string, string[]>;
  activeBuild: string | null;

  // Actions

  // Authentication
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;

  // Teams
  createTeam: (name: string, description?: string) => Promise<boolean>;
  switchTeam: (teamId: string) => void;
  inviteTeamMember: (email: string, role: string) => Promise<boolean>;
  removeTeamMember: (memberId: string) => Promise<boolean>;
  updateTeamMemberRole: (memberId: string, role: string) => Promise<boolean>;

  // Sites
  createSite: (siteData: CreateSiteRequest) => Promise<boolean>;
  updateSite: (siteId: string, updates: Partial<Site>) => Promise<boolean>;
  deleteSite: (siteId: string) => Promise<boolean>;
  loadSites: () => Promise<void>;
  selectSite: (siteId: string) => void;

  // Builds & Deploys
  triggerBuild: (buildData: TriggerBuildRequest) => Promise<boolean>;
  cancelBuild: (buildId: string) => Promise<boolean>;
  retryBuild: (buildId: string) => Promise<boolean>;
  loadBuilds: (siteId: string) => Promise<void>;
  loadDeploys: (siteId: string) => Promise<void>;

  // Domains
  addCustomDomain: (siteId: string, domain: string) => Promise<boolean>;
  removeCustomDomain: (domainId: string) => Promise<boolean>;
  verifyDomain: (domainId: string) => Promise<boolean>;

  // Real-time Build Logs
  connectBuildLogs: (buildId: string) => void;
  disconnectBuildLogs: (buildId: string) => void;
  addBuildLog: (buildId: string, message: string) => void;
  clearBuildLogs: (buildId: string) => void;

  // Notifications
  loadNotifications: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // GitHub Integration
  connectGitHub: () => Promise<boolean>;
  disconnectGitHub: () => Promise<boolean>;
  loadGitHubRepos: () => Promise<any[]>;

  // Analytics
  loadDashboardStats: () => Promise<void>;
  loadSiteAnalytics: (siteId: string, period: string) => Promise<any>;

  // Environment Variables
  updateEnvironmentVariables: (
    siteId: string,
    variables: Record<string, string>,
  ) => Promise<boolean>;

  // Webhooks
  createWebhook: (
    siteId: string,
    url: string,
    events: string[],
  ) => Promise<boolean>;
  updateWebhook: (webhookId: string, updates: any) => Promise<boolean>;
  deleteWebhook: (webhookId: string) => Promise<boolean>;

  // Error Handling
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data for development
const mockUser: User = {
  id: "user-1",
  email: "coinkrazy00@gmail.com",
  name: "Spin Bigz",
  passwordHash: "",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  githubConnected: true,
  githubUsername: "spinbigz",
};

const mockTeam: Team = {
  id: "team-1",
  name: "CoinKrazy Team",
  slug: "coinkrizy-team",
  description: "Main development team for CoinKrazy projects",
  plan: "pro",
  createdAt: new Date(),
  updatedAt: new Date(),
  ownerId: "user-1",
};

const mockSites: Site[] = [
  {
    id: "site-1",
    name: "CoinKrazy Frontend",
    slug: "coinkrizy-frontend",
    description: "Main CoinKrazy application frontend",
    teamId: "team-1",
    ownerId: "user-1",
    gitProvider: "github",
    gitRepo: "spinbigz/coinkrizy-frontend",
    gitBranch: "main",
    buildCommand: "npm run build",
    publishDirectory: "dist",
    nodeVersion: "18.x",
    environmentVariables: {
      NODE_ENV: "production",
      REACT_APP_API_URL: "https://api.coinkrizy.com",
    },
    defaultDomain: "coinkrizy-frontend.appstop.pro",
    customDomains: ["coinkrizy.com", "www.coinkrizy.com"],
    status: "active",
    deployStatus: "deployed",
    lastDeployAt: new Date(Date.now() - 1000 * 60 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(),
  },
  {
    id: "site-2",
    name: "Marketing Site",
    slug: "marketing-site",
    description: "CoinKrazy marketing and landing pages",
    teamId: "team-1",
    ownerId: "user-1",
    gitProvider: "github",
    gitRepo: "spinbigz/coinkrizy-marketing",
    gitBranch: "main",
    buildCommand: "npm run build",
    publishDirectory: "dist",
    nodeVersion: "18.x",
    environmentVariables: {
      NODE_ENV: "production",
    },
    defaultDomain: "marketing-site.appstop.pro",
    customDomains: [],
    status: "active",
    deployStatus: "building",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(),
  },
];

const mockBuilds: Build[] = [
  {
    id: "build-1",
    siteId: "site-1",
    deployId: "deploy-1",
    branch: "main",
    commitSha: "abc123def456",
    commitMessage: "Update trading interface with new features",
    buildCommand: "npm run build",
    publishDirectory: "dist",
    status: "success",
    startedAt: new Date(Date.now() - 1000 * 60 * 35),
    completedAt: new Date(Date.now() - 1000 * 60 * 30),
    duration: 300,
    buildLogs:
      "Build started...\nInstalling dependencies...\nBuild completed successfully!",
    triggeredBy: "webhook",
    createdAt: new Date(Date.now() - 1000 * 60 * 35),
  },
  {
    id: "build-2",
    siteId: "site-2",
    deployId: "deploy-2",
    branch: "main",
    commitSha: "def456ghi789",
    commitMessage: "Fix responsive design issues",
    buildCommand: "npm run build",
    publishDirectory: "dist",
    status: "building",
    startedAt: new Date(Date.now() - 1000 * 60 * 5),
    buildLogs:
      "Build started...\nInstalling dependencies...\nRunning build command...",
    triggeredBy: "manual",
    triggeredByUser: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
];

export const useNetlifyStore = create<NetlifyState>((set, get) => ({
  // Initial state
  user: mockUser,
  isAuthenticated: true,
  currentTeam: mockTeam,
  teams: [mockTeam],
  teamMembers: [],
  sites: mockSites,
  currentSite: mockSites[0],
  builds: mockBuilds,
  deploys: [],
  domains: [],
  loading: false,
  error: null,
  notifications: [],
  unreadCount: 0,
  dashboardStats: {
    totalSites: 2,
    totalBuilds: 15,
    successfulBuilds: 12,
    failedBuilds: 3,
    totalBandwidth: 1250000,
    totalRequests: 45000,
  },
  buildLogs: {
    "build-2": [
      "Build started at " + new Date().toISOString(),
      "Installing dependencies...",
      "Running npm install...",
      "Dependencies installed successfully",
      "Running build command: npm run build",
      "Building application...",
    ],
  },
  activeBuild: "build-2",

  // Actions
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "coinkrazy00@gmail.com" && password === "Woot6969!") {
        set({
          user: mockUser,
          isAuthenticated: true,
          currentTeam: mockTeam,
          teams: [mockTeam],
          loading: false,
        });
        return true;
      } else {
        set({ error: "Invalid credentials", loading: false });
        return false;
      }
    } catch (error) {
      set({ error: "Login failed", loading: false });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      currentTeam: null,
      teams: [],
      sites: [],
      builds: [],
      deploys: [],
      notifications: [],
    });
  },

  register: async (name: string, email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        passwordHash: "",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        githubConnected: false,
      };

      set({
        user: newUser,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (error) {
      set({ error: "Registration failed", loading: false });
      return false;
    }
  },

  createTeam: async (name: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        plan: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: get().user?.id || "",
      };

      set((state) => ({
        teams: [...state.teams, newTeam],
        currentTeam: newTeam,
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to create team", loading: false });
      return false;
    }
  },

  switchTeam: (teamId: string) => {
    const team = get().teams.find((t) => t.id === teamId);
    if (team) {
      set({ currentTeam: team });
      // Reload sites for the new team
      get().loadSites();
    }
  },

  inviteTeamMember: async (email: string, role: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate sending invitation
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: "Failed to send invitation", loading: false });
      return false;
    }
  },

  removeTeamMember: async (memberId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        teamMembers: state.teamMembers.filter((m) => m.id !== memberId),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to remove team member", loading: false });
      return false;
    }
  },

  updateTeamMemberRole: async (memberId: string, role: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        teamMembers: state.teamMembers.map((m) =>
          m.id === memberId ? { ...m, role: role as any } : m,
        ),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to update role", loading: false });
      return false;
    }
  },

  createSite: async (siteData: CreateSiteRequest) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newSite: Site = {
        id: `site-${Date.now()}`,
        name: siteData.name,
        slug: siteData.name.toLowerCase().replace(/\s+/g, "-"),
        teamId: siteData.teamId,
        ownerId: get().user?.id || "",
        gitProvider: siteData.gitRepo ? "github" : null,
        gitRepo: siteData.gitRepo,
        gitBranch: siteData.gitBranch || "main",
        buildCommand: siteData.buildCommand,
        publishDirectory: siteData.publishDirectory || "dist",
        nodeVersion: "18.x",
        environmentVariables: {},
        defaultDomain: `${siteData.name.toLowerCase().replace(/\s+/g, "-")}.appstop.pro`,
        customDomains: [],
        status: "active",
        deployStatus: "idle",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => ({
        sites: [...state.sites, newSite],
        currentSite: newSite,
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to create site", loading: false });
      return false;
    }
  },

  updateSite: async (siteId: string, updates: Partial<Site>) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      set((state) => ({
        sites: state.sites.map((site) =>
          site.id === siteId
            ? { ...site, ...updates, updatedAt: new Date() }
            : site,
        ),
        currentSite:
          state.currentSite?.id === siteId
            ? { ...state.currentSite, ...updates, updatedAt: new Date() }
            : state.currentSite,
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to update site", loading: false });
      return false;
    }
  },

  deleteSite: async (siteId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => ({
        sites: state.sites.filter((site) => site.id !== siteId),
        currentSite:
          state.currentSite?.id === siteId ? null : state.currentSite,
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to delete site", loading: false });
      return false;
    }
  },

  loadSites: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      // Sites are already loaded with mock data
      set({ loading: false });
    } catch (error) {
      set({ error: "Failed to load sites", loading: false });
    }
  },

  selectSite: (siteId: string) => {
    const site = get().sites.find((s) => s.id === siteId);
    if (site) {
      set({ currentSite: site });
      // Load related data
      get().loadBuilds(siteId);
      get().loadDeploys(siteId);
    }
  },

  triggerBuild: async (buildData: TriggerBuildRequest) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newBuild: Build = {
        id: `build-${Date.now()}`,
        siteId: buildData.siteId,
        deployId: `deploy-${Date.now()}`,
        branch: buildData.branch || "main",
        commitSha: buildData.commitSha,
        buildCommand: get().currentSite?.buildCommand,
        publishDirectory: get().currentSite?.publishDirectory || "dist",
        status: "pending",
        buildLogs: "",
        triggeredBy: "manual",
        triggeredByUser: get().user?.id,
        createdAt: new Date(),
      };

      set((state) => ({
        builds: [newBuild, ...state.builds],
        activeBuild: newBuild.id,
        loading: false,
      }));

      // Simulate build progress
      setTimeout(() => {
        set((state) => ({
          builds: state.builds.map((b) =>
            b.id === newBuild.id
              ? { ...b, status: "building", startedAt: new Date() }
              : b,
          ),
        }));

        get().connectBuildLogs(newBuild.id);
      }, 1000);

      return true;
    } catch (error) {
      set({ error: "Failed to trigger build", loading: false });
      return false;
    }
  },

  cancelBuild: async (buildId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        builds: state.builds.map((b) =>
          b.id === buildId
            ? { ...b, status: "cancelled", completedAt: new Date() }
            : b,
        ),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to cancel build", loading: false });
      return false;
    }
  },

  retryBuild: async (buildId: string) => {
    const build = get().builds.find((b) => b.id === buildId);
    if (build) {
      return get().triggerBuild({
        siteId: build.siteId,
        branch: build.branch,
        commitSha: build.commitSha,
      });
    }
    return false;
  },

  loadBuilds: async (siteId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      // Builds are already loaded with mock data
      set({ loading: false });
    } catch (error) {
      set({ error: "Failed to load builds", loading: false });
    }
  },

  loadDeploys: async (siteId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      // Mock deploys data
      set({ loading: false });
    } catch (error) {
      set({ error: "Failed to load deploys", loading: false });
    }
  },

  addCustomDomain: async (siteId: string, domain: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => ({
        sites: state.sites.map((site) =>
          site.id === siteId
            ? { ...site, customDomains: [...site.customDomains, domain] }
            : site,
        ),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to add custom domain", loading: false });
      return false;
    }
  },

  removeCustomDomain: async (domainId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: "Failed to remove domain", loading: false });
      return false;
    }
  },

  verifyDomain: async (domainId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: "Domain verification failed", loading: false });
      return false;
    }
  },

  connectBuildLogs: (buildId: string) => {
    // Simulate real-time build logs
    const messages = [
      "Downloading source code...",
      "Installing dependencies with npm...",
      "Running build command: npm run build",
      "Compiling TypeScript files...",
      "Bundling assets with Vite...",
      "Optimizing images...",
      "Build completed successfully!",
      "Deploying to CDN...",
      "Deploy complete!",
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        get().addBuildLog(
          buildId,
          `[${new Date().toLocaleTimeString()}] ${messages[index]}`,
        );
        index++;
      } else {
        clearInterval(interval);
        // Mark build as successful
        set((state) => ({
          builds: state.builds.map((b) =>
            b.id === buildId
              ? {
                  ...b,
                  status: "success",
                  completedAt: new Date(),
                  duration: 180,
                }
              : b,
          ),
          activeBuild: null,
        }));
      }
    }, 1000);
  },

  disconnectBuildLogs: (buildId: string) => {
    // Clean up real-time connection
  },

  addBuildLog: (buildId: string, message: string) => {
    set((state) => ({
      buildLogs: {
        ...state.buildLogs,
        [buildId]: [...(state.buildLogs[buildId] || []), message],
      },
    }));
  },

  clearBuildLogs: (buildId: string) => {
    set((state) => ({
      buildLogs: {
        ...state.buildLogs,
        [buildId]: [],
      },
    }));
  },

  loadNotifications: async () => {
    // Mock notifications
  },

  markNotificationRead: async (notificationId: string) => {
    // Mock implementation
    return true;
  },

  markAllNotificationsRead: async () => {
    // Mock implementation
  },

  connectGitHub: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set((state) => ({
        user: state.user ? { ...state.user, githubConnected: true } : null,
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to connect GitHub", loading: false });
      return false;
    }
  },

  disconnectGitHub: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      set((state) => ({
        user: state.user ? { ...state.user, githubConnected: false } : null,
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to disconnect GitHub", loading: false });
      return false;
    }
  },

  loadGitHubRepos: async () => {
    // Mock GitHub repos
    return [
      { name: "coinkrizy-frontend", full_name: "spinbigz/coinkrizy-frontend" },
      { name: "coinkrizy-backend", full_name: "spinbigz/coinkrizy-backend" },
      { name: "coinkrizy-docs", full_name: "spinbigz/coinkrizy-docs" },
    ];
  },

  loadDashboardStats: async () => {
    // Stats are already loaded with mock data
  },

  loadSiteAnalytics: async (siteId: string, period: string) => {
    // Mock analytics data
    return {};
  },

  updateEnvironmentVariables: async (
    siteId: string,
    variables: Record<string, string>,
  ) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      set((state) => ({
        sites: state.sites.map((site) =>
          site.id === siteId
            ? { ...site, environmentVariables: variables }
            : site,
        ),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to update environment variables", loading: false });
      return false;
    }
  },

  createWebhook: async (siteId: string, url: string, events: string[]) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: "Failed to create webhook", loading: false });
      return false;
    }
  },

  updateWebhook: async (webhookId: string, updates: any) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: "Failed to update webhook", loading: false });
      return false;
    }
  },

  deleteWebhook: async (webhookId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: "Failed to delete webhook", loading: false });
      return false;
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));

import { RequestHandler } from "express";
import { z } from "zod";
import {
  CreateSiteRequest,
  TriggerBuildRequest,
  Site,
  Build,
  Team,
} from "@shared/netlify-types";

// Validation schemas
const createSiteSchema = z.object({
  name: z.string().min(1).max(50),
  teamId: z.string(),
  gitRepo: z.string().optional(),
  gitBranch: z.string().default("main"),
  buildCommand: z.string().optional(),
  publishDirectory: z.string().default("dist"),
});

const triggerBuildSchema = z.object({
  siteId: z.string(),
  branch: z.string().optional(),
  commitSha: z.string().optional(),
  clear_cache: z.boolean().optional(),
});

const updateSiteSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  buildCommand: z.string().optional(),
  publishDirectory: z.string().optional(),
  nodeVersion: z.string().optional(),
  environmentVariables: z.record(z.string()).optional(),
});

// Mock data store (in production, this would be a database)
let sites: Site[] = [];
let builds: Build[] = [];
let buildCounter = 0;

// Sites endpoints
export const createSite: RequestHandler = async (req, res) => {
  try {
    const siteData = createSiteSchema.parse(req.body) as CreateSiteRequest;

    const newSite: Site = {
      id: `site_${Date.now()}`,
      name: siteData.name,
      slug: siteData.name.toLowerCase().replace(/\s+/g, "-"),
      description: undefined,
      teamId: siteData.teamId,
      ownerId: "user-1", // TODO: Get from auth
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

    sites.push(newSite);

    res.json({
      success: true,
      site: newSite,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
};

export const getSites: RequestHandler = async (req, res) => {
  try {
    const teamId = req.query.teamId as string;

    const filteredSites = teamId
      ? sites.filter((site) => site.teamId === teamId)
      : sites;

    res.json({
      success: true,
      sites: filteredSites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch sites",
    });
  }
};

export const getSite: RequestHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const site = sites.find((s) => s.id === siteId);

    if (!site) {
      return res.status(404).json({
        success: false,
        error: "Site not found",
      });
    }

    res.json({
      success: true,
      site,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch site",
    });
  }
};

export const updateSite: RequestHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const updates = updateSiteSchema.parse(req.body);

    const siteIndex = sites.findIndex((s) => s.id === siteId);
    if (siteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Site not found",
      });
    }

    sites[siteIndex] = {
      ...sites[siteIndex],
      ...updates,
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      site: sites[siteIndex],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
};

export const deleteSite: RequestHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const siteIndex = sites.findIndex((s) => s.id === siteId);

    if (siteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Site not found",
      });
    }

    sites.splice(siteIndex, 1);
    // Also remove associated builds
    builds = builds.filter((b) => b.siteId !== siteId);

    res.json({
      success: true,
      message: "Site deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete site",
    });
  }
};

// Builds endpoints
export const triggerBuild: RequestHandler = async (req, res) => {
  try {
    const buildData = triggerBuildSchema.parse(req.body) as TriggerBuildRequest;
    const site = sites.find((s) => s.id === buildData.siteId);

    if (!site) {
      return res.status(404).json({
        success: false,
        error: "Site not found",
      });
    }

    const newBuild: Build = {
      id: `build_${++buildCounter}`,
      siteId: buildData.siteId,
      deployId: `deploy_${Date.now()}`,
      branch: buildData.branch || site.gitBranch,
      commitSha: buildData.commitSha,
      commitMessage: "Manual deploy",
      buildCommand: site.buildCommand,
      publishDirectory: site.publishDirectory,
      status: "pending",
      buildLogs: "",
      triggeredBy: "manual",
      triggeredByUser: "user-1", // TODO: Get from auth
      createdAt: new Date(),
    };

    builds.unshift(newBuild);

    // Update site deploy status
    const siteIndex = sites.findIndex((s) => s.id === buildData.siteId);
    if (siteIndex !== -1) {
      sites[siteIndex].deployStatus = "building";
    }

    res.json({
      success: true,
      build: newBuild,
    });

    // Simulate build process
    simulateBuildProcess(newBuild.id);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
};

export const getBuilds: RequestHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const siteBuilds = builds.filter((b) => b.siteId === siteId);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBuilds = siteBuilds.slice(startIndex, endIndex);

    res.json({
      success: true,
      builds: paginatedBuilds,
      pagination: {
        page,
        limit,
        total: siteBuilds.length,
        pages: Math.ceil(siteBuilds.length / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch builds",
    });
  }
};

export const getBuild: RequestHandler = async (req, res) => {
  try {
    const { buildId } = req.params;
    const build = builds.find((b) => b.id === buildId);

    if (!build) {
      return res.status(404).json({
        success: false,
        error: "Build not found",
      });
    }

    res.json({
      success: true,
      build,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch build",
    });
  }
};

export const cancelBuild: RequestHandler = async (req, res) => {
  try {
    const { buildId } = req.params;
    const buildIndex = builds.findIndex((b) => b.id === buildId);

    if (buildIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Build not found",
      });
    }

    if (
      builds[buildIndex].status !== "building" &&
      builds[buildIndex].status !== "pending"
    ) {
      return res.status(400).json({
        success: false,
        error: "Cannot cancel completed build",
      });
    }

    builds[buildIndex].status = "cancelled";
    builds[buildIndex].completedAt = new Date();

    res.json({
      success: true,
      build: builds[buildIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to cancel build",
    });
  }
};

// Domain management
export const addCustomDomain: RequestHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { domain } = req.body;

    const siteIndex = sites.findIndex((s) => s.id === siteId);
    if (siteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Site not found",
      });
    }

    if (!sites[siteIndex].customDomains.includes(domain)) {
      sites[siteIndex].customDomains.push(domain);
      sites[siteIndex].updatedAt = new Date();
    }

    res.json({
      success: true,
      site: sites[siteIndex],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to add custom domain",
    });
  }
};

export const removeCustomDomain: RequestHandler = async (req, res) => {
  try {
    const { siteId, domain } = req.params;

    const siteIndex = sites.findIndex((s) => s.id === siteId);
    if (siteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Site not found",
      });
    }

    sites[siteIndex].customDomains = sites[siteIndex].customDomains.filter(
      (d) => d !== domain,
    );
    sites[siteIndex].updatedAt = new Date();

    res.json({
      success: true,
      site: sites[siteIndex],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to remove custom domain",
    });
  }
};

// Environment variables
export const updateEnvironmentVariables: RequestHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { variables } = req.body;

    const siteIndex = sites.findIndex((s) => s.id === siteId);
    if (siteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Site not found",
      });
    }

    sites[siteIndex].environmentVariables = variables;
    sites[siteIndex].updatedAt = new Date();

    res.json({
      success: true,
      site: sites[siteIndex],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to update environment variables",
    });
  }
};

// Analytics (mock)
export const getSiteAnalytics: RequestHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { period = "7d" } = req.query;

    // Mock analytics data
    const analytics = {
      period,
      pageViews: Math.floor(Math.random() * 10000) + 1000,
      uniqueVisitors: Math.floor(Math.random() * 5000) + 500,
      bandwidth: Math.floor(Math.random() * 1000000) + 100000,
      topPages: [
        { path: "/", views: 450 },
        { path: "/about", views: 230 },
        { path: "/contact", views: 120 },
      ],
      traffic: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        views: Math.floor(Math.random() * 500) + 50,
      })),
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics",
    });
  }
};

// Helper function to simulate build process
function simulateBuildProcess(buildId: string) {
  const buildSteps = [
    { delay: 1000, status: "building", log: "Build started..." },
    { delay: 2000, status: "building", log: "Installing dependencies..." },
    { delay: 3000, status: "building", log: "Running build command..." },
    { delay: 4000, status: "building", log: "Optimizing assets..." },
    { delay: 5000, status: "success", log: "Build completed successfully!" },
  ];

  buildSteps.forEach((step, index) => {
    setTimeout(() => {
      const buildIndex = builds.findIndex((b) => b.id === buildId);
      if (buildIndex !== -1) {
        builds[buildIndex].status = step.status as any;
        builds[buildIndex].buildLogs += step.log + "\n";

        if (step.status === "success") {
          builds[buildIndex].completedAt = new Date();
          builds[buildIndex].duration = 5; // 5 seconds

          // Update site deploy status
          const siteIndex = sites.findIndex(
            (s) => s.id === builds[buildIndex].siteId,
          );
          if (siteIndex !== -1) {
            sites[siteIndex].deployStatus = "deployed";
            sites[siteIndex].lastDeployAt = new Date();
          }
        }
      }
    }, step.delay);
  });
}

// GitHub webhook handler (mock)
export const handleGitHubWebhook: RequestHandler = async (req, res) => {
  try {
    const payload = req.body;

    // Find sites connected to this repository
    const connectedSites = sites.filter(
      (site) =>
        site.gitRepo === payload.repository?.full_name &&
        site.gitBranch === payload.ref?.replace("refs/heads/", ""),
    );

    // Trigger builds for connected sites
    for (const site of connectedSites) {
      const newBuild: Build = {
        id: `build_${++buildCounter}`,
        siteId: site.id,
        deployId: `deploy_${Date.now()}`,
        branch: site.gitBranch,
        commitSha: payload.head_commit?.id,
        commitMessage: payload.head_commit?.message,
        buildCommand: site.buildCommand,
        publishDirectory: site.publishDirectory,
        status: "pending",
        buildLogs: "",
        triggeredBy: "webhook",
        createdAt: new Date(),
      };

      builds.unshift(newBuild);

      // Start build simulation
      simulateBuildProcess(newBuild.id);
    }

    res.json({
      success: true,
      message: `Triggered ${connectedSites.length} builds`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Invalid webhook payload",
    });
  }
};

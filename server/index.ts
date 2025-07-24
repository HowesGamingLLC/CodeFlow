import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
} from "./routes/auth";
import { executeCode, executeTerminalCommand, joseyQuery } from "./routes/ide";
import {
  createSite,
  getSites,
  getSite,
  updateSite,
  deleteSite,
  triggerBuild,
  getBuilds,
  getBuild,
  cancelBuild,
  addCustomDomain,
  removeCustomDomain,
  updateEnvironmentVariables,
  getSiteAnalytics,
  handleGitHubWebhook,
} from "./routes/netlify";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/forgot-password", handleForgotPassword);

  // IDE routes
  app.post("/api/ide/execute", executeCode);
  app.post("/api/ide/terminal", executeTerminalCommand);
  app.post("/api/ide/josey", joseyQuery);

  // Netlify Clone routes
  // Sites
  app.post("/api/netlify/sites", createSite);
  app.get("/api/netlify/sites", getSites);
  app.get("/api/netlify/sites/:siteId", getSite);
  app.put("/api/netlify/sites/:siteId", updateSite);
  app.delete("/api/netlify/sites/:siteId", deleteSite);

  // Builds
  app.post("/api/netlify/builds", triggerBuild);
  app.get("/api/netlify/sites/:siteId/builds", getBuilds);
  app.get("/api/netlify/builds/:buildId", getBuild);
  app.post("/api/netlify/builds/:buildId/cancel", cancelBuild);

  // Domains
  app.post("/api/netlify/sites/:siteId/domains", addCustomDomain);
  app.delete("/api/netlify/sites/:siteId/domains/:domain", removeCustomDomain);

  // Environment Variables
  app.put("/api/netlify/sites/:siteId/env", updateEnvironmentVariables);

  // Analytics
  app.get("/api/netlify/sites/:siteId/analytics", getSiteAnalytics);

  // Webhooks
  app.post("/api/netlify/webhook/github", handleGitHubWebhook);

  return app;
}

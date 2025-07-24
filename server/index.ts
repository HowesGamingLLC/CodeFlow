import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
} from "./routes/auth";
import {
  executeCode,
  executeTerminalCommand,
  joseyQuery,
} from "./routes/ide";
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

  return app;
}

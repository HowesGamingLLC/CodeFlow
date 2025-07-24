import React, { useState, useEffect } from "react";
import {
  Rocket,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Server,
  Container,
  GitBranch,
  Package,
  Shield,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useIDEStore } from "@/lib/ide-store";
import { cn } from "@/lib/utils";

const DEPLOYMENT_PLATFORMS = [
  {
    id: "vercel",
    name: "Vercel",
    icon: Zap,
    description: "Optimized for React, Next.js, and static sites",
    color: "text-white",
    bgColor: "bg-black",
    features: [
      "Automatic HTTPS",
      "Global CDN",
      "Serverless Functions",
      "Git Integration",
    ],
    buildTime: "~30s",
    suitable: ["react", "nextjs", "static", "jamstack"],
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: Globe,
    description: "Perfect for JAMstack and static sites",
    color: "text-white",
    bgColor: "bg-teal-600",
    features: ["Forms", "Edge Functions", "Split Testing", "Analytics"],
    buildTime: "~45s",
    suitable: ["static", "jamstack", "react", "vue"],
  },
  {
    id: "docker",
    name: "Docker",
    icon: Container,
    description: "Containerized deployment for any stack",
    color: "text-white",
    bgColor: "bg-blue-600",
    features: ["Full Control", "Any Runtime", "Scalable", "Portable"],
    buildTime: "~2-5min",
    suitable: ["node", "python", "any"],
  },
];

const DEPLOYMENT_STEPS = [
  {
    label: "Analyzing project",
    description: "Detecting framework and dependencies",
  },
  { label: "Installing dependencies", description: "Running package manager" },
  { label: "Building application", description: "Compiling and optimizing" },
  { label: "Deploying to platform", description: "Uploading and configuring" },
  { label: "Finalizing deployment", description: "Setting up domain and SSL" },
];

export function Deploy() {
  const { deployStatus, setDeployStatus, addConsoleLog } = useWorkspaceStore();
  const {
    deploymentStatus,
    deployProject,
    currentProject,
    sendToJosey,
    openFiles,
  } = useIDEStore();

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Detect best platform based on project
  const detectBestPlatform = () => {
    if (!currentProject || openFiles.length === 0) return "vercel";

    const hasReact = openFiles.some(
      (f) =>
        f.content.includes("import React") ||
        f.name.includes("jsx") ||
        f.name.includes("tsx"),
    );

    const hasNode = openFiles.some(
      (f) => f.content.includes("express") || f.name === "server.js",
    );

    const hasStatic = openFiles.some((f) => f.name === "index.html");

    if (hasNode) return "docker";
    if (hasReact) return "vercel";
    if (hasStatic) return "netlify";

    return "vercel";
  };

  useEffect(() => {
    if (!selectedPlatform) {
      setSelectedPlatform(detectBestPlatform());
    }
  }, [currentProject, openFiles]);

  // Simulate deployment progress
  useEffect(() => {
    if (deploymentStatus === "deploying") {
      const interval = setInterval(() => {
        setDeploymentProgress((prev) => {
          const newProgress = prev + 2;

          // Update current step based on progress
          const step = Math.floor(newProgress / 20);
          setCurrentStep(Math.min(step, DEPLOYMENT_STEPS.length - 1));

          if (newProgress >= 100) {
            clearInterval(interval);
            setDeployedUrl(
              `https://${currentProject?.name || "my-app"}.${selectedPlatform}.app`,
            );
            return 100;
          }

          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [deploymentStatus, selectedPlatform, currentProject]);

  const handleDeploy = async () => {
    if (!selectedPlatform || !currentProject) return;

    setDeploymentProgress(0);
    setCurrentStep(0);
    setDeployedUrl(null);
    setDeployStatus("deploying");

    // Add console logs
    addConsoleLog({
      type: "info",
      message: `🚀 Starting AI-powered deployment to ${selectedPlatform}...`,
    });

    // Ask Josey for deployment help
    sendToJosey(
      `Starting deployment to ${selectedPlatform} for project: ${currentProject.name}`,
      "text",
      { action: "deploy", platform: selectedPlatform },
    );

    await deployProject(selectedPlatform as "vercel" | "netlify" | "docker");

    setTimeout(() => {
      setDeployStatus("deployed");
      addConsoleLog({
        type: "info",
        message: `✅ Deployment successful! Live at ${deployedUrl}`,
      });
    }, 7000);
  };

  const copyUrl = async () => {
    if (deployedUrl) {
      try {
        await navigator.clipboard.writeText(deployedUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case "preparing":
      case "deploying":
        return <Clock className="w-4 h-4 animate-spin" />;
      case "deployed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Rocket className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (deploymentStatus) {
      case "preparing":
        return "text-yellow-400";
      case "deploying":
        return "text-blue-400";
      case "deployed":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center", getStatusColor())}>
            {getStatusIcon()}
          </div>
          <span className="text-sm font-medium text-gray-200">AI Deploy</span>
          <Badge
            className={cn(
              "text-xs",
              deploymentStatus === "deployed"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : deploymentStatus === "deploying"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : deploymentStatus === "failed"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30",
            )}
          >
            {deploymentStatus.charAt(0).toUpperCase() +
              deploymentStatus.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-6 w-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-200 mb-2">
              Project Information
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-gray-200">
                  {currentProject?.name || "Untitled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Files:</span>
                <span className="text-gray-200">{openFiles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Framework:</span>
                <span className="text-gray-200">
                  {currentProject?.language || "Auto-detected"}
                </span>
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-3">
              Choose Platform
            </h3>
            <div className="space-y-2">
              {DEPLOYMENT_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={cn(
                    "w-full p-3 rounded-lg border transition-all text-left",
                    selectedPlatform === platform.id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-600 bg-gray-800 hover:border-gray-500",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded flex items-center justify-center",
                        platform.bgColor,
                      )}
                    >
                      <platform.icon
                        className={cn("w-4 h-4", platform.color)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-200">
                          {platform.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          ~{platform.buildTime}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {platform.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {platform.features.slice(0, 2).map((feature) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deployment Progress */}
          {(deploymentStatus === "preparing" ||
            deploymentStatus === "deploying") && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-200 mb-3">
                Deployment Progress
              </h3>
              <Progress value={deploymentProgress} className="mb-3" />
              <div className="space-y-2">
                {DEPLOYMENT_STEPS.map((step, index) => (
                  <div
                    key={step.label}
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      index < currentStep
                        ? "text-green-400"
                        : index === currentStep
                          ? "text-blue-400"
                          : "text-gray-500",
                    )}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : index === currentStep ? (
                      <Clock className="w-3 h-3 animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-600" />
                    )}
                    <div>
                      <div className="font-medium">{step.label}</div>
                      <div className="text-gray-400">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deployment Success */}
          {deploymentStatus === "deployed" && deployedUrl && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-medium text-green-400">
                  Deployment Successful!
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">
                    Your app is live:
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                  <span className="text-sm text-gray-200 flex-1 font-mono">
                    {deployedUrl}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyUrl}
                    className="h-6 w-6 p-0"
                  >
                    {copiedUrl ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(deployedUrl, "_blank")}
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-200 mb-3">
                Advanced Options
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Environment Variables
                  </span>
                  <Button size="sm" variant="outline" className="text-xs">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Build Command</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    Customize
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Domain Settings</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Deploy Button */}
      <div className="p-4 border-t border-gray-700">
        <Button
          onClick={handleDeploy}
          disabled={
            !selectedPlatform ||
            deploymentStatus === "deploying" ||
            deploymentStatus === "preparing"
          }
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700"
        >
          {deploymentStatus === "deploying" ||
          deploymentStatus === "preparing" ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Deploy to{" "}
              {selectedPlatform
                ? DEPLOYMENT_PLATFORMS.find((p) => p.id === selectedPlatform)
                    ?.name
                : "Platform"}
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-2">
          AI-powered deployment with automatic optimization and error detection
        </p>
      </div>
    </div>
  );
}

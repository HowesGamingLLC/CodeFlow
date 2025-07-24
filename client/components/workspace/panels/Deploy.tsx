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
    features: ["Automatic HTTPS", "Global CDN", "Serverless Functions", "Git Integration"],
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
  { label: "Analyzing project", description: "Detecting framework and dependencies" },
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
    openFiles
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

    const hasReact = openFiles.some(f =>
      f.content.includes("import React") ||
      f.name.includes("jsx") ||
      f.name.includes("tsx")
    );

    const hasNode = openFiles.some(f =>
      f.content.includes("express") ||
      f.name === "server.js"
    );

    const hasStatic = openFiles.some(f => f.name === "index.html");

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
        setDeploymentProgress(prev => {
          const newProgress = prev + 2;

          // Update current step based on progress
          const step = Math.floor(newProgress / 20);
          setCurrentStep(Math.min(step, DEPLOYMENT_STEPS.length - 1));

          if (newProgress >= 100) {
            clearInterval(interval);
            setDeployedUrl(`https://${currentProject?.name || 'my-app'}.${selectedPlatform}.app`);
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
      { action: "deploy", platform: selectedPlatform }
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

  const getStatusBadge = (status: Deployment["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Live
          </Badge>
        );
      case "building":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <div className="w-3 h-3 mr-1 border border-blue-400 border-t-transparent rounded-full animate-spin" />
            Building
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  const getDeployStatusBadge = (status: typeof deployStatus) => {
    switch (status) {
      case "idle":
        return (
          <Badge variant="outline" className="text-gray-400">
            Ready
          </Badge>
        );
      case "deploying":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Deploying
          </Badge>
        );
      case "deployed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Deployed
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Failed
          </Badge>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-gray-200">Deploy</h2>
            {getDeployStatusBadge(deployStatus)}
          </div>

          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Deploy Button */}
        <Button
          onClick={startDeploy}
          disabled={deployStatus === "deploying"}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {deployStatus === "deploying" ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-pulse" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Deploy to Production
            </>
          )}
        </Button>
      </div>

      {/* Deployments List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">
              Active Deployments
            </h3>

            {deployments.map((deployment) => (
              <Card key={deployment.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-gray-200 text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {deployment.url}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 flex items-center gap-2">
                        <GitBranch className="w-3 h-3" />
                        {deployment.branch} • {deployment.version}
                      </CardDescription>
                    </div>
                    {getStatusBadge(deployment.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {deployment.timestamp.toRelativeTimeString()}
                    </span>
                    <Button size="sm" variant="ghost" className="h-6 px-2">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>

                  {deployment.status === "active" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        View Logs
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        Rollback
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Deployment Settings */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Settings</h3>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-200">
                  Auto Deploy
                </CardTitle>
                <CardDescription className="text-xs">
                  Automatically deploy when changes are pushed to main branch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Production Branch:</span>
                  <span className="text-gray-200">main</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Build Command:</span>
                  <span className="text-gray-200">npm run build</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deploy Provider:</span>
                  <span className="text-gray-200">Vercel</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Custom Domain:</span>
                  <span className="text-gray-200">coinkrizy.com</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environment Variables */}
          <div className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-200">
                  Environment Variables
                </CardTitle>
                <CardDescription className="text-xs">
                  Production environment configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">NODE_ENV:</span>
                  <span className="text-gray-200">production</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">API_URL:</span>
                  <span className="text-gray-200">
                    https://api.coinkrizy.com
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">DATABASE_URL:</span>
                  <span className="text-gray-200">postgres://...</span>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Manage Variables
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

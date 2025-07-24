import React from "react";
import {
  Hammer,
  Play,
  Square,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

interface BuildStep {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "error";
  duration?: string;
  error?: string;
}

export function Build() {
  const { buildStatus, setBuildStatus, addConsoleLog } = useWorkspaceStore();

  const [buildSteps, setBuildSteps] = React.useState<BuildStep[]>([
    { id: "1", name: "Install Dependencies", status: "pending" },
    { id: "2", name: "Type Check", status: "pending" },
    { id: "3", name: "Lint Code", status: "pending" },
    { id: "4", name: "Run Tests", status: "pending" },
    { id: "5", name: "Build Application", status: "pending" },
    { id: "6", name: "Optimize Assets", status: "pending" },
  ]);

  const startBuild = () => {
    setBuildStatus("building");
    setBuildSteps((steps) =>
      steps.map((step) => ({ ...step, status: "pending" as const })),
    );

    addConsoleLog({
      type: "info",
      message: "Starting build process...",
    });

    // Simulate build steps
    const stepDurations = [2000, 1500, 1000, 3000, 4000, 2000];
    let totalTime = 0;

    stepDurations.forEach((duration, index) => {
      totalTime += duration;

      setTimeout(() => {
        setBuildSteps((steps) =>
          steps.map((step, i) => {
            if (i === index) {
              return {
                ...step,
                status: "running" as const,
              };
            }
            return step;
          }),
        );

        addConsoleLog({
          type: "info",
          message: `Running: ${buildSteps[index]?.name}...`,
        });
      }, totalTime - duration);

      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate

        setBuildSteps((steps) =>
          steps.map((step, i) => {
            if (i === index) {
              return {
                ...step,
                status: success ? ("success" as const) : ("error" as const),
                duration: `${(duration / 1000).toFixed(1)}s`,
                error: success ? undefined : "Build step failed",
              };
            }
            return step;
          }),
        );

        if (success) {
          addConsoleLog({
            type: "info",
            message: `✓ ${buildSteps[index]?.name} completed in ${(duration / 1000).toFixed(1)}s`,
          });
        } else {
          addConsoleLog({
            type: "error",
            message: `✗ ${buildSteps[index]?.name} failed`,
          });
          setBuildStatus("error");
          return;
        }

        // If this is the last step and it succeeded
        if (index === stepDurations.length - 1 && success) {
          setBuildStatus("success");
          addConsoleLog({
            type: "info",
            message: "🎉 Build completed successfully!",
          });
        }
      }, totalTime);
    });
  };

  const stopBuild = () => {
    setBuildStatus("idle");
    setBuildSteps((steps) =>
      steps.map((step) => ({
        ...step,
        status: step.status === "running" ? "pending" : step.status,
      })),
    );

    addConsoleLog({
      type: "warn",
      message: "Build process stopped by user",
    });
  };

  const getStatusIcon = (status: BuildStep["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />;
      case "running":
        return (
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        );
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: typeof buildStatus) => {
    switch (status) {
      case "idle":
        return (
          <Badge variant="outline" className="text-gray-400">
            Ready
          </Badge>
        );
      case "building":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Building
          </Badge>
        );
      case "success":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Success
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
            <Hammer className="w-5 h-5 text-orange-400" />
            <h2 className="font-semibold text-gray-200">Build</h2>
            {getStatusBadge(buildStatus)}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => {}}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Build Controls */}
        <div className="flex gap-2">
          {buildStatus === "building" ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={stopBuild}
              className="flex-1"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Build
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={startBuild}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Build
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setBuildSteps((steps) =>
                steps.map((step) => ({ ...step, status: "pending" as const })),
              )
            }
            disabled={buildStatus === "building"}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Build Steps */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Build Pipeline
            </h3>

            {buildSteps.map((step, index) => (
              <Card
                key={step.id}
                className={cn(
                  "bg-gray-800 border-gray-700",
                  step.status === "running" && "border-blue-500/50",
                  step.status === "success" && "border-green-500/50",
                  step.status === "error" && "border-red-500/50",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6">
                        {getStatusIcon(step.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {step.name}
                        </p>
                        {step.error && (
                          <p className="text-xs text-red-400 mt-1">
                            {step.error}
                          </p>
                        )}
                      </div>
                    </div>

                    {step.duration && (
                      <span className="text-xs text-gray-400">
                        {step.duration}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Build Configuration */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Configuration
            </h3>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-200">
                  Build Settings
                </CardTitle>
                <CardDescription className="text-xs">
                  Current build configuration for CoinKrazy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Node Version:</span>
                  <span className="text-gray-200">18.17.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Build Command:</span>
                  <span className="text-gray-200">npm run build</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Output Directory:</span>
                  <span className="text-gray-200">dist/</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Environment:</span>
                  <span className="text-gray-200">Production</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

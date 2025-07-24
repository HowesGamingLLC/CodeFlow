import React, { useRef, useEffect } from "react";
import {
  Terminal,
  Trash2,
  Download,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const logTypeConfig = {
  log: {
    icon: Info,
    color: "text-gray-300",
    bgColor: "bg-gray-800",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-400",
    bgColor: "bg-red-900/20",
  },
  warn: {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bgColor: "bg-yellow-900/20",
  },
  info: {
    icon: CheckCircle,
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
  },
};

export function Console() {
  const { consoleLogs, clearConsole, addConsoleLog } = useWorkspaceStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [consoleLogs]);

  const handleClearConsole = () => {
    clearConsole();
    addConsoleLog({
      type: "info",
      message: "Console cleared",
    });
  };

  const handleDownloadLogs = () => {
    const logContent = consoleLogs
      .map(
        (log) =>
          `[${log.timestamp.toLocaleTimeString()}] ${log.type.toUpperCase()}: ${log.message}`,
      )
      .join("\n");

    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `console-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addConsoleLog({
      type: "info",
      message: "Console logs downloaded",
    });
  };

  const addSampleLog = (type: "log" | "error" | "warn" | "info") => {
    const sampleMessages = {
      log: "Application initialized successfully",
      error: "Failed to connect to database: Connection timeout",
      warn: "Deprecated API usage detected in component Header.tsx",
      info: "Build completed in 2.3s",
    };

    addConsoleLog({
      type,
      message: sampleMessages[type],
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="font-semibold text-gray-200">Console</h2>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {consoleLogs.length} logs
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownloadLogs}
              className="text-gray-400 hover:text-gray-200"
              disabled={consoleLogs.length === 0}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearConsole}
              className="text-gray-400 hover:text-gray-200"
              disabled={consoleLogs.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Console Output */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="p-4 space-y-2 font-mono text-sm">
          {consoleLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No logs yet. Console output will appear here.</p>
            </div>
          ) : (
            consoleLogs.map((log) => {
              const config = logTypeConfig[log.type];
              const Icon = config.icon;

              return (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start gap-3 p-2 rounded border-l-2",
                    config.bgColor,
                    log.type === "error" && "border-l-red-500",
                    log.type === "warn" && "border-l-yellow-500",
                    log.type === "info" && "border-l-blue-500",
                    log.type === "log" && "border-l-gray-500",
                  )}
                >
                  <Icon
                    className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color)}
                  />

                  <div className="flex-1">
                    <div className={cn("font-medium", config.color)}>
                      {log.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {log.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">Live console output</div>

          {/* Sample log buttons for testing */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addSampleLog("info")}
              className="text-xs text-blue-400 hover:bg-blue-900/20"
            >
              Info
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addSampleLog("warn")}
              className="text-xs text-yellow-400 hover:bg-yellow-900/20"
            >
              Warn
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addSampleLog("error")}
              className="text-xs text-red-400 hover:bg-red-900/20"
            >
              Error
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

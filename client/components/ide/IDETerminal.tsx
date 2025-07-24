import React, { useState, useRef, useEffect } from "react";
import {
  Terminal,
  Plus,
  X,
  Minimize2,
  Square,
  Play,
  Trash2,
  Settings,
  Download,
  Bot,
  Lightbulb,
  Zap,
  Package,
  Rocket,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useIDEStore } from "@/lib/ide-store";
import { cn } from "@/lib/utils";

interface IDETerminalProps {
  onToggle: () => void;
}

export function IDETerminal({ onToggle }: IDETerminalProps) {
  const {
    terminalSessions,
    activeTerminalId,
    sendTerminalCommand,
    createTerminal,
    suggestCommand,
    commandSuggestions,
    sendToJosey,
    installPackage,
    deployProject,
  } = useIDEStore();

  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTerminal = terminalSessions.find(
    (t) => t.id === activeTerminalId,
  );

  useEffect(() => {
    // Auto-scroll to bottom when new output arrives
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [activeTerminal?.output]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim() || !activeTerminal) return;

    // Add to history
    setCommandHistory((prev) => [...prev, currentCommand]);
    setHistoryIndex(-1);

    // Use smart command handling
    handleSmartCommand(currentCommand.trim());
    setCurrentCommand("");
    setShowAISuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };

  const executeQuickCommand = (command: string) => {
    if (activeTerminal) {
      sendTerminalCommand(activeTerminal.id, command);
    }
  };

  const handleAISuggest = (task: string) => {
    const suggestions = suggestCommand(task);
    setAISuggestions(suggestions);
    setShowAISuggestions(true);

    // Also ask Josey for help
    sendToJosey(`I need help with terminal commands for: ${task}`, "text", {
      action: "terminal-help",
    });
  };

  const executeSuggestedCommand = (command: string) => {
    setCurrentCommand(command);
    setShowAISuggestions(false);
    inputRef.current?.focus();
  };

  const handleSmartCommand = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Smart package installation
    if (
      lowerInput.includes("install") &&
      (lowerInput.includes("npm") || lowerInput.includes("yarn"))
    ) {
      const packageMatch = lowerInput.match(
        /(?:npm|yarn)\s+(?:install|add)\s+([^\s]+)/,
      );
      if (packageMatch) {
        const packageName = packageMatch[1];
        installPackage(
          packageName,
          lowerInput.includes("--save-dev") || lowerInput.includes("-D"),
        );
      }
    }

    // Smart deployment
    if (lowerInput.includes("deploy")) {
      if (lowerInput.includes("vercel")) {
        deployProject("vercel");
      } else if (lowerInput.includes("netlify")) {
        deployProject("netlify");
      } else {
        handleAISuggest("deploy");
        return;
      }
    }

    // Execute the command normally
    if (activeTerminal) {
      sendTerminalCommand(activeTerminal.id, input);
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "input":
        return "text-green-400";
      case "output":
        return "text-gray-200";
      case "error":
        return "text-red-400";
      case "system":
        return "text-blue-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Terminal Header */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-gray-200">Terminal</span>
          {activeTerminal && (
            <span className="text-xs text-gray-400">
              ({activeTerminal.name})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* AI Command Suggestions */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAISuggest("install packages")}
            className="h-6 px-2 text-xs text-purple-400 hover:text-purple-200"
            title="AI Package Install"
          >
            <Bot className="w-3 h-3 mr-1" />
            <Package className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAISuggest("deploy project")}
            className="h-6 px-2 text-xs text-blue-400 hover:text-blue-200"
            title="AI Deploy Help"
          >
            <Bot className="w-3 h-3 mr-1" />
            <Rocket className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAISuggest("git commands")}
            className="h-6 px-2 text-xs text-green-400 hover:text-green-200"
            title="AI Git Help"
          >
            <Bot className="w-3 h-3 mr-1" />
            <GitBranch className="w-3 h-3" />
          </Button>

          <div className="w-px h-4 bg-gray-600 mx-1" />

          {/* Quick Command Buttons */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => executeQuickCommand("npm install")}
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200"
          >
            npm install
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => executeQuickCommand("npm start")}
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200"
          >
            <Play className="w-3 h-3 mr-1" />
            start
          </Button>

          <div className="w-px h-4 bg-gray-600 mx-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={createTerminal}
            className="h-6 w-6 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {}}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
            className="h-6 w-6 p-0"
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col">
        {/* Output Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-3">
          <div className="font-mono text-sm space-y-1">
            {activeTerminal?.output.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "whitespace-pre-wrap",
                  getMessageTypeColor(message.type),
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-3">
          <form onSubmit={handleCommand} className="flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm flex-shrink-0">
              {activeTerminal?.workingDirectory || "/"}$
            </span>
            <Input
              ref={inputRef}
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              className="flex-1 bg-transparent border-none text-gray-200 font-mono focus:ring-0 p-0"
              autoComplete="off"
            />
          </form>

          {/* AI Command Suggestions */}
          {showAISuggestions && aiSuggestions.length > 0 && (
            <div className="mt-2 p-2 bg-purple-900/20 border border-purple-500/30 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">
                  AI Suggestions
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAISuggestions(false)}
                  className="h-4 w-4 p-0 ml-auto"
                >
                  <X className="w-2 h-2" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => executeSuggestedCommand(suggestion)}
                    className="text-xs px-2 py-1 bg-purple-800/30 text-purple-200 rounded hover:bg-purple-700/40 transition-colors text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Command Suggestions */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {[
              "ls",
              "pwd",
              "clear",
              "help",
              "node --version",
              "python --version",
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeQuickCommand(cmd)}
                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Status */}
      <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-3 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Connected</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{activeTerminal?.output.length || 0} lines</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}

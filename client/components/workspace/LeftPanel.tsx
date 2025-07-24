import React from "react";
import {
  MessageSquare,
  Files,
  Terminal,
  Puzzle,
  Hammer,
  Rocket,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { AIChat } from "./panels/AIChat";
import { FileExplorer } from "./panels/FileExplorer";
import { Console } from "./panels/Console";
import { Integrations } from "./panels/Integrations";
import { Build } from "./panels/Build";
import { Deploy } from "./panels/Deploy";
import { Databases } from "./panels/Databases";

const tabs = [
  { id: "chat", name: "AI Chat", icon: MessageSquare, component: AIChat },
  { id: "files", name: "Files", icon: Files, component: FileExplorer },
  { id: "console", name: "Console", icon: Terminal, component: Console },
  {
    id: "integrations",
    name: "Integrations",
    icon: Puzzle,
    component: Integrations,
  },
  { id: "build", name: "Build", icon: Hammer, component: Build },
  { id: "deploy", name: "Deploy", icon: Rocket, component: Deploy },
  { id: "databases", name: "Databases", icon: Database, component: Databases },
];

export function LeftPanel() {
  const { activeLeftTab, setActiveLeftTab } = useWorkspaceStore();

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeLeftTab)?.component || AIChat;

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLeftTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeLeftTab === tab.id
                  ? "text-blue-400 border-blue-400 bg-gray-700"
                  : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-750",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <ActiveComponent />
      </div>
    </div>
  );
}

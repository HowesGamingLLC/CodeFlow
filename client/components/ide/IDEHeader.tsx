import React, { useState } from "react";
import {
  Play,
  Square,
  Save,
  FolderOpen,
  Settings,
  User,
  Bot,
  Plus,
  Download,
  Share,
  GitBranch,
  Home,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIDEStore } from "@/lib/ide-store";
import { ProjectTemplateModal } from "./ProjectTemplateModal";
import { WorkspaceSnapshots } from "./WorkspaceSnapshots";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export function IDEHeader() {
  const {
    currentProject,
    isExecuting,
    executeCode,
    activeFileId,
    openFiles,
    joseyPanelOpen,
    saveProject,
  } = useIDEStore();

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSnapshots, setShowSnapshots] = useState(false);

  const activeFile = openFiles.find((f) => f.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((f) => f.isModified);

  const handleRunCode = () => {
    if (activeFile) {
      executeCode(activeFile.content, activeFile.language);
    }
  };

  return (
    <>
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        {/* Left side - Logo and Project */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <Home className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-gray-200">AppStop.pro IDE</span>
          </div>

          {currentProject && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">/</span>
              <span className="text-gray-200">{currentProject.name}</span>
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="text-yellow-400 border-yellow-400"
                >
                  Unsaved
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Center - File Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowTemplateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={saveProject}
            disabled={!hasUnsavedChanges}
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button
            size="sm"
            onClick={handleRunCode}
            disabled={!activeFile || isExecuting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isExecuting ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSnapshots(true)}
            className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
          >
            <History className="w-4 h-4 mr-2" />
            Snapshots
          </Button>
        </div>

        {/* Right side - User and Settings */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-300 hover:bg-gray-700"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                File
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem onClick={() => setShowTemplateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Project
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={saveProject}>
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-300 hover:bg-gray-700"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem>
                <GitBranch className="w-4 h-4 mr-2" />
                Version Control
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ProjectTemplateModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />

      <Dialog open={showSnapshots} onOpenChange={setShowSnapshots}>
        <DialogContent className="max-w-2xl h-[80vh] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-200">
              Workspace Snapshots
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <WorkspaceSnapshots />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

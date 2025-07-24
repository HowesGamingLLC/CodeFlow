import React, { useState, useEffect } from "react";
import {
  Camera,
  History,
  Save,
  RotateCcw,
  Trash2,
  Clock,
  FileText,
  Tag,
  Bot,
  GitBranch,
  Users,
  Star,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useIDEStore } from "@/lib/ide-store";
import { cn } from "@/lib/utils";

interface WorkspaceSnapshot {
  id: string;
  name: string;
  description: string;
  timestamp: Date;
  fileCount: number;
  changes: string[];
  tags: string[];
  aiGenerated: boolean;
  author: string;
  isStarred: boolean;
}

export function WorkspaceSnapshots() {
  const [snapshots, setSnapshots] = useState<WorkspaceSnapshot[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState("");
  const [newSnapshotDescription, setNewSnapshotDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    openFiles,
    currentProject,
    createSnapshot,
    restoreSnapshot,
    sendToJosey,
  } = useIDEStore();

  const availableTags = [
    "feature",
    "bugfix",
    "refactor",
    "milestone",
    "backup",
    "experiment",
    "review",
  ];

  // Mock snapshots for demonstration
  useEffect(() => {
    setSnapshots([
      {
        id: "snap_1",
        name: "Initial Project Setup",
        description:
          "Basic project structure with React components and routing",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        fileCount: 12,
        changes: ["Added routing", "Created main components", "Set up styling"],
        tags: ["milestone", "feature"],
        aiGenerated: false,
        author: "You",
        isStarred: true,
      },
      {
        id: "snap_2",
        name: "API Integration Complete",
        description:
          "Implemented REST API calls and data management. All user authentication flows working.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        fileCount: 18,
        changes: [
          "API service layer",
          "User authentication",
          "Error handling",
          "Loading states",
        ],
        tags: ["feature", "api"],
        aiGenerated: true,
        author: "Josey AI",
        isStarred: false,
      },
      {
        id: "snap_3",
        name: "UI Polishing Phase",
        description:
          "Enhanced user interface with animations and improved responsive design",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        fileCount: 22,
        changes: [
          "Added animations",
          "Mobile responsiveness",
          "Icon updates",
          "Color scheme",
        ],
        tags: ["ui", "polish"],
        aiGenerated: false,
        author: "You",
        isStarred: false,
      },
    ]);
  }, []);

  const handleCreateSnapshot = async () => {
    if (!newSnapshotName.trim()) return;

    // Generate AI description if none provided
    let description = newSnapshotDescription;
    if (!description.trim()) {
      // Ask Josey to generate a description
      sendToJosey(
        `Generate a descriptive summary for a workspace snapshot named "${newSnapshotName}" with ${openFiles.length} files`,
        "text",
        { action: "snapshot-description" },
      );
      description = "AI is generating description...";
    }

    const newSnapshot: WorkspaceSnapshot = {
      id: `snap_${Date.now()}`,
      name: newSnapshotName,
      description,
      timestamp: new Date(),
      fileCount: openFiles.length,
      changes: [
        `${openFiles.length} files captured`,
        "Current workspace state",
      ],
      tags: selectedTags,
      aiGenerated: !newSnapshotDescription.trim(),
      author: "You",
      isStarred: false,
    };

    setSnapshots((prev) => [newSnapshot, ...prev]);
    createSnapshot(description);

    // Reset form
    setNewSnapshotName("");
    setNewSnapshotDescription("");
    setSelectedTags([]);
    setShowCreateForm(false);
  };

  const handleRestoreSnapshot = (snapshotId: string) => {
    restoreSnapshot(snapshotId);
    sendToJosey(
      `Restoring workspace from snapshot: ${snapshots.find((s) => s.id === snapshotId)?.name}`,
      "text",
      { action: "snapshot-restore" },
    );
  };

  const toggleStarSnapshot = (snapshotId: string) => {
    setSnapshots((prev) =>
      prev.map((snap) =>
        snap.id === snapshotId ? { ...snap, isStarred: !snap.isStarred } : snap,
      ),
    );
  };

  const deleteSnapshot = (snapshotId: string) => {
    setSnapshots((prev) => prev.filter((snap) => snap.id !== snapshotId));
  };

  const askJoseyForComparison = (snapshotId: string) => {
    const snapshot = snapshots.find((s) => s.id === snapshotId);
    sendToJosey(
      `Compare the current workspace with the "${snapshot?.name}" snapshot and explain the differences`,
      "text",
      { action: "snapshot-compare", snapshotId },
    );
  };

  const generateAISnapshot = () => {
    sendToJosey(
      `Analyze my current workspace and create an intelligent snapshot with a descriptive name and summary of changes`,
      "text",
      { action: "ai-snapshot" },
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-200">Snapshots</span>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            {snapshots.length}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={generateAISnapshot}
            className="h-6 px-2 text-xs text-purple-400"
            title="AI Smart Snapshot"
          >
            <Bot className="w-3 h-3 mr-1" />
            AI
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowCreateForm(true)}
            className="h-6 w-6 p-0"
          >
            <Camera className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Create Snapshot Form */}
          {showCreateForm && (
            <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-sm font-medium text-gray-200 mb-3">
                Create Snapshot
              </h3>

              <div className="space-y-3">
                <Input
                  placeholder="Snapshot name..."
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />

                <Textarea
                  placeholder="Description (optional - AI will generate if empty)"
                  value={newSnapshotDescription}
                  onChange={(e) => setNewSnapshotDescription(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-200 h-20"
                />

                {/* Tags */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.includes(tag)
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag],
                          )
                        }
                        className={cn(
                          "text-xs px-2 py-1 rounded transition-colors",
                          selectedTags.includes(tag)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600",
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateSnapshot}
                    disabled={!newSnapshotName.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Current Workspace Status */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-200 mb-2">
              Current Workspace
            </h3>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Project: {currentProject?.name || "Untitled"}</div>
              <div>Files: {openFiles.length}</div>
              <div>Last modified: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Snapshots List */}
          <div className="space-y-3">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-200">
                        {snapshot.name}
                      </h4>
                      {snapshot.aiGenerated && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          <Bot className="w-2 h-2 mr-1" />
                          AI
                        </Badge>
                      )}
                      {snapshot.isStarred && (
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {snapshot.description}
                    </p>

                    {/* Tags */}
                    {snapshot.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {snapshot.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Changes */}
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-4 mb-1">
                        <span>{snapshot.fileCount} files</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {snapshot.timestamp.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {snapshot.author}
                        </span>
                      </div>
                      <div className="text-gray-400">
                        {snapshot.changes.slice(0, 2).join(", ")}
                        {snapshot.changes.length > 2 && "..."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreSnapshot(snapshot.id)}
                    className="text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Restore
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => askJoseyForComparison(snapshot.id)}
                    className="text-xs"
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    Compare
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleStarSnapshot(snapshot.id)}
                    className="w-6 h-6 p-0"
                  >
                    <Star
                      className={cn(
                        "w-3 h-3",
                        snapshot.isStarred
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400",
                      )}
                    />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteSnapshot(snapshot.id)}
                    className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {snapshots.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm mb-2">No snapshots yet</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCreateForm(true)}
              >
                <Camera className="w-3 h-3 mr-1" />
                Create first snapshot
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={generateAISnapshot}
            className="text-xs"
          >
            <Bot className="w-3 h-3 mr-1" />
            AI Snapshot
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              sendToJosey(
                "Show me the evolution of my project through snapshots and suggest improvements",
                "text",
                { action: "project-evolution" },
              )
            }
            className="text-xs"
          >
            <GitBranch className="w-3 h-3 mr-1" />
            Evolution
          </Button>
        </div>
      </div>
    </div>
  );
}

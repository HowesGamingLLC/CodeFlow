import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore, FileItem } from "@/lib/workspace-store";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileTreeItemProps {
  item: FileItem;
  level: number;
  expandedFolders: Set<string>;
  onToggleFolder: (id: string) => void;
}

function FileTreeItem({
  item,
  level,
  expandedFolders,
  onToggleFolder,
}: FileTreeItemProps) {
  const isExpanded = expandedFolders.has(item.id);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-700 cursor-pointer rounded group`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => item.type === "folder" && onToggleFolder(item.id)}
      >
        {item.type === "folder" ? (
          <>
            {hasChildren && (
              <button className="p-0.5">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                )}
              </button>
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <div className="w-4"></div>
            <FileText className="w-4 h-4 text-gray-400" />
          </>
        )}

        <span className="text-sm text-gray-200 flex-1">{item.name}</span>

        {/* Actions on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {item.type === "folder" && isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer() {
  const { files } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(
    new Set(["1", "2", "5"]),
  ); // Pre-expand some folders

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-200">Explorer</h2>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="mb-2">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2 px-2">
              Project Files
            </div>
            {filteredFiles.map((file) => (
              <FileTreeItem
                key={file.id}
                item={file}
                level={0}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2 px-2">
              Quick Actions
            </div>
            <div className="space-y-1 px-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-300 hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New File
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-300 hover:bg-gray-700"
              >
                <Folder className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

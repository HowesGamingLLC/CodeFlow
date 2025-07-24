import React, { useState, useRef, useEffect } from "react";
import {
  Files,
  Search,
  GitBranch,
  Package,
  Settings,
  FolderOpen,
  FileText,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
  Bot,
  Eye,
  RefreshCw,
  TestTube,
  FileCode,
  Languages,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIDEStore, IDEFile } from "@/lib/ide-store";

const sidebarTabs = [
  { id: "files", name: "Files", icon: Files },
  { id: "search", name: "Search", icon: Search },
  { id: "git", name: "Git", icon: GitBranch },
  { id: "packages", name: "Packages", icon: Package },
  { id: "settings", name: "Settings", icon: Settings },
];

interface FileTreeItemProps {
  file: IDEFile;
  level: number;
  onSelect: (file: IDEFile) => void;
  onDelete: (fileId: string) => void;
}

function FileTreeItem({ file, level, onSelect, onDelete }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const {
    openFiles,
    activeFileId,
    explainCode,
    generateTests,
    refactorCode,
    generateAPIDocs,
    convertLanguage
  } = useIDEStore();

  const isOpen = openFiles.some((f) => f.id === file.id);
  const isActive = activeFileId === file.id;

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showContextMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!file.isDirectory) {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    }
  };

  const handleAIAction = (action: string) => {
    switch (action) {
      case 'explain':
        explainCode(file.id);
        break;
      case 'test':
        generateTests(file.id);
        break;
      case 'refactor-async':
        refactorCode(file.id, 'async');
        break;
      case 'refactor-split':
        refactorCode(file.id, 'split');
        break;
      case 'refactor-optimize':
        refactorCode(file.id, 'optimize');
        break;
      case 'docs':
        generateAPIDocs(file.id);
        break;
      case 'convert-ts':
        convertLanguage(file.id, 'typescript');
        break;
      case 'convert-py':
        convertLanguage(file.id, 'python');
        break;
    }
    setShowContextMenu(false);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-2 py-1 px-2 cursor-pointer rounded text-sm group hover:bg-gray-700",
          isActive && "bg-blue-600/20 text-blue-400",
          isOpen && !isActive && "text-gray-200",
          !isOpen && !isActive && "text-gray-400",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(file)}
        onContextMenu={handleContextMenu}
      >
        {file.isDirectory ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {file.isDirectory ? (
          <FolderOpen className="w-4 h-4 text-blue-400" />
        ) : (
          <FileText className="w-4 h-4" />
        )}

        <span className="flex-1 truncate">{file.name}</span>

        {file.isModified && (
          <div className="w-2 h-2 bg-orange-400 rounded-full" />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-600 rounded"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* AI Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-1 min-w-48"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
        >
          <div className="px-3 py-1 text-xs font-medium text-gray-400 border-b border-gray-600">
            AI Actions for {file.name}
          </div>

          <button
            onClick={() => handleAIAction('explain')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            Explain this file
          </button>

          <button
            onClick={() => handleAIAction('test')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <TestTube className="w-4 h-4 text-cyan-400" />
            Generate tests
          </button>

          <div className="px-3 py-1 text-xs font-medium text-gray-400 border-b border-gray-600">
            Refactor
          </div>

          <button
            onClick={() => handleAIAction('refactor-async')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 text-green-400" />
            Convert to async/await
          </button>

          <button
            onClick={() => handleAIAction('refactor-split')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <FileCode className="w-4 h-4 text-green-400" />
            Split into smaller functions
          </button>

          <button
            onClick={() => handleAIAction('refactor-optimize')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <Wrench className="w-4 h-4 text-green-400" />
            Optimize performance
          </button>

          <div className="px-3 py-1 text-xs font-medium text-gray-400 border-b border-gray-600">
            Convert & Generate
          </div>

          <button
            onClick={() => handleAIAction('docs')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            Generate API docs
          </button>

          <button
            onClick={() => handleAIAction('convert-ts')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <Languages className="w-4 h-4 text-indigo-400" />
            Convert to TypeScript
          </button>

          <button
            onClick={() => handleAIAction('convert-py')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            <Languages className="w-4 h-4 text-yellow-400" />
            Convert to Python
          </button>
        </div>
      )}

      {file.isDirectory && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeItem
              key={child.id}
              file={child}
              level={level + 1}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function IDESidebar() {
  const [activeTab, setActiveTab] = useState("files");
  const [searchQuery, setSearchQuery] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);

  const { fileTree, openFile, deleteFile, createFile, currentProject } =
    useIDEStore();

  const handleFileSelect = (file: IDEFile) => {
    if (!file.isDirectory) {
      openFile(file.id);
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      createFile(newFileName.trim());
      setNewFileName("");
      setShowNewFile(false);
    }
  };

  const filteredFiles = fileTree.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "files":
        return (
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-200">Files</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNewFile(true)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
              />

              {showNewFile && (
                <div className="mt-2 flex gap-1">
                  <Input
                    placeholder="filename.ext"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFile();
                      if (e.key === "Escape") setShowNewFile(false);
                    }}
                    className="h-7 text-xs bg-gray-700 border-gray-600"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleCreateFile}
                    className="h-7 px-2 text-xs"
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {currentProject ? (
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-2">
                      {currentProject.name}
                    </div>
                    {filteredFiles.map((file) => (
                      <FileTreeItem
                        key={file.id}
                        file={file}
                        level={0}
                        onSelect={handleFileSelect}
                        onDelete={deleteFile}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No project open</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );

      case "search":
        return (
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-200 mb-3">Search</h3>
            <Input
              placeholder="Search in files..."
              className="mb-3 bg-gray-700 border-gray-600 text-gray-200"
            />
            <div className="text-sm text-gray-400">
              Search functionality coming soon...
            </div>
          </div>
        );

      case "git":
        return (
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-200 mb-3">
              Source Control
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Initialize Repository
              </Button>
              <div className="text-sm text-gray-400">
                No git repository detected
              </div>
            </div>
          </div>
        );

      case "packages":
        return (
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-200 mb-3">Packages</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Install Package
              </Button>
              <div className="text-sm text-gray-400">No packages installed</div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-200 mb-3">Settings</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Theme: Dark</div>
              <div>Font Size: 14px</div>
              <div>Tab Size: 2</div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Settings className="w-4 h-4 mr-2" />
                Open Settings
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Tab Icons */}
      <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-2">
        {sidebarTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded mb-1 transition-colors",
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-gray-200",
            )}
            title={tab.name}
          >
            <tab.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-gray-850">{renderTabContent()}</div>
    </div>
  );
}

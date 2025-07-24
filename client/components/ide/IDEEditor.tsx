import React, { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import {
  X,
  Save,
  MoreHorizontal,
  Circle,
  Play,
  Settings,
  Share,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIDEStore } from "@/lib/ide-store";
import { cn } from "@/lib/utils";

export function IDEEditor() {
  const {
    openFiles,
    activeFileId,
    updateFileContent,
    closeFile,
    openFile,
    executeCode,
    isExecuting,
  } = useIDEStore();

  const editorRef = useRef(null);
  const activeFile = openFiles.find((f) => f.id === activeFileId);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile.id, value);
    }
  };

  const handleRunFile = () => {
    if (activeFile) {
      executeCode(activeFile.content, activeFile.language);
    }
  };

  const getLanguageFromExtension = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      md: "markdown",
      sql: "sql",
      yml: "yaml",
      yaml: "yaml",
      xml: "xml",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      cpp: "cpp",
      c: "c",
      java: "java",
    };
    return languageMap[ext || ""] || "plaintext";
  };

  if (openFiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No files open</h3>
          <p className="text-sm">
            Open a file from the sidebar to start coding
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-800 border-b border-gray-700 overflow-x-auto">
        {openFiles.map((file) => (
          <div
            key={file.id}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border-r border-gray-700 cursor-pointer group min-w-0 max-w-48",
              activeFileId === file.id
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-750",
            )}
            onClick={() => openFile(file.id)}
          >
            <Circle
              className={cn(
                "w-2 h-2 flex-shrink-0",
                file.isModified
                  ? "fill-orange-400 text-orange-400"
                  : "fill-gray-500 text-gray-500",
              )}
            />
            <span className="text-sm truncate">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-600 rounded flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Tab Actions */}
        <div className="flex items-center ml-auto p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem
                onClick={handleRunFile}
                disabled={!activeFile || isExecuting}
              >
                <Play className="w-4 h-4 mr-2" />
                Run File
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem>
                <Save className="w-4 h-4 mr-2" />
                Save All
              </DropdownMenuItem>
              <DropdownMenuItem>
                <X className="w-4 h-4 mr-2" />
                Close All
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem>
                <Share className="w-4 h-4 mr-2" />
                Share File
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {activeFile ? (
          <Editor
            ref={editorRef}
            height="100%"
            language={getLanguageFromExtension(activeFile.name)}
            value={activeFile.content}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: "on",
              lineNumbers: "on",
              renderWhitespace: "selection",
              bracketPairColorization: { enabled: true },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnCommitCharacter: true,
              acceptSuggestionOnEnter: "on",
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },
              parameterHints: { enabled: true },
              hover: { enabled: true },
              contextmenu: true,
              mouseWheelZoom: true,
              cursorBlinking: "smooth",
              renderLineHighlight: "line",
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              folding: true,
              foldingHighlight: true,
              foldingStrategy: "indentation",
              showFoldingControls: "mouseover",
              unfoldOnClickAfterEndOfLine: false,
              formatOnType: true,
              formatOnPaste: true,
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                Select a file to edit
              </h3>
              <p className="text-sm">Choose a file from the tabs above</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {activeFile && (
        <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-3 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>
              {getLanguageFromExtension(activeFile.name).toUpperCase()}
            </span>
            <span>UTF-8</span>
            <span>LF</span>
          </div>
          <div className="flex items-center gap-4">
            {activeFile.isModified && (
              <span className="text-orange-400">Modified</span>
            )}
            <span>Ln 1, Col 1</span>
          </div>
        </div>
      )}
    </div>
  );
}

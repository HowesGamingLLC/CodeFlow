import React from "react";
import { Editor } from "@monaco-editor/react";
import { ChevronDown, GitBranch, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

export function RightPanel() {
  const {
    pages,
    selectedPage,
    setSelectedPage,
    updatePageContent,
    pushCodeUpdate,
    isPreviewVisible,
    togglePreview,
    buildStatus,
  } = useWorkspaceStore();

  const currentPage = pages.find((page) => page.id === selectedPage);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && currentPage) {
      updatePageContent(currentPage.id, value);
    }
  };

  const handlePushCode = () => {
    pushCodeUpdate();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-4">
          {/* Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Page:</span>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {pages.map((page) => (
                  <SelectItem
                    key={page.id}
                    value={page.id}
                    className="text-gray-200 hover:bg-gray-600"
                  >
                    {page.name} - {page.path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current file info */}
          <div className="text-sm text-gray-400">{currentPage?.name}.tsx</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreview}
            className={cn(
              "bg-gray-700 border-gray-600 hover:bg-gray-600",
              isPreviewVisible && "bg-blue-600 hover:bg-blue-700",
            )}
          >
            {isPreviewVisible ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>

          {/* Push Code Update Button */}
          <Button
            onClick={handlePushCode}
            disabled={buildStatus === "building"}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            {buildStatus === "building" ? "Pushing..." : "Push Code Update"}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div
          className={cn(
            "transition-all duration-300",
            isPreviewVisible ? "w-1/2" : "w-full",
          )}
        >
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={currentPage?.content || ""}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              lineNumbers: "on",
              renderWhitespace: "selection",
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        {/* Live Preview */}
        {isPreviewVisible && (
          <div className="w-1/2 border-l border-gray-700 bg-white">
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Live Preview
                </h1>
                <p className="text-gray-300">
                  Preview of {currentPage?.name} page
                </p>
                <div className="mt-8 p-6 bg-black/20 rounded-lg backdrop-blur-sm">
                  <p className="text-white">
                    This would show a live preview of your {currentPage?.name}{" "}
                    component
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

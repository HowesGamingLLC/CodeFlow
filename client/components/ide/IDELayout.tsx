import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { IDESidebar } from "./IDESidebar";
import { IDEEditor } from "./IDEEditor";
import { IDETerminal } from "./IDETerminal";
import { JoseyAssistant } from "./JoseyAssistant";
import { CodePreview } from "./CodePreview";
import { IDEHeader } from "./IDEHeader";
import { useIDEStore } from "@/lib/ide-store";

export function IDELayout() {
  const { layout, updateLayout, joseyPanelOpen } = useIDEStore();
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <IDEHeader />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Sidebar */}
          <Panel
            defaultSize={25}
            minSize={15}
            maxSize={40}
            className="bg-gray-800 border-r border-gray-700"
          >
            <IDESidebar />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />

          {/* Main Editor Area */}
          <Panel defaultSize={joseyPanelOpen ? 50 : 75}>
            <PanelGroup direction="vertical">
              {/* Editor */}
              <Panel
                defaultSize={
                  previewVisible && terminalVisible
                    ? 50
                    : terminalVisible
                      ? 70
                      : previewVisible
                        ? 70
                        : 100
                }
                minSize={25}
                className="bg-gray-900"
              >
                <IDEEditor />
              </Panel>

              {/* Code Preview */}
              {previewVisible && (
                <>
                  <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
                  <Panel
                    defaultSize={terminalVisible ? 25 : 30}
                    minSize={15}
                    maxSize={50}
                    className="bg-gray-900"
                  >
                    <CodePreview />
                  </Panel>
                </>
              )}

              {/* Terminal */}
              {terminalVisible && (
                <>
                  <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
                  <Panel
                    defaultSize={25}
                    minSize={15}
                    maxSize={40}
                    className="bg-gray-850"
                  >
                    <IDETerminal
                      onToggle={() => setTerminalVisible(!terminalVisible)}
                    />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          {/* Josey Assistant Panel */}
          {joseyPanelOpen && (
            <>
              <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
              <Panel
                defaultSize={25}
                minSize={20}
                maxSize={40}
                className="bg-gray-800 border-l border-gray-700"
              >
                <JoseyAssistant />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}

import React from "react";
import { LeftPanel } from "@/components/workspace/LeftPanel";
import { RightPanel } from "@/components/workspace/RightPanel";

export default function Workspace() {
  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex overflow-hidden">
      {/* Left Panel - 35% width */}
      <div className="w-[35%] border-r border-gray-700">
        <LeftPanel />
      </div>

      {/* Right Panel - 65% width */}
      <div className="w-[65%]">
        <RightPanel />
      </div>
    </div>
  );
}

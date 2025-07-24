import React, { useState } from "react";
import { NetlifySidebar } from "./NetlifySidebar";
import { NetlifyHeader } from "./NetlifyHeader";
import { NetlifyDashboard } from "./NetlifyDashboard";
import { SiteDetail } from "./SiteDetail";
import { TeamSettings } from "./TeamSettings";
import { useNetlifyStore } from "@/lib/netlify-store";

export function NetlifyLayout() {
  const [activeView, setActiveView] = useState<"dashboard" | "site" | "team">(
    "dashboard",
  );
  const { currentSite } = useNetlifyStore();

  React.useEffect(() => {
    if (currentSite) {
      setActiveView("site");
    }
  }, [currentSite]);

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <NetlifyDashboard />;
      case "site":
        return currentSite ? (
          <SiteDetail site={currentSite} />
        ) : (
          <NetlifyDashboard />
        );
      case "team":
        return <TeamSettings />;
      default:
        return <NetlifyDashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <NetlifySidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NetlifyHeader />
        <main className="flex-1 overflow-y-auto">{renderMainContent()}</main>
      </div>
    </div>
  );
}

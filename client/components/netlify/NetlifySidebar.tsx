import React from "react";
import {
  LayoutDashboard,
  Globe,
  Users,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
  Github,
  ExternalLink,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNetlifyStore } from "@/lib/netlify-store";

interface NetlifySidebarProps {
  activeView: string;
  onViewChange: (view: "dashboard" | "site" | "team") => void;
}

export function NetlifySidebar({
  activeView,
  onViewChange,
}: NetlifySidebarProps) {
  const { sites, currentSite, selectSite, currentTeam } = useNetlifyStore();
  const [sitesCollapsed, setSitesCollapsed] = React.useState(false);

  const getDeployStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "text-green-500";
      case "building":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getDeployStatusText = (status: string) => {
    switch (status) {
      case "deployed":
        return "Published";
      case "building":
        return "Building";
      case "failed":
        return "Failed";
      default:
        return "Draft";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Team Section */}
      {currentTeam && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">
                {currentTeam.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentTeam.name}
              </p>
              <Badge variant="outline" className="text-xs capitalize">
                {currentTeam.plan}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={activeView === "dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("dashboard")}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>

        {/* Sites Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setSitesCollapsed(!sitesCollapsed)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {sitesCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Sites ({sites.length})
            </button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {!sitesCollapsed && (
            <div className="space-y-1">
              {sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    selectSite(site.id);
                    onViewChange("site");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                    currentSite?.id === site.id &&
                      "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Circle
                      className={cn(
                        "w-2 h-2 fill-current",
                        getDeployStatusColor(site.deployStatus),
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {site.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getDeployStatusText(site.deployStatus)}
                      </p>
                    </div>
                  </div>
                  {site.gitProvider && (
                    <Github className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              ))}

              {sites.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No sites yet</p>
                  <p className="text-xs">
                    Create your first site to get started
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team Management */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant={activeView === "team" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("team")}
          >
            <Users className="w-4 h-4 mr-2" />
            Team settings
          </Button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>

        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AppStop.pro v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

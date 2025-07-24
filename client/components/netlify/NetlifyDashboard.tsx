import React from "react";
import {
  Globe,
  Zap,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink,
  Plus,
  Github,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNetlifyStore } from "@/lib/netlify-store";
import { CreateSiteModal } from "./CreateSiteModal";

export function NetlifyDashboard() {
  const { sites, builds, dashboardStats, currentTeam, selectSite } =
    useNetlifyStore();
  const [showCreateSite, setShowCreateSite] = React.useState(false);

  const recentBuilds = builds.slice(0, 5);
  const activeSites = sites.filter((site) => site.status === "active");

  const getDeployStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "building":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBuildStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "building":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your sites.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateSite(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New site
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalSites}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeSites.length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Builds
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalBuilds}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.successfulBuilds} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Build Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (dashboardStats.successfulBuilds /
                    dashboardStats.totalBuilds) *
                    100,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                {currentTeam?.plan} plan
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Recent Sites
              </CardTitle>
              <CardDescription>
                Your most recently updated sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sites.slice(0, 5).map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => selectSite(site.id)}
                  >
                    <div className="flex items-center gap-3">
                      {getDeployStatusIcon(site.deployStatus)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {site.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {site.defaultDomain}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {site.gitProvider && (
                        <Github className="w-4 h-4 text-gray-400" />
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}

                {sites.length === 0 && (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No sites yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Deploy your first site to get started
                    </p>
                    <Button onClick={() => setShowCreateSite(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create your first site
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Builds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Builds
              </CardTitle>
              <CardDescription>
                Latest build activity across all sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBuilds.map((build) => {
                  const site = sites.find((s) => s.id === build.siteId);
                  return (
                    <div
                      key={build.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getBuildStatusIcon(build.status)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {site?.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {build.commitMessage || "Manual deploy"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge
                          variant={
                            build.status === "success"
                              ? "default"
                              : build.status === "building"
                                ? "secondary"
                                : build.status === "failed"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {build.status}
                        </Badge>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {build.createdAt.toRelativeTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {recentBuilds.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No recent builds
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => setShowCreateSite(true)}
              >
                <Plus className="w-6 h-6" />
                <span>Deploy new site</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => {
                  /* Connect GitHub */
                }}
              >
                <Github className="w-6 h-6" />
                <span>Connect GitHub</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => {
                  /* Invite team member */
                }}
              >
                <Users className="w-6 h-6" />
                <span>Invite team member</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateSiteModal
        open={showCreateSite}
        onClose={() => setShowCreateSite(false)}
      />
    </>
  );
}

import React, { useState } from "react";
import { Site } from "@shared/netlify-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  Settings,
  Activity,
  Globe,
  Play,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Bot,
  GitBranch,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";
import { useNetlifyStore } from "@/lib/netlify-store";
import { JoseyBuildOptimizer } from "./JoseyBuildOptimizer";

interface SiteDetailProps {
  site: Site;
}

export function SiteDetail({ site }: SiteDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { builds, triggerBuild } = useNetlifyStore();
  const siteBuilds = builds.filter((b) => b.siteId === site.id);

  const handleTriggerBuild = () => {
    triggerBuild({
      siteId: site.id,
      branch: site.gitBranch,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {site.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {site.description || "No description provided"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={handleTriggerBuild}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Site Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Site Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Status
              </p>
              <div className="flex items-center gap-2">
                {site.deployStatus === "deployed" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {site.deployStatus === "building" && (
                  <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
                )}
                {site.deployStatus === "failed" && (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge
                  variant={
                    site.deployStatus === "deployed"
                      ? "default"
                      : site.deployStatus === "building"
                        ? "secondary"
                        : site.deployStatus === "failed"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {site.deployStatus}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Default Domain
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://${site.defaultDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 flex items-center gap-1 text-sm"
                >
                  {site.defaultDomain}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Last Deploy
              </p>
              <p className="text-sm">
                {site.lastDeployAt
                  ? site.lastDeployAt.toRelativeTimeString()
                  : "Never"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Git Branch
              </p>
              <div className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-gray-400" />
                <p className="text-sm">{site.gitBranch}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="builds">Builds</TabsTrigger>
          <TabsTrigger value="josey">
            <Bot className="w-4 h-4 mr-2" />
            Josey AI
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Builds
                </CardTitle>
                <CardDescription>
                  Latest build activity for this site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {siteBuilds.length > 0 ? (
                  <div className="space-y-3">
                    {siteBuilds.slice(0, 5).map((build) => (
                      <div
                        key={build.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {build.status === "success" && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {build.status === "building" && (
                            <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
                          )}
                          {build.status === "failed" && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {build.commitMessage || "Manual deploy"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {build.createdAt.toRelativeTimeString()}
                            </p>
                          </div>
                        </div>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No builds yet. Trigger your first deploy!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Build and deploy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Build Command
                  </p>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {site.buildCommand || "Not configured"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Publish Directory
                  </p>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {site.publishDirectory}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Node Version
                  </p>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {site.nodeVersion}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Environment Variables
                  </p>
                  <p className="text-sm">
                    {Object.keys(site.environmentVariables).length} variables
                    configured
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="builds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Build History</CardTitle>
              <CardDescription>
                All builds and deployments for this site
              </CardDescription>
            </CardHeader>
            <CardContent>
              {siteBuilds.length > 0 ? (
                <div className="space-y-4">
                  {siteBuilds.map((build) => (
                    <div
                      key={build.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {build.status === "success" && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {build.status === "building" && (
                            <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
                          )}
                          {build.status === "failed" && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">
                              {build.commitMessage || "Manual deploy"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {build.commitSha &&
                                `${build.commitSha.substring(0, 7)} • `}
                              {build.createdAt.toRelativeTimeString()}
                              {build.duration && ` • ${build.duration}s`}
                            </p>
                          </div>
                        </div>
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
                      </div>
                      {build.buildLogs && (
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto max-h-32">
                          {build.buildLogs}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    No builds yet
                  </p>
                  <p className="text-gray-500 mb-4">
                    Trigger your first build to see it here
                  </p>
                  <Button onClick={handleTriggerBuild}>
                    <Play className="w-4 h-4 mr-2" />
                    Trigger Build
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="josey">
          <JoseyBuildOptimizer
            site={site}
            builds={siteBuilds}
            onOptimizationApplied={(opt) => {
              console.log("Applied optimization:", opt);
              // Here you would typically update the site configuration
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Site Analytics
              </CardTitle>
              <CardDescription>Traffic and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Analytics Coming Soon
                </p>
                <p className="text-gray-500">
                  Detailed analytics and performance metrics will be available
                  here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure your site's build and deployment settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Settings Panel Coming Soon
                </p>
                <p className="text-gray-500">
                  Site configuration options will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

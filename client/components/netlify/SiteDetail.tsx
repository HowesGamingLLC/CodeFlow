import React from 'react';
import { Site } from '@shared/netlify-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Settings, 
  Activity, 
  Globe,
  Play,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SiteDetailProps {
  site: Site;
}

export function SiteDetail({ site }: SiteDetailProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {site.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {site.description || 'No description provided'}
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
          <Button className="bg-blue-600 hover:bg-blue-700">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <div className="flex items-center gap-2">
                {site.deployStatus === 'deployed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {site.deployStatus === 'building' && <Clock className="w-4 h-4 text-yellow-500 animate-spin" />}
                {site.deployStatus === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                <Badge variant={
                  site.deployStatus === 'deployed' ? 'default' :
                  site.deployStatus === 'building' ? 'secondary' :
                  site.deployStatus === 'failed' ? 'destructive' : 'outline'
                }>
                  {site.deployStatus}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Default Domain</p>
              <div className="flex items-center gap-2">
                <a 
                  href={`https://${site.defaultDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 flex items-center gap-1"
                >
                  {site.defaultDomain}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Deploy</p>
              <p className="text-sm">
                {site.lastDeployAt ? site.lastDeployAt.toRelativeTimeString() : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for other sections */}
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
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Build history will appear here
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Build and deploy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Build Command</p>
              <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {site.buildCommand || 'Not configured'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Publish Directory</p>
              <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {site.publishDirectory}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Node Version</p>
              <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {site.nodeVersion}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

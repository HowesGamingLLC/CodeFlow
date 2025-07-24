import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  Github,
  GitBranch,
  Folder,
  Zap,
  Globe,
  Code,
} from "lucide-react";
import { useNetlifyStore } from "@/lib/netlify-store";
import { CreateSiteRequest } from "@shared/netlify-types";

interface CreateSiteModalProps {
  open: boolean;
  onClose: () => void;
}

const siteSchema = z.object({
  name: z.string().min(1, "Site name is required").max(50, "Name too long"),
  gitRepo: z.string().optional(),
  gitBranch: z.string().default("main"),
  buildCommand: z.string().optional(),
  publishDirectory: z.string().default("dist"),
});

type SiteForm = z.infer<typeof siteSchema>;

const frameworks = [
  {
    id: "react",
    name: "React",
    icon: Code,
    buildCommand: "npm run build",
    publishDirectory: "build",
    description: "React application",
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: Code,
    buildCommand: "npm run build",
    publishDirectory: "dist",
    description: "Vue.js application",
  },
  {
    id: "angular",
    name: "Angular",
    icon: Code,
    buildCommand: "npm run build",
    publishDirectory: "dist",
    description: "Angular application",
  },
  {
    id: "next",
    name: "Next.js",
    icon: Code,
    buildCommand: "npm run build && npm run export",
    publishDirectory: "out",
    description: "Next.js static export",
  },
  {
    id: "gatsby",
    name: "Gatsby",
    icon: Code,
    buildCommand: "npm run build",
    publishDirectory: "public",
    description: "Gatsby static site",
  },
  {
    id: "vite",
    name: "Vite",
    icon: Zap,
    buildCommand: "npm run build",
    publishDirectory: "dist",
    description: "Vite application",
  },
  {
    id: "static",
    name: "Static HTML",
    icon: Globe,
    buildCommand: "",
    publishDirectory: ".",
    description: "Static HTML/CSS/JS",
  },
];

export function CreateSiteModal({ open, onClose }: CreateSiteModalProps) {
  const [deployMethod, setDeployMethod] = useState<"git" | "upload">("git");
  const [selectedFramework, setSelectedFramework] = useState<string>("react");
  const [isLoading, setIsLoading] = useState(false);

  const { createSite, currentTeam, loadGitHubRepos, user } = useNetlifyStore();
  const [gitHubRepos, setGitHubRepos] = useState<any[]>([]);

  const form = useForm<SiteForm>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: "",
      gitBranch: "main",
      buildCommand: frameworks[0].buildCommand,
      publishDirectory: frameworks[0].publishDirectory,
    },
  });

  React.useEffect(() => {
    if (open && user?.githubConnected) {
      loadGitHubRepos().then(setGitHubRepos);
    }
  }, [open, user?.githubConnected, loadGitHubRepos]);

  React.useEffect(() => {
    const framework = frameworks.find((f) => f.id === selectedFramework);
    if (framework) {
      form.setValue("buildCommand", framework.buildCommand);
      form.setValue("publishDirectory", framework.publishDirectory);
    }
  }, [selectedFramework, form]);

  const onSubmit = async (data: SiteForm) => {
    if (!currentTeam) return;

    setIsLoading(true);
    try {
      const siteData: CreateSiteRequest = {
        name: data.name,
        teamId: currentTeam.id,
        gitRepo: deployMethod === "git" ? data.gitRepo : undefined,
        gitBranch: data.gitBranch,
        buildCommand: data.buildCommand,
        publishDirectory: data.publishDirectory,
      };

      const success = await createSite(siteData);
      if (success) {
        onClose();
        form.reset();
        setSelectedFramework("react");
        setDeployMethod("git");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a new site</DialogTitle>
          <DialogDescription>
            Deploy your site in seconds. Choose how you want to deploy.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={deployMethod}
          onValueChange={(value) => setDeployMethod(value as any)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="git" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              Git Repository
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              File Upload
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Site Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="my-awesome-site"
                        className="h-11"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be your site's subdomain:{" "}
                      {field.value
                        ? `${field.value.toLowerCase().replace(/\s+/g, "-")}.appstop.pro`
                        : "site-name.appstop.pro"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <TabsContent value="git" className="space-y-4">
                {/* Git Repository */}
                <FormField
                  control={form.control}
                  name="gitRepo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Git repository</FormLabel>
                      <FormControl>
                        {user?.githubConnected ? (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select a repository" />
                            </SelectTrigger>
                            <SelectContent>
                              {gitHubRepos.map((repo) => (
                                <SelectItem
                                  key={repo.full_name}
                                  value={repo.full_name}
                                >
                                  <div className="flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    {repo.full_name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                            <Github className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Connect your GitHub account to select
                                repositories
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              Connect GitHub
                            </Button>
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Branch */}
                <FormField
                  control={form.control}
                  name="gitBranch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch to deploy</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="main"
                            className="h-11 pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload your site
                    </CardTitle>
                    <CardDescription>
                      Drag and drop your site folder here, or click to browse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Drop your files here
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Or click to browse files
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Framework Detection */}
              <div>
                <Label className="text-base font-medium">
                  Framework preset
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Choose your framework for optimized build settings
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {frameworks.map((framework) => {
                    const Icon = framework.icon;
                    return (
                      <button
                        key={framework.id}
                        type="button"
                        onClick={() => setSelectedFramework(framework.id)}
                        className={`p-3 border rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          selectedFramework === framework.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2 text-gray-600 dark:text-gray-400" />
                        <p className="font-medium text-sm">{framework.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {framework.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Build Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buildCommand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Build command</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="npm run build"
                          className="h-11"
                        />
                      </FormControl>
                      <FormDescription>
                        Command to build your site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishDirectory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish directory</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="dist"
                            className="h-11 pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Directory containing built files
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Creating..." : "Deploy site"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

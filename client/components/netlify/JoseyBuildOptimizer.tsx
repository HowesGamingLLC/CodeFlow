import React, { useState } from "react";
import {
  Bot,
  Lightbulb,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Code,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  Send,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Site, Build } from "@shared/netlify-types";

interface JoseyBuildOptimizerProps {
  site: Site;
  builds: Build[];
  onOptimizationApplied: (optimization: any) => void;
}

interface BuildIssue {
  type: "error" | "warning" | "info";
  category: "performance" | "security" | "configuration" | "dependencies";
  title: string;
  description: string;
  solution: string;
  impact: "low" | "medium" | "high";
  estimatedSavings?: string;
}

interface BuildOptimization {
  id: string;
  title: string;
  description: string;
  category: "performance" | "security" | "build-time" | "bundle-size";
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
  estimatedSavings: string;
  steps: string[];
  codeExample?: string;
}

const mockAnalyzeFramework = (
  site: Site,
): { framework: string; confidence: number } => {
  if (site.buildCommand?.includes("next"))
    return { framework: "Next.js", confidence: 0.95 };
  if (site.buildCommand?.includes("gatsby"))
    return { framework: "Gatsby", confidence: 0.9 };
  if (site.buildCommand?.includes("vue"))
    return { framework: "Vue.js", confidence: 0.85 };
  if (site.buildCommand?.includes("angular"))
    return { framework: "Angular", confidence: 0.8 };
  if (site.publishDirectory === "build")
    return { framework: "React", confidence: 0.7 };
  return { framework: "Static", confidence: 0.6 };
};

const generateBuildIssues = (site: Site, builds: Build[]): BuildIssue[] => {
  const issues: BuildIssue[] = [];
  const failedBuilds = builds.filter((b) => b.status === "failed");
  const { framework } = mockAnalyzeFramework(site);

  if (failedBuilds.length > 0) {
    issues.push({
      type: "error",
      category: "configuration",
      title: "Recent Build Failures",
      description: `${failedBuilds.length} out of your last ${builds.length} builds have failed`,
      solution:
        "Check build logs for dependency issues or incorrect build commands",
      impact: "high",
    });
  }

  if (!site.buildCommand) {
    issues.push({
      type: "warning",
      category: "configuration",
      title: "No Build Command Specified",
      description:
        "Your site might not be building optimally without a proper build command",
      solution: `Set a build command like "npm run build" for ${framework} projects`,
      impact: "medium",
    });
  }

  if (site.nodeVersion === "16.x") {
    issues.push({
      type: "warning",
      category: "security",
      title: "Outdated Node.js Version",
      description: "You're using Node.js 16.x which has reached end-of-life",
      solution:
        "Update to Node.js 18.x or later for security and performance improvements",
      impact: "medium",
    });
  }

  if (framework === "React" && !site.buildCommand?.includes("CI=false")) {
    issues.push({
      type: "info",
      category: "configuration",
      title: "React Build Warnings",
      description: "Build warnings might cause deployment failures",
      solution: "Add CI=false to your build command to ignore warnings",
      impact: "low",
    });
  }

  return issues;
};

const generateOptimizations = (site: Site): BuildOptimization[] => {
  const { framework } = mockAnalyzeFramework(site);
  const optimizations: BuildOptimization[] = [];

  // Performance optimizations
  optimizations.push({
    id: "webpack-bundle-analyzer",
    title: "Bundle Size Analysis",
    description:
      "Analyze your bundle size to identify large dependencies and optimize your build",
    category: "bundle-size",
    difficulty: "easy",
    impact: "high",
    estimatedSavings: "20-50% smaller bundles",
    steps: [
      "Install webpack-bundle-analyzer",
      "Add analysis script to package.json",
      "Run npm run analyze after builds",
      "Identify and remove unused dependencies",
    ],
    codeExample: `npm install --save-dev webpack-bundle-analyzer
// Add to package.json scripts:
"analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"`,
  });

  if (framework === "React") {
    optimizations.push({
      id: "react-optimization",
      title: "React Performance Optimization",
      description:
        "Implement code splitting and lazy loading for better performance",
      category: "performance",
      difficulty: "medium",
      impact: "high",
      estimatedSavings: "30-60% faster initial load",
      steps: [
        "Implement React.lazy() for route-based code splitting",
        "Use React.memo() for expensive components",
        "Add Suspense boundaries for loading states",
        "Optimize re-renders with useCallback and useMemo",
      ],
      codeExample: `const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}`,
    });
  }

  optimizations.push({
    id: "image-optimization",
    title: "Image Optimization",
    description:
      "Optimize images for faster loading and better Core Web Vitals scores",
    category: "performance",
    difficulty: "easy",
    impact: "medium",
    estimatedSavings: "40-70% smaller images",
    steps: [
      "Convert images to WebP format",
      "Implement responsive images with srcset",
      "Add lazy loading for images",
      "Use image CDN for automatic optimization",
    ],
    codeExample: `<img 
  src="image.webp" 
  srcSet="image-400.webp 400w, image-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  loading="lazy"
  alt="Description"
/>`,
  });

  optimizations.push({
    id: "build-caching",
    title: "Build Caching Strategy",
    description: "Implement intelligent caching to reduce build times",
    category: "build-time",
    difficulty: "medium",
    impact: "high",
    estimatedSavings: "50-80% faster builds",
    steps: [
      "Enable npm/yarn cache in CI/CD",
      "Cache node_modules between builds",
      "Use build output caching",
      "Implement incremental builds",
    ],
  });

  optimizations.push({
    id: "security-headers",
    title: "Security Headers",
    description:
      "Add security headers to protect your site from common vulnerabilities",
    category: "security",
    difficulty: "easy",
    impact: "medium",
    estimatedSavings: "Improved security score",
    steps: [
      "Add Content Security Policy (CSP)",
      "Enable HSTS headers",
      "Set X-Frame-Options",
      "Configure referrer policy",
    ],
    codeExample: `// netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'"`,
  });

  return optimizations;
};

export function JoseyBuildOptimizer({
  site,
  builds,
  onOptimizationApplied,
}: JoseyBuildOptimizerProps) {
  const [activeTab, setActiveTab] = useState("analysis");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "josey",
      message: `👋 Hi! I'm Josey, your AI build optimization assistant. I've analyzed your ${site.name} site and found several opportunities to improve performance, security, and build times. What would you like to optimize first?`,
    },
  ]);

  const issues = generateBuildIssues(site, builds);
  const optimizations = generateOptimizations(site);
  const { framework, confidence } = mockAnalyzeFramework(site);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", message: chatMessage }]);

    // Mock AI response
    setTimeout(() => {
      const responses = [
        "Great question! Based on your site's configuration, I recommend starting with bundle size optimization. This typically provides the biggest performance improvement.",
        "I can help you implement that optimization. Let me walk you through the steps and provide the necessary code examples.",
        "That's a smart approach! For your framework setup, this optimization should reduce your build time significantly.",
        "Excellent choice! This security improvement will help protect your users and improve your site's trustworthiness.",
      ];

      setChatHistory((prev) => [
        ...prev,
        {
          role: "josey",
          message: responses[Math.floor(Math.random() * responses.length)],
        },
      ]);
    }, 1000);

    setChatMessage("");
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "security":
        return <Shield className="w-4 h-4 text-green-500" />;
      case "build-time":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "bundle-size":
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <Code className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AppStop.pro AI Optimizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered optimization for {site.name}
          </p>
        </div>
      </div>

      {/* Framework Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Framework Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Detected Framework: {framework}
              </p>
              <p className="text-sm text-gray-500">
                Confidence: {Math.round(confidence * 100)}%
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-purple-600 border-purple-200"
            >
              {framework}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          <TabsTrigger value="chat">Ask Josey</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Build Issues ({issues.length})
              </CardTitle>
              <CardDescription>
                Issues found in your current build configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    No issues found!
                  </p>
                  <p className="text-gray-500">
                    Your build configuration looks great.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {issue.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {issue.category}
                            </Badge>
                            <Badge
                              variant={
                                issue.impact === "high"
                                  ? "destructive"
                                  : issue.impact === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {issue.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {issue.description}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            💡 {issue.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-4">
          <div className="grid gap-4">
            {optimizations.map((opt) => (
              <Card key={opt.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(opt.category)}
                      <CardTitle className="text-lg">{opt.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        className={`text-xs border ${getDifficultyColor(opt.difficulty)}`}
                      >
                        {opt.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {opt.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{opt.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">
                      📈 Estimated Savings: {opt.estimatedSavings}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Implementation Steps:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {opt.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {opt.codeExample && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Code Example:
                      </h4>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-xs overflow-x-auto">
                        <code>{opt.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  <Button
                    onClick={() => onOptimizationApplied(opt)}
                    className="w-full"
                  >
                    Apply Optimization
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" />
                Chat with Josey
              </CardTitle>
              <CardDescription>
                Ask questions about optimizing your build and deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4">
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "josey" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask Josey about build optimizations..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>
                Detailed analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Reports Coming Soon
                </p>
                <p className="text-gray-500">
                  Detailed performance reports will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

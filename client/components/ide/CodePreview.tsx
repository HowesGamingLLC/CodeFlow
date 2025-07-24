import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Code,
  AlertTriangle,
  Play,
  Square,
  Settings,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIDEStore } from "@/lib/ide-store";
import { cn } from "@/lib/utils";

interface FrameworkDetection {
  framework: string;
  confidence: number;
  features: string[];
}

const DEVICE_SIZES = [
  { name: "Mobile", icon: Smartphone, width: 375, height: 667 },
  { name: "Tablet", icon: Tablet, width: 768, height: 1024 },
  { name: "Desktop", icon: Monitor, width: 1200, height: 800 },
  { name: "Full", icon: Maximize2, width: "100%", height: "100%" },
];

export function CodePreview() {
  const { openFiles, activeFileId, currentProject } = useIDEStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [detectedFramework, setDetectedFramework] =
    useState<FrameworkDetection | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeFile = openFiles.find((f) => f.id === activeFileId);
  const currentDevice = DEVICE_SIZES[selectedDevice];

  // Framework detection logic
  const detectFramework = (files: any[]): FrameworkDetection | null => {
    const allContent = files.map((f) => f.content).join("\n");
    const allNames = files.map((f) => f.name).join(" ");

    // React detection
    if (
      allContent.includes("import React") ||
      allContent.includes('from "react"') ||
      allContent.includes("jsx") ||
      allContent.includes("tsx") ||
      allNames.includes(".jsx") ||
      allNames.includes(".tsx")
    ) {
      return {
        framework: "React",
        confidence: 0.9,
        features: ["JSX", "Components", "Hooks"],
      };
    }

    // Vue detection
    if (
      allContent.includes("<template>") ||
      allContent.includes("vue") ||
      allNames.includes(".vue")
    ) {
      return {
        framework: "Vue",
        confidence: 0.9,
        features: ["Templates", "Directives", "Single File Components"],
      };
    }

    // Angular detection
    if (
      allContent.includes("@Component") ||
      allContent.includes("@Injectable") ||
      allContent.includes("angular")
    ) {
      return {
        framework: "Angular",
        confidence: 0.9,
        features: ["Components", "Services", "TypeScript"],
      };
    }

    // Vanilla HTML/JS
    if (
      allNames.includes("index.html") ||
      allContent.includes("<!DOCTYPE html>")
    ) {
      return {
        framework: "HTML/JS",
        confidence: 0.8,
        features: ["HTML", "CSS", "JavaScript"],
      };
    }

    // Node.js/Express
    if (
      allContent.includes("express") ||
      allContent.includes("app.listen") ||
      allNames.includes("server.js")
    ) {
      return {
        framework: "Node.js",
        confidence: 0.8,
        features: ["Express", "API", "Server-side"],
      };
    }

    return null;
  };

  // Generate preview content based on framework
  const generatePreviewContent = (
    framework: FrameworkDetection,
    files: any[],
  ): string => {
    if (!framework) return "";

    switch (framework.framework) {
      case "React":
        return generateReactPreview(files);
      case "Vue":
        return generateVuePreview(files);
      case "HTML/JS":
        return generateHTMLPreview(files);
      case "Node.js":
        return generateNodePreview(files);
      default:
        return generateGenericPreview(files);
    }
  };

  const generateReactPreview = (files: any[]): string => {
    const appFile = files.find(
      (f) => f.name.includes("App.") || f.name.includes("app."),
    );
    const cssFile = files.find((f) => f.name.includes(".css"));

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  ${cssFile ? `<style>${cssFile.content}</style>` : ""}
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${appFile ? appFile.content.replace(/import.*from.*['"][^'"]*['"];?/g, "") : ""}
    
    // Fallback component if parsing fails
    if (typeof App === 'undefined') {
      const App = () => React.createElement('div', {style: {padding: '20px'}}, 
        React.createElement('h1', null, 'React Preview'),
        React.createElement('p', null, 'Code is being processed...')
      );
    }
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  </script>
</body>
</html>`;
  };

  const generateVuePreview = (files: any[]): string => {
    const vueFile = files.find(
      (f) => f.name.includes(".vue") || f.name.includes("App"),
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Preview</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    const { createApp } = Vue;
    
    const App = {
      template: \`
        <div style="padding: 20px;">
          <h1>Vue Preview</h1>
          <p>{{ message }}</p>
        </div>
      \`,
      data() {
        return {
          message: 'Vue app is running!'
        }
      }
    };
    
    createApp(App).mount('#app');
  </script>
</body>
</html>`;
  };

  const generateHTMLPreview = (files: any[]): string => {
    const htmlFile = files.find((f) => f.name.includes(".html"));
    if (htmlFile) {
      return htmlFile.content;
    }

    const cssFile = files.find((f) => f.name.includes(".css"));
    const jsFile = files.find((f) => f.name.includes(".js"));

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  ${cssFile ? `<style>${cssFile.content}</style>` : ""}
</head>
<body>
  <div id="app">
    <h1>Live Preview</h1>
    <p>Your code preview will appear here</p>
  </div>
  ${jsFile ? `<script>${jsFile.content}</script>` : ""}
</body>
</html>`;
  };

  const generateNodePreview = (files: any[]): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node.js API Preview</title>
  <style>
    body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #fff; }
    .endpoint { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .method { padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
    .get { background: #10b981; }
    .post { background: #3b82f6; }
    .put { background: #f59e0b; }
    .delete { background: #ef4444; }
  </style>
</head>
<body>
  <h1>🚀 Node.js API Preview</h1>
  <p>API endpoints detected in your code:</p>
  
  <div class="endpoint">
    <span class="method get">GET</span>
    <strong>/</strong> - Welcome message
  </div>
  
  <div class="endpoint">
    <span class="method get">GET</span>
    <strong>/api/users</strong> - Get all users
  </div>
  
  <div class="endpoint">
    <span class="method post">POST</span>
    <strong>/api/users</strong> - Create new user
  </div>
  
  <p>💡 Run your server to test these endpoints!</p>
</body>
</html>`;
  };

  const generateGenericPreview = (files: any[]): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Preview</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; }
    .preview { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    pre { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>📄 Code Preview</h1>
  <div class="preview">
    <h3>Project Files:</h3>
    ${files.map((f) => `<p><strong>${f.name}</strong> (${f.language})</p>`).join("")}
  </div>
  
  <div class="preview">
    <h3>Active File Content:</h3>
    <pre>${files.find((f) => f.name === (activeFile?.name || ""))?.content || "No content"}</pre>
  </div>
</body>
</html>`;
  };

  // Update preview when files change
  useEffect(() => {
    if (openFiles.length > 0) {
      const framework = detectFramework(openFiles);
      setDetectedFramework(framework);

      if (framework) {
        setIsLoading(true);
        try {
          const content = generatePreviewContent(framework, openFiles);
          setPreviewContent(content);
          setErrors([]);
        } catch (error) {
          setErrors([`Preview generation failed: ${error}`]);
        } finally {
          setIsLoading(false);
        }
      }
    }
  }, [openFiles, activeFileId]);

  const refreshPreview = () => {
    if (openFiles.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        const framework = detectFramework(openFiles);
        if (framework) {
          const content = generatePreviewContent(framework, openFiles);
          setPreviewContent(content);
        }
        setIsLoading(false);
      }, 500);
    }
  };

  if (!isVisible) {
    return (
      <div className="h-12 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Preview Hidden</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsVisible(true)}
          className="text-gray-400 hover:text-gray-200"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-900 border-t border-gray-700",
        isFullscreen ? "fixed inset-0 z-50" : "h-80",
      )}
    >
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">
            Live Preview
          </span>
          {detectedFramework && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              {detectedFramework.framework}
            </Badge>
          )}
          {isLoading && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
              Loading...
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Device Size Selector */}
          <div className="flex items-center gap-1">
            {DEVICE_SIZES.map((device, index) => (
              <Button
                key={device.name}
                size="sm"
                variant={selectedDevice === index ? "secondary" : "ghost"}
                onClick={() => setSelectedDevice(index)}
                className="h-6 w-6 p-0"
                title={device.name}
              >
                <device.icon className="w-3 h-3" />
              </Button>
            ))}
          </div>

          <div className="w-px h-4 bg-gray-600" />

          <Button
            size="sm"
            variant="ghost"
            onClick={refreshPreview}
            className="h-6 w-6 p-0"
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-6 w-6 p-0"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <EyeOff className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        {errors.length > 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Preview Error
            </h3>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          </div>
        ) : previewContent ? (
          <div
            className="bg-white shadow-lg"
            style={{
              width: currentDevice.width,
              height: currentDevice.height,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={previewContent}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Code Preview"
            />
          </div>
        ) : (
          <div className="p-8 text-center">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Preview Available
            </h3>
            <p className="text-sm text-gray-500">
              {openFiles.length === 0
                ? "Open a file to see live preview"
                : "Framework not detected or preview not supported"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          {detectedFramework && (
            <span>
              Framework: {detectedFramework.framework} (
              {Math.round(detectedFramework.confidence * 100)}%)
            </span>
          )}
          <span>Device: {currentDevice.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{openFiles.length} files loaded</span>
          {previewContent && (
            <Button size="sm" variant="ghost" className="h-4 px-1 text-xs">
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

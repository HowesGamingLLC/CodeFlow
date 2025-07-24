import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Globe,
  Server,
  FileText,
  Database,
  Smartphone,
  Bot,
  Gamepad2,
} from "lucide-react";
import { useIDEStore } from "@/lib/ide-store";

interface ProjectTemplateModalProps {
  open: boolean;
  onClose: () => void;
}

const templates = [
  {
    id: "vanilla-js",
    name: "Vanilla JavaScript",
    description: "HTML, CSS, and JavaScript starter project",
    icon: Code,
    language: "javascript",
    tags: ["Web", "Frontend", "Beginner"],
    features: ["HTML5", "CSS3", "ES6+", "Responsive Design"],
  },
  {
    id: "react-app",
    name: "React Application",
    description: "Modern React app with TypeScript and hooks",
    icon: Globe,
    language: "typescript",
    tags: ["React", "TypeScript", "Frontend"],
    features: ["React 18", "TypeScript", "Hooks", "CSS Modules"],
  },
  {
    id: "node-api",
    name: "Node.js API",
    description: "Express.js REST API with middleware",
    icon: Server,
    language: "javascript",
    tags: ["Node.js", "Backend", "API"],
    features: ["Express.js", "CORS", "JSON", "REST API"],
  },
  {
    id: "python-script",
    name: "Python Script",
    description: "Python application with utilities",
    icon: FileText,
    language: "python",
    tags: ["Python", "Script", "Utilities"],
    features: ["Python 3", "Type Hints", "Utilities", "CLI"],
  },
  {
    id: "nextjs-app",
    name: "Next.js Application",
    description: "Full-stack React framework with SSR",
    icon: Globe,
    language: "typescript",
    tags: ["Next.js", "React", "SSR"],
    features: ["Next.js 13", "App Router", "TypeScript", "Tailwind CSS"],
    comingSoon: true,
  },
  {
    id: "vue-app",
    name: "Vue.js Application",
    description: "Vue 3 app with Composition API",
    icon: Globe,
    language: "typescript",
    tags: ["Vue.js", "Frontend", "SPA"],
    features: ["Vue 3", "Composition API", "TypeScript", "Vite"],
    comingSoon: true,
  },
  {
    id: "flutter-app",
    name: "Flutter Mobile App",
    description: "Cross-platform mobile application",
    icon: Smartphone,
    language: "dart",
    tags: ["Flutter", "Mobile", "Cross-platform"],
    features: ["Flutter 3", "Dart", "Material Design", "iOS & Android"],
    comingSoon: true,
  },
  {
    id: "ai-chatbot",
    name: "AI Chatbot",
    description: "OpenAI-powered chatbot application",
    icon: Bot,
    language: "python",
    tags: ["AI", "Chatbot", "OpenAI"],
    features: ["OpenAI API", "Streamlit", "Python", "Chat Interface"],
    comingSoon: true,
  },
  {
    id: "game-dev",
    name: "Game Development",
    description: "HTML5 canvas game with JavaScript",
    icon: Gamepad2,
    language: "javascript",
    tags: ["Game", "Canvas", "JavaScript"],
    features: ["HTML5 Canvas", "Game Loop", "Sprites", "Physics"],
    comingSoon: true,
  },
];

export function ProjectTemplateModal({
  open,
  onClose,
}: ProjectTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<string>("vanilla-js");
  const [projectName, setProjectName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const { createProject } = useIDEStore();

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  const handleCreate = () => {
    if (!projectName.trim() || !selectedTemplate) return;

    createProject(projectName.trim(), selectedTemplate, selectedLanguage);
    onClose();
    setProjectName("");
    setSelectedTemplate("vanilla-js");
  };

  const getIconColor = (language: string) => {
    switch (language) {
      case "javascript":
        return "text-yellow-400";
      case "typescript":
        return "text-blue-400";
      case "python":
        return "text-green-400";
      case "dart":
        return "text-cyan-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-200">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Templates */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-4">
              Choose a Template
            </h3>
            <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all border-gray-700 hover:border-gray-600 ${
                      selectedTemplate === template.id
                        ? "bg-blue-900/20 border-blue-500"
                        : "bg-gray-800"
                    } ${template.comingSoon ? "opacity-50" : ""}`}
                    onClick={() => {
                      if (!template.comingSoon) {
                        setSelectedTemplate(template.id);
                        setSelectedLanguage(template.language);
                      }
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center ${getIconColor(template.language)}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm text-gray-200">
                              {template.name}
                              {template.comingSoon && (
                                <Badge className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                  Soon
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-400">
                              {template.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {template.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs text-gray-400 border-gray-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Features: {template.features.join(", ")}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Project Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-4">
              Project Settings
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name" className="text-sm text-gray-300">
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                  className="mt-1 bg-gray-800 border-gray-600 text-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-sm text-gray-300">
                  Primary Language
                </Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="dart">Dart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Template Preview */}
              {selectedTemplateData && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-200 mb-2">
                    Template: {selectedTemplateData.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-3">
                    {selectedTemplateData.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-xs text-gray-300">
                      <span className="font-medium">Language:</span>{" "}
                      {selectedTemplateData.language}
                    </div>
                    <div className="text-xs text-gray-300">
                      <span className="font-medium">Features:</span>
                    </div>
                    <ul className="text-xs text-gray-400 list-disc list-inside ml-2">
                      {selectedTemplateData.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCreate}
                disabled={
                  !projectName.trim() ||
                  !selectedTemplateData ||
                  selectedTemplateData.comingSoon
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Create Project
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

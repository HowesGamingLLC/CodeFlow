import { create } from "zustand";
import "./date-utils";

export interface IDEFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirectory: boolean;
  parentId?: string;
  children?: IDEFile[];
  isOpen?: boolean;
  isModified?: boolean;
  lastModified: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  template: string;
  files: IDEFile[];
  createdAt: Date;
  lastModified: Date;
  isPublic: boolean;
}

export interface TerminalSession {
  id: string;
  name: string;
  output: TerminalMessage[];
  isActive: boolean;
  workingDirectory: string;
}

export interface TerminalMessage {
  id: string;
  type: "input" | "output" | "error" | "system";
  content: string;
  timestamp: Date;
}

export interface JoseyMessage {
  id: string;
  role: "user" | "josey";
  content: string;
  type:
    | "text"
    | "code"
    | "suggestion"
    | "explanation"
    | "error"
    | "fix"
    | "test"
    | "refactor"
    | "docs";
  timestamp: Date;
  metadata?: {
    language?: string;
    fileName?: string;
    action?: string;
    errorType?: string;
    fixApplied?: boolean;
    confidence?: number;
  };
}

export interface CodeExecution {
  id: string;
  language: string;
  code: string;
  output: string;
  error?: string;
  timestamp: Date;
  duration: number;
}

export interface IDEState {
  // Project Management
  currentProject: Project | null;
  projects: Project[];

  // File Management
  openFiles: IDEFile[];
  activeFileId: string | null;
  fileTree: IDEFile[];

  // Terminal
  terminalSessions: TerminalSession[];
  activeTerminalId: string;

  // Josey AI Assistant
  joseyMessages: JoseyMessage[];
  isJoseyTyping: boolean;
  joseyPanelOpen: boolean;
  joseyMode: "chat" | "error-fix" | "explain" | "refactor" | "test";
  lastError: string | null;
  errorContext: {
    file?: string;
    line?: number;
    type?: string;
    stackTrace?: string;
  } | null;

  // Code Execution
  executions: CodeExecution[];
  isExecuting: boolean;

  // AI Features
  codeExplanations: Map<string, string>;
  generatedTests: Map<string, string>;
  refactorSuggestions: Map<string, string>;
  apiDocumentation: Map<string, string>;

  // Deployment & Package Management
  deploymentStatus: "idle" | "preparing" | "deploying" | "deployed" | "failed";
  packageSuggestions: string[];
  commandSuggestions: string[];

  // UI State
  layout: {
    sidebarWidth: number;
    terminalHeight: number;
    joseyPanelWidth: number;
    previewVisible: boolean;
  };

  // Actions
  createProject: (name: string, template: string, language: string) => void;
  loadProject: (projectId: string) => void;
  saveProject: () => void;

  createFile: (name: string, parentId?: string) => void;
  deleteFile: (fileId: string) => void;
  openFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;

  executeCode: (code: string, language: string) => Promise<void>;

  // Enhanced AI Actions
  sendToJosey: (
    message: string,
    type?: JoseyMessage["type"],
    metadata?: JoseyMessage["metadata"],
  ) => void;
  explainCode: (fileId: string) => void;
  generateTests: (fileId: string) => void;
  refactorCode: (
    fileId: string,
    refactorType: "async" | "split" | "optimize",
  ) => void;
  fixError: (error: string, fileId?: string) => void;
  generateAPIDocs: (fileId: string) => void;
  convertLanguage: (fileId: string, targetLanguage: string) => void;

  // Terminal & Deployment
  createTerminal: (name?: string) => void;
  sendTerminalCommand: (terminalId: string, command: string) => void;
  suggestCommand: (task: string) => string[];
  deployProject: (platform: "vercel" | "netlify" | "docker") => Promise<void>;
  installPackage: (packageName: string, dev?: boolean) => void;

  // Workspace Management
  createSnapshot: (description?: string) => void;
  restoreSnapshot: (snapshotId: string) => void;

  updateLayout: (layout: Partial<IDEState["layout"]>) => void;
  setJoseyMode: (mode: IDEState["joseyMode"]) => void;
  reportError: (error: string, context?: IDEState["errorContext"]) => void;
}

// Template configurations
const PROJECT_TEMPLATES = {
  "vanilla-js": {
    name: "Vanilla JavaScript",
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <h1>Hello World!</h1>
        <button onclick="handleClick()">Click me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        language: "html",
      },
      {
        name: "style.css",
        content: `/* CSS Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;
}

button:hover {
    background: #2980b9;
}`,
        language: "css",
      },
      {
        name: "script.js",
        content: `// Main application logic
console.log('Hello from JavaScript!');

function handleClick() {
    const button = event.target;
    button.textContent = 'Clicked!';
    
    setTimeout(() => {
        button.textContent = 'Click me';
    }, 2000);
    
    console.log('Button clicked at:', new Date().toLocaleTimeString());
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
});`,
        language: "javascript",
      },
    ],
  },
  "react-app": {
    name: "React Application",
    files: [
      {
        name: "App.tsx",
        content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello React!');

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        <div className="counter">
          <button onClick={() => setCount(count - 1)}>-</button>
          <span className="count">{count}</span>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
        <button 
          className="reset-btn"
          onClick={() => {
            setCount(0);
            setMessage('Reset!');
            setTimeout(() => setMessage('Hello React!'), 1500);
          }}
        >
          Reset
        </button>
      </header>
    </div>
  );
}

export default App;`,
        language: "typescript",
      },
      {
        name: "App.css",
        content: `.App {
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.App-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.counter button {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.counter button:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.1);
}

.count {
  font-size: 2rem;
  font-weight: bold;
  min-width: 3rem;
}

.reset-btn {
  padding: 0.75rem 2rem;
  border: 2px solid white;
  border-radius: 25px;
  background: transparent;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: white;
  color: #667eea;
}`,
        language: "css",
      },
      {
        name: "index.tsx",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        language: "typescript",
      },
    ],
  },
  "node-api": {
    name: "Node.js API",
    files: [
      {
        name: "server.js",
        content: `const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`,
        language: "javascript",
      },
      {
        name: "package.json",
        content: `{
  "name": "node-api",
  "version": "1.0.0",
  "description": "A simple Node.js API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0"
  },
  "keywords": ["api", "express", "nodejs"],
  "author": "Your Name",
  "license": "MIT"
}`,
        language: "json",
      },
      {
        name: "README.md",
        content: `# Node.js API

A simple REST API built with Express.js.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Visit http://localhost:3000

## API Endpoints

- \`GET /\` - Welcome message
- \`GET /api/users\` - Get all users
- \`POST /api/users\` - Create a new user

## Usage

### Get all users
\`\`\`bash
curl http://localhost:3000/api/users
\`\`\`

### Create a user
\`\`\`bash
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John Doe", "email": "john@example.com"}'
\`\`\``,
        language: "markdown",
      },
    ],
  },
  "python-script": {
    name: "Python Script",
    files: [
      {
        name: "main.py",
        content: `#!/usr/bin/env python3
"""
Main Python script
"""

import os
import sys
from datetime import datetime

def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}! Welcome to Python programming."

def calculate_fibonacci(n: int) -> list:
    """Calculate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

def main():
    """Main function."""
    print("🐍 Python Script Started")
    print(f"⏰ Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🐍 Python version: {sys.version}")
    
    # Greet the user
    name = input("\\nWhat's your name? ")
    print(greet(name))
    
    # Calculate Fibonacci
    try:
        n = int(input("\\nHow many Fibonacci numbers to calculate? "))
        fib_sequence = calculate_fibonacci(n)
        print(f"\\nFibonacci sequence ({n} terms): {fib_sequence}")
    except ValueError:
        print("Please enter a valid number!")
    
    print("\\n✅ Script completed!")

if __name__ == "__main__":
    main()`,
        language: "python",
      },
      {
        name: "utils.py",
        content: `"""
Utility functions for the Python project
"""

import json
import os
from typing import Any, Dict, List

def read_json_file(file_path: str) -> Dict[str, Any]:
    """Read and parse a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return {}

def write_json_file(file_path: str, data: Dict[str, Any]) -> bool:
    """Write data to a JSON file."""
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error writing to file: {e}")
        return False

def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format."""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"

def get_file_info(file_path: str) -> Dict[str, Any]:
    """Get information about a file."""
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    stat = os.stat(file_path)
    
    return {
        "name": os.path.basename(file_path),
        "size": stat.st_size,
        "size_formatted": format_file_size(stat.st_size),
        "modified": stat.st_mtime,
        "is_file": os.path.isfile(file_path),
        "is_directory": os.path.isdir(file_path)
    }`,
        language: "python",
      },
      {
        name: "requirements.txt",
        content: `# Python dependencies
requests>=2.28.0
python-dotenv>=0.19.0
click>=8.0.0`,
        language: "text",
      },
    ],
  },
};

export const useIDEStore = create<IDEState>((set, get) => ({
  // Initial state
  currentProject: null,
  projects: [],
  openFiles: [],
  activeFileId: null,
  fileTree: [],
  terminalSessions: [
    {
      id: "main",
      name: "Terminal",
      output: [
        {
          id: "1",
          type: "system",
          content:
            'Welcome to AppStop.pro IDE Terminal! Type "help" for available commands.',
          timestamp: new Date(),
        },
      ],
      isActive: true,
      workingDirectory: "/",
    },
  ],
  activeTerminalId: "main",
  joseyMessages: [
    {
      id: "1",
      role: "josey",
      content:
        "👋 Hey there! I'm Josey, your enhanced AI programming assistant. I can help you write code, debug errors, explain files, generate tests, refactor code, create API docs, suggest terminal commands, and deploy your projects. What would you like to build today?",
      type: "text",
      timestamp: new Date(),
    },
  ],
  isJoseyTyping: false,
  joseyPanelOpen: true,
  joseyMode: "chat",
  lastError: null,
  errorContext: null,
  executions: [],
  isExecuting: false,
  codeExplanations: new Map(),
  generatedTests: new Map(),
  refactorSuggestions: new Map(),
  apiDocumentation: new Map(),
  deploymentStatus: "idle",
  packageSuggestions: [],
  commandSuggestions: [],
  layout: {
    sidebarWidth: 300,
    terminalHeight: 250,
    joseyPanelWidth: 400,
    previewVisible: true,
  },

  // Actions
  createProject: (name, template, language) => {
    const templateData =
      PROJECT_TEMPLATES[template as keyof typeof PROJECT_TEMPLATES];
    const projectId = `project_${Date.now()}`;

    const files: IDEFile[] = templateData.files.map((file, index) => ({
      id: `file_${projectId}_${index}`,
      name: file.name,
      path: `/${file.name}`,
      content: file.content,
      language: file.language,
      isDirectory: false,
      lastModified: new Date(),
      isOpen: false,
      isModified: false,
    }));

    const project: Project = {
      id: projectId,
      name,
      description: `A ${templateData.name} project`,
      language,
      template,
      files,
      createdAt: new Date(),
      lastModified: new Date(),
      isPublic: false,
    };

    set((state) => ({
      projects: [...state.projects, project],
      currentProject: project,
      fileTree: files,
      openFiles: files.length > 0 ? [files[0]] : [],
      activeFileId: files.length > 0 ? files[0].id : null,
    }));
  },

  loadProject: (projectId) => {
    const state = get();
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      set({
        currentProject: project,
        fileTree: project.files,
        openFiles: [],
        activeFileId: null,
      });
    }
  },

  saveProject: () => {
    // In a real app, this would save to backend
    console.log("Project saved");
  },

  createFile: (name, parentId) => {
    const fileId = `file_${Date.now()}`;
    const newFile: IDEFile = {
      id: fileId,
      name,
      path: parentId ? `/${name}` : `/${name}`,
      content: "",
      language: name.split(".").pop() || "text",
      isDirectory: false,
      parentId,
      lastModified: new Date(),
      isOpen: false,
      isModified: false,
    };

    set((state) => ({
      fileTree: [...state.fileTree, newFile],
    }));
  },

  deleteFile: (fileId) => {
    set((state) => ({
      fileTree: state.fileTree.filter((f) => f.id !== fileId),
      openFiles: state.openFiles.filter((f) => f.id !== fileId),
      activeFileId: state.activeFileId === fileId ? null : state.activeFileId,
    }));
  },

  openFile: (fileId) => {
    const state = get();
    const file = state.fileTree.find((f) => f.id === fileId);
    if (file && !state.openFiles.find((f) => f.id === fileId)) {
      set({
        openFiles: [...state.openFiles, { ...file, isOpen: true }],
        activeFileId: fileId,
      });
    } else {
      set({ activeFileId: fileId });
    }
  },

  closeFile: (fileId) => {
    set((state) => ({
      openFiles: state.openFiles.filter((f) => f.id !== fileId),
      activeFileId:
        state.activeFileId === fileId
          ? state.openFiles.length > 1
            ? state.openFiles[0].id
            : null
          : state.activeFileId,
    }));
  },

  updateFileContent: (fileId, content) => {
    set((state) => ({
      openFiles: state.openFiles.map((f) =>
        f.id === fileId
          ? { ...f, content, isModified: true, lastModified: new Date() }
          : f,
      ),
      fileTree: state.fileTree.map((f) =>
        f.id === fileId
          ? { ...f, content, isModified: true, lastModified: new Date() }
          : f,
      ),
    }));
  },

  executeCode: async (code, language) => {
    set({ isExecuting: true });

    try {
      // Simulate code execution
      const execution: CodeExecution = {
        id: `exec_${Date.now()}`,
        language,
        code,
        output: `Output for ${language} code:\n${code.substring(0, 100)}...`,
        timestamp: new Date(),
        duration: Math.random() * 2000 + 500,
      };

      await new Promise((resolve) => setTimeout(resolve, execution.duration));

      set((state) => ({
        executions: [...state.executions, execution],
        isExecuting: false,
      }));
    } catch (error) {
      set({ isExecuting: false });
    }
  },

  sendToJosey: (message, type = "text", metadata = {}) => {
    const userMessage: JoseyMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: message,
      type,
      timestamp: new Date(),
      metadata,
    };

    set((state) => ({
      joseyMessages: [...state.joseyMessages, userMessage],
      isJoseyTyping: true,
    }));

    // Enhanced response simulation based on type
    setTimeout(
      () => {
        let responseContent = "";
        let responseType: JoseyMessage["type"] = "text";

        switch (type) {
          case "code":
            responseContent = `Here's an improved version of your code:\n\n\`\`\`${metadata.language || "javascript"}\n// Enhanced code with better practices\nfunction enhancedFunction() {\n  // Your improved code here\n  return 'Better implementation';\n}\n\`\`\`\n\nKey improvements:\n- Better error handling\n- Improved performance\n- More readable structure`;
            responseType = "code";
            break;
          case "error":
            responseContent = `I've identified the issue! Here's what's causing the error:\n\n🔍 **Error Analysis:**\n- Type: ${metadata.errorType || "Runtime Error"}\n- Likely cause: ${message.includes("undefined") ? "Variable not defined" : "Logic error"}\n\n🛠️ **Quick Fix:**\n\`\`\`${metadata.language || "javascript"}\n// Add proper error handling\ntry {\n  // Your code here\n} catch (error) {\n  console.error('Error:', error);\n}\n\`\`\``;
            responseType = "fix";
            break;
          case "explanation":
            responseContent = `📋 **File Overview:**\n\nThis file serves as ${metadata.fileName?.includes("component") ? "a React component" : "a utility module"} with the following purpose:\n\n🎯 **Main Function:**\n- Handles ${metadata.fileName?.includes("api") ? "API endpoints and data processing" : "user interface logic"}\n- Implements core business logic\n- Manages state and interactions\n\n🔧 **Key Features:**\n- Modern JavaScript/TypeScript patterns\n- Error handling and validation\n- Performance optimizations`;
            responseType = "explanation";
            break;
          case "test":
            responseContent = `🧪 **Generated Tests:**\n\n\`\`\`${metadata.language === "typescript" ? "typescript" : "javascript"}\nimport { ${metadata.fileName?.replace(".", "").replace(/[^a-zA-Z]/g, "") || "TestFunction"} } from './${metadata.fileName || "module"}';\n\ndescribe('${metadata.fileName || "Module"} Tests', () => {\n  test('should work correctly', () => {\n    // Arrange\n    const input = 'test';\n    \n    // Act\n    const result = ${metadata.fileName?.replace(".", "").replace(/[^a-zA-Z]/g, "") || "TestFunction"}(input);\n    \n    // Assert\n    expect(result).toBeDefined();\n    expect(result).toBeTruthy();\n  });\n  \n  test('should handle edge cases', () => {\n    expect(() => ${metadata.fileName?.replace(".", "").replace(/[^a-zA-Z]/g, "") || "TestFunction"}(null)).not.toThrow();\n  });\n});\n\`\`\``;
            responseType = "test";
            break;
          default:
            const responses = [
              "I'd be happy to help you with that! Let me break it down for you.",
              "Great question! Here's what I think about your code:",
              "I can definitely help you optimize that. Here's my suggestion:",
              "Let me explain this concept and provide a solution:",
              "That's an interesting approach! Here's how we can improve it:",
              "I see what you're trying to do. Here's a better way to implement it:",
              "Let me help you refactor this code for better maintainability:",
              "I can generate some comprehensive tests for this functionality:",
            ];
            responseContent =
              responses[Math.floor(Math.random() * responses.length)];
        }

        const joseyResponse: JoseyMessage = {
          id: `msg_${Date.now()}`,
          role: "josey",
          content: responseContent,
          type: responseType,
          timestamp: new Date(),
          metadata: {
            ...metadata,
            confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          },
        };

        set((state) => ({
          joseyMessages: [...state.joseyMessages, joseyResponse],
          isJoseyTyping: false,
        }));
      },
      1500 + Math.random() * 2000,
    );
  },

  createTerminal: (name) => {
    const terminalId = `terminal_${Date.now()}`;
    const newTerminal: TerminalSession = {
      id: terminalId,
      name: name || `Terminal ${get().terminalSessions.length + 1}`,
      output: [],
      isActive: false,
      workingDirectory: "/",
    };

    set((state) => ({
      terminalSessions: [...state.terminalSessions, newTerminal],
      activeTerminalId: terminalId,
    }));
  },

  sendTerminalCommand: (terminalId, command) => {
    const output: TerminalMessage = {
      id: `term_${Date.now()}`,
      type: "input",
      content: `$ ${command}`,
      timestamp: new Date(),
    };

    // Simulate command execution
    const response: TerminalMessage = {
      id: `term_${Date.now() + 1}`,
      type: "output",
      content: `Command executed: ${command}`,
      timestamp: new Date(),
    };

    set((state) => ({
      terminalSessions: state.terminalSessions.map((terminal) =>
        terminal.id === terminalId
          ? { ...terminal, output: [...terminal.output, output, response] }
          : terminal,
      ),
    }));
  },

  updateLayout: (layout) => {
    set((state) => ({
      layout: { ...state.layout, ...layout },
    }));
  },

  // Enhanced AI Actions
  explainCode: (fileId) => {
    const state = get();
    const file =
      state.openFiles.find((f) => f.id === fileId) ||
      state.fileTree.find((f) => f.id === fileId);
    if (file) {
      state.sendToJosey(
        `Explain what this file does and its purpose:\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``,
        "explanation",
        { fileName: file.name, language: file.language },
      );
    }
  },

  generateTests: (fileId) => {
    const state = get();
    const file =
      state.openFiles.find((f) => f.id === fileId) ||
      state.fileTree.find((f) => f.id === fileId);
    if (file) {
      state.sendToJosey(
        `Generate comprehensive unit tests for this code:\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``,
        "test",
        { fileName: file.name, language: file.language },
      );
    }
  },

  refactorCode: (fileId, refactorType) => {
    const state = get();
    const file =
      state.openFiles.find((f) => f.id === fileId) ||
      state.fileTree.find((f) => f.id === fileId);
    if (file) {
      let prompt = "";
      switch (refactorType) {
        case "async":
          prompt = "Refactor this code to use async/await patterns:";
          break;
        case "split":
          prompt = "Split this code into smaller, more manageable functions:";
          break;
        case "optimize":
          prompt = "Optimize this code for better performance:";
          break;
      }

      state.sendToJosey(
        `${prompt}\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``,
        "refactor",
        { fileName: file.name, language: file.language, action: refactorType },
      );
    }
  },

  fixError: (error, fileId) => {
    const state = get();
    const file = fileId ? state.openFiles.find((f) => f.id === fileId) : null;

    let prompt = `Fix this error: ${error}`;
    if (file) {
      prompt += `\n\nCurrent code:\n\`\`\`${file.language}\n${file.content}\n\`\`\``;
    }

    set({ lastError: error, joseyMode: "error-fix" });
    state.sendToJosey(prompt, "error", {
      fileName: file?.name,
      language: file?.language,
      errorType: error.includes("TypeError") ? "TypeError" : "Runtime Error",
    });
  },

  generateAPIDocs: (fileId) => {
    const state = get();
    const file =
      state.openFiles.find((f) => f.id === fileId) ||
      state.fileTree.find((f) => f.id === fileId);
    if (file) {
      state.sendToJosey(
        `Generate OpenAPI/Swagger documentation for this code:\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``,
        "docs",
        { fileName: file.name, language: file.language },
      );
    }
  },

  convertLanguage: (fileId, targetLanguage) => {
    const state = get();
    const file =
      state.openFiles.find((f) => f.id === fileId) ||
      state.fileTree.find((f) => f.id === fileId);
    if (file) {
      state.sendToJosey(
        `Convert this ${file.language} code to ${targetLanguage}:\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``,
        "code",
        { fileName: file.name, language: targetLanguage, action: "convert" },
      );
    }
  },

  suggestCommand: (task) => {
    const commands = {
      install: ["npm install", "yarn install", "pnpm install"],
      start: ["npm start", "npm run dev", "yarn dev"],
      test: ["npm test", "npm run test", "jest"],
      build: ["npm run build", "yarn build", "webpack"],
      deploy: ["npm run deploy", "vercel", "netlify deploy"],
      git: ["git status", "git add .", "git commit -m", "git push"],
    };

    const taskLower = task.toLowerCase();
    for (const [key, cmds] of Object.entries(commands)) {
      if (taskLower.includes(key)) {
        set({ commandSuggestions: cmds });
        return cmds;
      }
    }

    return ["help", "ls", "pwd"];
  },

  deployProject: async (platform) => {
    set({ deploymentStatus: "preparing" });

    // Simulate deployment process
    setTimeout(() => {
      set({ deploymentStatus: "deploying" });

      setTimeout(() => {
        set({ deploymentStatus: "deployed" });
        const state = get();
        state.sendToJosey(
          `🚀 Successfully deployed to ${platform}!\n\nYour app is now live at: https://your-app.${platform}.app`,
          "text",
          { action: "deploy", platform },
        );
      }, 3000);
    }, 1000);
  },

  installPackage: (packageName, dev = false) => {
    const state = get();
    const command = `npm install ${dev ? "--save-dev " : ""}${packageName}`;

    if (state.activeTerminalId) {
      state.sendTerminalCommand(state.activeTerminalId, command);
    }

    state.sendToJosey(
      `Installing ${packageName}${dev ? " as dev dependency" : ""}...\n\nRunning: \`${command}\``,
      "text",
      { action: "install", packageName },
    );
  },

  createSnapshot: (description = "") => {
    const state = get();
    const snapshot = {
      id: `snapshot_${Date.now()}`,
      description:
        description || `Snapshot created at ${new Date().toLocaleString()}`,
      files: state.openFiles,
      timestamp: new Date(),
    };

    state.sendToJosey(
      `📸 Workspace snapshot created!\n\n**Description:** ${snapshot.description}\n**Files:** ${snapshot.files.length} files captured`,
      "text",
      { action: "snapshot" },
    );
  },

  restoreSnapshot: (snapshotId) => {
    // Implementation would restore from saved snapshots
    const state = get();
    state.sendToJosey(
      `🔄 Restoring workspace from snapshot: ${snapshotId}`,
      "text",
      { action: "restore" },
    );
  },

  setJoseyMode: (mode) => {
    set({ joseyMode: mode });
  },

  reportError: (error, context) => {
    set({
      lastError: error,
      errorContext: context,
      joseyMode: "error-fix",
    });

    const state = get();
    state.sendToJosey(`🚨 Error detected: ${error}`, "error", {
      errorType: error.split(":")[0],
      ...context,
    });
  },
}));

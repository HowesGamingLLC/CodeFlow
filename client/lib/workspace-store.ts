import { create } from "zustand";
import "./date-utils";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
  children?: FileItem[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ConsoleLog {
  id: string;
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: Date;
}

export interface Page {
  id: string;
  name: string;
  path: string;
  content: string;
}

export interface WorkspaceState {
  // UI State
  activeLeftTab: string;
  selectedPage: string;
  isPreviewVisible: boolean;

  // Data
  pages: Page[];
  files: FileItem[];
  chatMessages: ChatMessage[];
  consoleLogs: ConsoleLog[];
  buildStatus: "idle" | "building" | "success" | "error";
  deployStatus: "idle" | "deploying" | "deployed" | "error";

  // Actions
  setActiveLeftTab: (tab: string) => void;
  setSelectedPage: (pageId: string) => void;
  togglePreview: () => void;
  updatePageContent: (pageId: string, content: string) => void;
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  addConsoleLog: (log: Omit<ConsoleLog, "id" | "timestamp">) => void;
  clearConsole: () => void;
  setBuildStatus: (status: WorkspaceState["buildStatus"]) => void;
  setDeployStatus: (status: WorkspaceState["deployStatus"]) => void;
  pushCodeUpdate: () => void;
}

// Mock data
const mockPages: Page[] = [
  {
    id: "home",
    name: "Home",
    path: "/",
    content: `import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-white text-center mb-8">
          Welcome to CoinKrazy
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
          Your ultimate crypto trading platform with advanced analytics and real-time market data.
        </p>
      </div>
    </div>
  );
}`,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/dashboard",
    content: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Trading Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">$12,345.67</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">7</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>24h Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">+5.2%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,
  },
  {
    id: "trading",
    name: "Trading",
    path: "/trading",
    content: `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Trading() {
  const [orderType, setOrderType] = useState('buy');
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Live Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-red-500">$42,150.00</span>
                <span>0.5 BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-500">$42,100.00</span>
                <span>1.2 BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-500">$42,050.00</span>
                <span>0.8 BTC</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button 
                variant={orderType === 'buy' ? 'default' : 'outline'}
                onClick={() => setOrderType('buy')}
                className="flex-1"
              >
                Buy
              </Button>
              <Button 
                variant={orderType === 'sell' ? 'default' : 'outline'}
                onClick={() => setOrderType('sell')}
                className="flex-1"
              >
                Sell
              </Button>
            </div>
            <Button className="w-full">
              Place {orderType.toUpperCase()} Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,
  },
];

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    path: "/src",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        path: "/src/components",
        children: [
          {
            id: "3",
            name: "Header.tsx",
            type: "file",
            path: "/src/components/Header.tsx",
            content:
              'import React from "react";\n\nexport const Header = () => {\n  return <header>CoinKrazy</header>;\n};',
          },
          {
            id: "4",
            name: "Sidebar.tsx",
            type: "file",
            path: "/src/components/Sidebar.tsx",
            content:
              'import React from "react";\n\nexport const Sidebar = () => {\n  return <aside>Navigation</aside>;\n};',
          },
        ],
      },
      {
        id: "5",
        name: "pages",
        type: "folder",
        path: "/src/pages",
        children: [
          {
            id: "6",
            name: "Home.tsx",
            type: "file",
            path: "/src/pages/Home.tsx",
            content: mockPages[0].content,
          },
          {
            id: "7",
            name: "Dashboard.tsx",
            type: "file",
            path: "/src/pages/Dashboard.tsx",
            content: mockPages[1].content,
          },
        ],
      },
    ],
  },
  {
    id: "8",
    name: "package.json",
    type: "file",
    path: "/package.json",
    content:
      '{\n  "name": "coinkrizy",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}',
  },
];

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Initial state
  activeLeftTab: "chat",
  selectedPage: "home",
  isPreviewVisible: false,
  pages: mockPages,
  files: mockFiles,
  chatMessages: [
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you with coding, debugging, and building your CoinKrazy application. What would you like to work on today?",
      timestamp: new Date(),
    },
  ],
  consoleLogs: [
    {
      id: "1",
      type: "info",
      message: "Development server started on port 3000",
      timestamp: new Date(),
    },
  ],
  buildStatus: "idle",
  deployStatus: "idle",

  // Actions
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),

  setSelectedPage: (pageId) => set({ selectedPage: pageId }),

  togglePreview: () =>
    set((state) => ({ isPreviewVisible: !state.isPreviewVisible })),

  updatePageContent: (pageId, content) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId ? { ...page, content } : page,
      ),
    })),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    })),

  addConsoleLog: (log) =>
    set((state) => ({
      consoleLogs: [
        ...state.consoleLogs,
        {
          ...log,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    })),

  clearConsole: () => set({ consoleLogs: [] }),

  setBuildStatus: (status) => set({ buildStatus: status }),

  setDeployStatus: (status) => set({ deployStatus: status }),

  pushCodeUpdate: () => {
    const { addConsoleLog, setBuildStatus } = get();

    addConsoleLog({
      type: "info",
      message: "Starting code push...",
    });

    setBuildStatus("building");

    // Simulate build process
    setTimeout(() => {
      addConsoleLog({
        type: "info",
        message: "Code compiled successfully",
      });

      addConsoleLog({
        type: "info",
        message: "Deploying to production...",
      });

      setBuildStatus("success");
    }, 2000);

    setTimeout(() => {
      addConsoleLog({
        type: "info",
        message: "Deployment successful! 🚀",
      });
    }, 3000);
  },
}));

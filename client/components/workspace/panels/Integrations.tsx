import React from "react";
import {
  Puzzle,
  Plus,
  ExternalLink,
  Settings,
  Check,
  Zap,
  Database,
  CreditCard,
  BarChart3,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "connected" | "available" | "coming-soon";
  category: "payment" | "analytics" | "database" | "security" | "api";
}

const integrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage subscriptions",
    icon: CreditCard,
    status: "connected",
    category: "payment",
  },
  {
    id: "coinbase",
    name: "Coinbase API",
    description: "Real-time cryptocurrency data and trading",
    icon: Zap,
    status: "connected",
    category: "api",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Primary database for user data and transactions",
    icon: Database,
    status: "connected",
    category: "database",
  },
  {
    id: "analytics",
    name: "Google Analytics",
    description: "Track user behavior and site performance",
    icon: BarChart3,
    status: "available",
    category: "analytics",
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Authentication and user management",
    icon: Shield,
    status: "available",
    category: "security",
  },
  {
    id: "binance",
    name: "Binance API",
    description: "Trading and market data from Binance",
    icon: Zap,
    status: "coming-soon",
    category: "api",
  },
];

const categories = [
  { id: "all", name: "All", count: integrations.length },
  {
    id: "payment",
    name: "Payment",
    count: integrations.filter((i) => i.category === "payment").length,
  },
  {
    id: "api",
    name: "APIs",
    count: integrations.filter((i) => i.category === "api").length,
  },
  {
    id: "database",
    name: "Database",
    count: integrations.filter((i) => i.category === "database").length,
  },
  {
    id: "analytics",
    name: "Analytics",
    count: integrations.filter((i) => i.category === "analytics").length,
  },
  {
    id: "security",
    name: "Security",
    count: integrations.filter((i) => i.category === "security").length,
  },
];

export function Integrations() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory);

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Check className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "available":
        return (
          <Badge variant="outline" className="text-blue-400 border-blue-500/30">
            Available
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge variant="outline" className="text-gray-400 border-gray-500/30">
            Coming Soon
          </Badge>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-purple-400" />
            <h2 className="font-semibold text-gray-200">Integrations</h2>
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Browse All
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Integrations List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredIntegrations.map((integration) => {
            const Icon = integration.icon;

            return (
              <Card
                key={integration.id}
                className="bg-gray-800 border-gray-700"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-200 text-base">
                          {integration.name}
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </>
                    ) : integration.status === "available" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="flex-1"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Need a custom integration?
          </p>
          <Button variant="outline" size="sm">
            Request Integration
          </Button>
        </div>
      </div>
    </div>
  );
}

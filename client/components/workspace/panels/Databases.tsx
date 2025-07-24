import React from "react";
import {
  Database,
  Plus,
  Settings,
  ExternalLink,
  Table,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
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

interface DatabaseConnection {
  id: string;
  name: string;
  type: "postgresql" | "mongodb" | "redis" | "mysql";
  status: "connected" | "disconnected" | "error";
  host: string;
  tables?: number;
  size?: string;
  lastBackup?: Date;
}

interface TableSchema {
  name: string;
  columns: number;
  rows: number;
  size: string;
}

export function Databases() {
  const [selectedDb, setSelectedDb] = React.useState<string | null>("1");

  const [databases] = React.useState<DatabaseConnection[]>([
    {
      id: "1",
      name: "CoinKrazy Production DB",
      type: "postgresql",
      status: "connected",
      host: "coinkrizy-prod.postgres.com",
      tables: 12,
      size: "2.3 GB",
      lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
    {
      id: "2",
      name: "Redis Cache",
      type: "redis",
      status: "connected",
      host: "coinkrizy-cache.redis.com",
      size: "256 MB",
    },
    {
      id: "3",
      name: "Analytics DB",
      type: "mongodb",
      status: "disconnected",
      host: "coinkrizy-analytics.mongo.com",
      tables: 5,
      size: "890 MB",
    },
  ]);

  const [tableSchemas] = React.useState<TableSchema[]>([
    { name: "users", columns: 8, rows: 15420, size: "1.2 MB" },
    { name: "transactions", columns: 12, rows: 89530, size: "45.3 MB" },
    { name: "portfolios", columns: 6, rows: 12340, size: "890 KB" },
    { name: "trading_pairs", columns: 10, rows: 2850, size: "234 KB" },
    { name: "notifications", columns: 7, rows: 156780, size: "12.4 MB" },
    { name: "api_keys", columns: 5, rows: 3420, size: "145 KB" },
  ]);

  const getStatusIcon = (status: DatabaseConnection["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "disconnected":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: DatabaseConnection["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Error
          </Badge>
        );
    }
  };

  const getDbTypeIcon = (type: DatabaseConnection["type"]) => {
    return <Database className="w-4 h-4 text-blue-400" />;
  };

  const selectedDatabase = databases.find((db) => db.id === selectedDb);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-gray-200">Databases</h2>
            <Badge variant="outline" className="text-gray-400">
              {databases.length} connected
            </Badge>
          </div>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Connect DB
          </Button>
        </div>
      </div>

      {/* Database List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">
              Connected Databases
            </h3>

            {databases.map((database) => (
              <Card
                key={database.id}
                className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
                  selectedDb === database.id
                    ? "border-blue-500/50 bg-blue-900/10"
                    : "hover:bg-gray-750"
                }`}
                onClick={() => setSelectedDb(database.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getDbTypeIcon(database.type)}
                      <div>
                        <CardTitle className="text-gray-200 text-sm">
                          {database.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {database.type.toUpperCase()} • {database.host}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(database.status)}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-4">
                      {database.tables && (
                        <span className="text-gray-400">
                          {database.tables} tables
                        </span>
                      )}
                      {database.size && (
                        <span className="text-gray-400">{database.size}</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Database Details */}
          {selectedDatabase && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-300">
                Database Details - {selectedDatabase.name}
              </h3>

              {/* Connection Info */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-200 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Connection Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedDatabase.status)}
                      <span className="text-gray-200 capitalize">
                        {selectedDatabase.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Host:</span>
                    <span className="text-gray-200">
                      {selectedDatabase.host}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-gray-200">
                      {selectedDatabase.type.toUpperCase()}
                    </span>
                  </div>
                  {selectedDatabase.lastBackup && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Backup:</span>
                      <span className="text-gray-200">
                        {selectedDatabase.lastBackup.toRelativeTimeString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tables Schema (only for PostgreSQL/MongoDB) */}
              {selectedDatabase.type === "postgresql" && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-200 flex items-center gap-2">
                      <Table className="w-4 h-4" />
                      Tables Schema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tableSchemas.map((table) => (
                        <div
                          key={table.name}
                          className="flex items-center justify-between p-2 rounded bg-gray-700/50 hover:bg-gray-700 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Table className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-200">
                              {table.name}
                            </span>
                          </div>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>{table.columns} cols</span>
                            <span>{table.rows.toLocaleString()} rows</span>
                            <span>{table.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Table className="w-4 h-4 mr-2" />
                        Query Builder
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-200">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Monitor Performance
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

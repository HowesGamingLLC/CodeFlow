import React from "react";
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
import {
  Users,
  Plus,
  Settings,
  Crown,
  Shield,
  Eye,
  Trash2,
  Mail,
} from "lucide-react";
import { useNetlifyStore } from "@/lib/netlify-store";

export function TeamSettings() {
  const { currentTeam, user } = useNetlifyStore();

  const mockTeamMembers = [
    {
      id: "1",
      name: "Spin Bigz",
      email: "coinkrazy00@gmail.com",
      role: "owner" as const,
      avatar: null,
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
      id: "2",
      name: "John Developer",
      email: "john@example.com",
      role: "admin" as const,
      avatar: null,
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
    {
      id: "3",
      name: "Jane Designer",
      email: "jane@example.com",
      role: "editor" as const,
      avatar: null,
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />;
      case "editor":
        return <Settings className="w-4 h-4 text-green-500" />;
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default" as const;
      case "admin":
        return "secondary" as const;
      case "editor":
        return "outline" as const;
      case "viewer":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your team members and permissions
        </p>
      </div>

      {/* Team Info */}
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>Basic information about your team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Team Name
              </label>
              <Input
                value={currentTeam?.name || ""}
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Plan
              </label>
              <div className="mt-1">
                <Badge variant="outline" className="capitalize">
                  {currentTeam?.plan}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Input
              value={currentTeam?.description || ""}
              placeholder="Add a team description..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members ({mockTeamMembers.length})
              </CardTitle>
              <CardDescription>
                Manage who has access to your team's sites
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTeamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      {member.email === user?.email && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      Joined {member.joinedAt.toRelativeTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={getRoleBadgeVariant(member.role)}
                    className="flex items-center gap-1"
                  >
                    {getRoleIcon(member.role)}
                    {member.role}
                  </Badge>

                  {member.role !== "owner" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>What each role can do in your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="font-medium text-gray-900 dark:text-white">
                Permission
              </div>
              <div className="font-medium text-center">Owner</div>
              <div className="font-medium text-center">Admin</div>
              <div className="font-medium text-center">Editor</div>
            </div>

            {[
              "Create sites",
              "Deploy sites",
              "Manage domains",
              "Invite members",
              "Remove members",
              "Billing access",
            ].map((permission) => (
              <div
                key={permission}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-gray-100 dark:border-gray-800 text-sm"
              >
                <div className="text-gray-700 dark:text-gray-300">
                  {permission}
                </div>
                <div className="text-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                </div>
                <div className="text-center">
                  {[
                    "Create sites",
                    "Deploy sites",
                    "Manage domains",
                    "Invite members",
                  ].includes(permission) ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
                <div className="text-center">
                  {["Create sites", "Deploy sites"].includes(permission) ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div>
              <p className="font-medium text-red-800 dark:text-red-400">
                Delete this team
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Once you delete a team, there is no going back. Please be
                certain.
              </p>
            </div>
            <Button variant="destructive">Delete Team</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

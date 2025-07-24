import React from "react";
import {
  Bell,
  Settings,
  User,
  Plus,
  Search,
  Globe,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNetlifyStore } from "@/lib/netlify-store";
import { CreateSiteModal } from "./CreateSiteModal";
import { Link } from "react-router-dom";

export function NetlifyHeader() {
  const { user, currentTeam, logout, unreadCount } = useNetlifyStore();
  const [showCreateSite, setShowCreateSite] = React.useState(false);

  return (
    <>
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-500"
          >
            <Home className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              AppStop.pro
            </span>
          </div>

          {currentTeam && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>/</span>
              <span>{currentTeam.name}</span>
            </div>
          )}
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search sites, builds, or teams..."
              className="pl-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowCreateSite(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New site
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CreateSiteModal
        open={showCreateSite}
        onClose={() => setShowCreateSite(false)}
      />
    </>
  );
}

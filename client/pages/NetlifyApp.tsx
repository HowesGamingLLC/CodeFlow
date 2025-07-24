import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNetlifyStore } from "@/lib/netlify-store";
import { NetlifyLayout } from "@/components/netlify/NetlifyLayout";

export default function NetlifyApp() {
  const { isAuthenticated, user, loadSites, loadDashboardStats } =
    useNetlifyStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSites();
      loadDashboardStats();
    }
  }, [isAuthenticated, user, loadSites, loadDashboardStats]);

  if (!isAuthenticated) {
    return <Navigate to="/netlify/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NetlifyLayout />
    </div>
  );
}

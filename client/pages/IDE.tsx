import React, { useEffect } from "react";
import { IDELayout } from "@/components/ide/IDELayout";
import { useIDEStore } from "@/lib/ide-store";

export default function IDE() {
  const { currentProject, createProject } = useIDEStore();

  useEffect(() => {
    // If no project is loaded, create a default one
    if (!currentProject) {
      createProject("My First Project", "vanilla-js", "javascript");
    }
  }, [currentProject, createProject]);

  return (
    <div className="h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <IDELayout />
    </div>
  );
}

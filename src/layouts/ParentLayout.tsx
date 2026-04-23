import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ParentSidebar } from "@/widgets/sidebar";
import "./ParentLayout.css";

export default function ParentLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="parent-layout">
      <ParentSidebar onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="parent-main">
        <Outlet />
      </main>
    </div>
  );
}

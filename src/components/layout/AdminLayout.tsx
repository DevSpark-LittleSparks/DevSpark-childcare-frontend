import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import SettingsDrawer from "./SettingsDrawer";

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        className="flex-1 bg-[#f8fafc] dark:bg-slate-950 transition-all duration-300 ease-in-out"
        style={{ marginLeft: isCollapsed ? "80px" : "280px" }}
      >
        <Outlet />
      </main>

      {/* Slide-in settings drawer */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default AdminLayout;


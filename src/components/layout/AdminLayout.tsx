import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import SettingsDrawer from "./SettingsDrawer";

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-x-hidden flex w-full">
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        className="transition-all duration-300 ease-in-out min-h-screen w-full"
        style={{ paddingLeft: isCollapsed ? "80px" : "280px" }}
      >
        <Outlet />
      </main>

      {/* Slide-in settings drawer */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default AdminLayout;

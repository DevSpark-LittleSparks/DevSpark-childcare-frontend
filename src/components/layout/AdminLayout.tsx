import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import SettingsDrawer from "./SettingsDrawer";
import UniversalSmartAssistant from "../chatbots/UniversalSmartAssistant";

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  // Messaging is a full-height chat interface with its own internal
  // scrolling — it needs the shell edge-to-edge, unlike the other pages.
  const isMessaging = location.pathname.startsWith("/admin/messages");

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-x-hidden flex w-full">
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        className="transition-all duration-300 ease-in-out min-h-screen w-full"
        style={{
          paddingLeft: isCollapsed ? "80px" : "280px",
          ...(isMessaging
            ? { height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" as const }
            : {}),
        }}
      >
        <Outlet />
      </main>

      {/* Slide-in settings drawer */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Smart Assistant from dev branch */}
      <UniversalSmartAssistant />
    </div>
  );
};

export default AdminLayout;

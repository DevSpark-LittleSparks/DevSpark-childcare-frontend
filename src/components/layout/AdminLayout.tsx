import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import SettingsDrawer from "./SettingsDrawer";
import UniversalSmartAssistant from "../chatbots/UniversalSmartAssistant";

const AdminLayout: React.FC = () => {
  // Shared state to track whether the sidebar is collapsed or expanded
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  // Messaging is a full-height chat interface with its own internal
  // scrolling — it needs the shell edge-to-edge, unlike the other pages.
  const isMessaging = location.pathname.startsWith("/admin/messages");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Pass the state and the setter function as props to the Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        className="flex-1 bg-[#f8fafc] dark:bg-slate-950 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isCollapsed ? "80px" : "280px",
          ...(isMessaging
            ? { height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" as const }
            : {}),
        }}
      >
        {/* Renders the specific page content based on the route */}
        <Outlet />
      </main>

      {/* Slide-in settings drawer */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <UniversalSmartAssistant />
    </div>
  );
};

export default AdminLayout;

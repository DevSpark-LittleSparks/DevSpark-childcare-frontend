import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";
import SettingsDrawer from "./SettingsDrawer";
import UniversalSmartAssistant from "../chatbots/UniversalSmartAssistant";

const ParentLayout: React.FC = () => {
  // Shared state to sync sidebar width with main content margin
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  // Messaging is a full-height chat interface with its own internal
  // scrolling — it needs the shell edge-to-edge, unlike the padded pages.
  const isMessaging = location.pathname.startsWith("/parent/messages");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Pass state to sidebar */}
      <ParentSidebar
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
        {isMessaging ? (
          <Outlet />
        ) : (
          <div style={{ padding: "24px" }}>
            <Outlet />
          </div>
        )}
      </main>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <UniversalSmartAssistant />
    </div>
  );
};

export default ParentLayout;
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";

const ParentLayout: React.FC = () => {
  // Shared state to sync sidebar width with main content margin
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  // Messaging is a full-height chat interface with its own internal
  // scrolling — it needs the shell edge-to-edge, unlike the padded pages.
  const isMessaging = location.pathname.startsWith("/parent/messages");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Pass state to sidebar */}
      <ParentSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main
        style={{
          flex: 1,
          // Dynamic margin: 80px when collapsed, 280px when expanded
          marginLeft: isCollapsed ? "80px" : "280px",
          backgroundColor: "#f8fafc",
          transition: "margin-left 0.3s ease-in-out",
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
    </div>
  );
};

export default ParentLayout;
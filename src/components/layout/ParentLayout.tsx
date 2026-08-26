import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";
import UniversalSmartAssistant from "../chatbots/UniversalSmartAssistant";

const ParentLayout: React.FC = () => {
  // Shared state to sync sidebar width with main content margin
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          transition: "margin-left 0.3s ease-in-out" 
        }}
      >
        <div style={{ padding: "24px" }}>
          <Outlet />
        </div>
      </main>
      <UniversalSmartAssistant />
    </div>
  );
};

export default ParentLayout;
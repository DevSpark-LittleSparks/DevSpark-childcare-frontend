import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import UniversalSmartAssistant from "../chatbots/UniversalSmartAssistant";

const AdminLayout: React.FC = () => {
  // Shared state to track whether the sidebar is collapsed or expanded
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Pass the state and the setter function as props to the Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main 
        style={{ 
          flex: 1, 
          // Adjust the left margin dynamically based on the sidebar width
          marginLeft: isCollapsed ? "80px" : "280px", 
          backgroundColor: "#f8fafc",
          // Smooth transition for the margin when the sidebar expands/collapses
          transition: "margin-left 0.3s ease-in-out" 
        }}
      >
        {/* Renders the specific page content based on the route */}
        <Outlet />
      </main>
      <UniversalSmartAssistant />
    </div>
  );
};

export default AdminLayout;
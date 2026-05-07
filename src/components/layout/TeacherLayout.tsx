import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

const TeacherLayout: React.FC = () => {
  // Lifted state to control layout expansion
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <TeacherSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main 
        style={{ 
          flex: 1, 
          // Adjust margin dynamically: 80px or 280px
          marginLeft: isCollapsed ? "80px" : "280px", 
          backgroundColor: "#f8fafc",
          transition: "margin-left 0.3s ease-in-out" 
        }}
      >
        <div style={{ padding: "24px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
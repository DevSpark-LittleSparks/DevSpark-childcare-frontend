import React from "react";
import { Outlet } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";

const ParentLayout: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <ParentSidebar />
      <main style={{ flex: 1, marginLeft: "280px", backgroundColor: "#f8fafc" }}>
        <Outlet />
      </main>
    </div>
  );
};
export default ParentLayout;
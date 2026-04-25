import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: "280px", backgroundColor: "#f8fafc" }}>
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
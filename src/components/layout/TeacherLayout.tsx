import React from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

const TeacherLayout: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <TeacherSidebar />
      <main style={{ flex: 1, marginLeft: "280px", backgroundColor: "#f8fafc" }}>
        <Outlet />
      </main>
    </div>
  );
};
export default TeacherLayout;
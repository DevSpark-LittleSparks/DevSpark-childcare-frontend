import { Outlet } from "react-router-dom";
import TeacherSidebar from "@/components/teacher/Sidebar";

export default function TeacherLayout() {
  return (
    <div style={{ display: "flex" }}>
      <TeacherSidebar />

      <main style={{ flex: 1, marginLeft: "18rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
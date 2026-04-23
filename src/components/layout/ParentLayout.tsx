import { Outlet } from "react-router-dom";
import ParentSidebar from "@/components/parent/Sidebar";

export default function ParentLayout() {
  return (
    <div style={{ display: "flex" }}>
      <ParentSidebar />

      <main style={{ flex: 1, marginLeft: "18rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
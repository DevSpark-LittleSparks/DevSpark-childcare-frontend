import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/widgets/sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
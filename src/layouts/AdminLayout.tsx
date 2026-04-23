import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="admin-main">
        <Outlet />
      </main>

      {isSettingsOpen && (
        <div className="settings-overlay">
          <div className="settings-panel">
            <h2>Settings Panel</h2>
            <p>Coming soon...</p>

            <button
              className="close-btn"
              onClick={() => setIsSettingsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
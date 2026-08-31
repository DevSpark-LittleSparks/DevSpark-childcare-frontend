import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import SettingsDrawer from "./SettingsDrawer";
import UniversalSmartAssistant from "../chatbots/UniversalSmartAssistant";

const TeacherLayout: React.FC = () => {
  // Lifted state to control layout expansion
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-x-hidden flex w-full">
      <TeacherSidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      <main 
        className="transition-all duration-300 ease-in-out min-h-screen w-full"
        style={{ paddingLeft: isCollapsed ? "80px" : "280px" }}
      >
        <div style={{ padding: "24px" }}>
          <Outlet />
        </div>
      </main>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <UniversalSmartAssistant />
    </div>
  );
};

export default TeacherLayout;
import { Outlet } from 'react-router-dom';

/**
 * AdminLayout Component (Temporary Version without Sidebar)
 * Wraps the dashboard pages with the main content area.
 */
export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Placeholder for the Sidebar. 
          We will leave this left section empty for now. 
          You can add the <Sidebar /> component here later once it is created. */}
      <div className="w-64 bg-primary-900 text-white p-6 hidden md:block opacity-50">
        <p className="text-sm">Sidebar (To be created)</p>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* This renders the child routes (e.g., AttendancePage, MealsPage) */}
        <Outlet />
      </main>
    </div>
  );
}

import { AdminSidebar as Sidebar } from "@/widgets/sidebar";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import { Navigate } from "react-router-dom";

export function MainLayout() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

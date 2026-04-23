import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/landing/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Login Page</h1>
          <p className="text-slate-600">This page will be implemented next!</p>
        </div>
      </div>
    ),
  },
]);

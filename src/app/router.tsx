import { createBrowserRouter } from "react-router-dom";

import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupRequestForm from "@/pages/auth/SignupRequestForm";
import AdminDashboard from "@/pages/admin/dashboard/AdminDashboard";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/get-started",
    element: <SignupRequestForm />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);
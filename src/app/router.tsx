import { createBrowserRouter } from "react-router-dom";

import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupRequestForm from "@/pages/auth/SignupRequestForm";
import AdminDashboard from "@/pages/admin/dashboard/AdminDashboard";
import ParentDashboard from "@/pages/parent/dashboard/ParentDashboard";
import ParentLayout from "@/layouts/ParentLayout";
import TeacherLayout from "@/layouts/TeacherLayout";
import TeacherDashboard from "@/pages/teacher/dashboard/TeacherDashboard";
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
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/parent",
    element: <ParentLayout />,
    children: [
      {
        path: "dashboard",
        element: <ParentDashboard />,
      },
    ],
  },
  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [
      {
        path: "dashboard",
        element: <TeacherDashboard />,
      },
    ],
  },  // ✅ IMPORTANT COMMA
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);
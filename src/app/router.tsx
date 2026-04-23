import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/landing/LandingPage";
import SignupRequestForm from "@/pages/auth/SignupRequestForm";
import RequestConfirmedPage from "@/pages/auth/RequestConfirmedPage";
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/request-form",
    element: <SignupRequestForm />,
  },
  {
    path: "/request-confirmed",
    element: <RequestConfirmedPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

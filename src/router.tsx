import { createBrowserRouter } from 'react-router-dom';

// new Layouts Import 
import AdminLayout from './components/layout/AdminLayout'; 
import ParentLayout from './components/layout/ParentLayout';
import TeacherLayout from './components/layout/TeacherLayout';

// Pages Import
import LandingPage from './pages/LandingPage';
import SignupRequestForm from './pages/auth/SignupRequestForm';
import RequestConfirmedPage from './pages/auth/RequestConfirmedPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminDashboardPage from './pages/admin/dashboard/AdminDashboard';
import AttendancePage from './pages/AttendancePage';
import MealsPage from './pages/MealsPage';
import ActivityPage from './pages/ActivityPage';
import StaffPage from './pages/StaffPage';
import BillingPage from './pages/BillingPage';
import { AdminProgressPage } from './pages/AdminProgressPage';
import { ParentProgressPage } from './pages/ParentProgressPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },

  {
    path: '/signup-request',
    element: <SignupRequestForm />,
  },
  {
    path: '/request-confirmed',
    element: <RequestConfirmedPage />,
  },  
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  
  // --- ADMIN SECTION ---
  {
    path: '/admin',
    element: <AdminLayout />, // AdminLayout
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'learning', element: <AdminProgressPage /> },
      { path: 'admissions', element: <div>Admissions Page</div> },
      { path: 'students', element: <div>Students Page</div> },
      { path: 'parents', element: <div>Parents Page</div> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'billing', element: <BillingPage /> },
    ],
  },

  // --- PARENT SECTION ---
  {
    path: '/parent',
    element: <ParentLayout />, // ParentLayout
    children: [
      { path: 'dashboard', element: <div>Parent Dashboard</div> },
      { path: 'children', element: <div>My Children</div> },
      { path: 'progress', element: <ParentProgressPage /> },
      { path: 'payments', element: <div>Payments</div> },
      { path: 'notifications', element: <div>Notifications</div> },
      { path: 'messaging', element: <div>Messaging</div> },
    ],
  },

  // --- TEACHER SECTION ---
  {
    path: '/teacher',
    element: <TeacherLayout />, // TeacherLayout
    children: [
      { path: 'dashboard', element: <TeacherDashboardPage /> },
      { path: 'attendance', element: <div>Daily Attendance</div> },
      { path: 'activities', element: <div>My Activities</div> },
      { path: 'meals', element: <div>Meals</div> },
      { path: 'messages', element: <div>Messaging</div> },
    ],
  },
]);
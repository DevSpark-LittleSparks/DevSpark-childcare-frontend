import { createBrowserRouter } from 'react-router-dom';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import ParentLayout from './components/layout/ParentLayout';
import TeacherLayout from './components/layout/TeacherLayout';

// Public & Auth Pages
import LandingPage from './pages/LandingPage';
import SignupRequestForm from './pages/auth/SignupRequestForm';
import RequestConfirmedPage from './pages/auth/RequestConfirmedPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboard';
import AdminProfilePage from './pages/admin/ProfilePage';
import AdmissionsPage from './pages/admin/Admissions';
import Student from './pages/admin/Student';
import ChildProfilePage from './pages/admin/ChildProfilePage';
import ParentManagement from './pages/admin/ParentManagement';
import Teachers from './pages/admin/Teachers';
import BroadcastPortal from './pages/admin/BroadcastPortal';
import AdminProgressPage from './pages/AdminProgressPage'; // ← Progress/Chatbot feature
import AdminActivityPage from './pages/admin/AdminActivityPage';
import MealsPage from './pages/admin/MealsPage';

// Parent Pages
import ParentProfilePage from './pages/parent/ProfilePage';
import ChildViewPage from './pages/parent/ChildViewPage';
import MyChildren from './pages/parent/MyChildren';
import ParentDashboard from './pages/parent/dashboard/ParentDashboard';
import ParentProgressPage from './pages/ParentProgressPage'; // ← Progress/Chatbot feature

// Teacher Pages
import TeacherProfilePage from './pages/teacher/ProfilePage';
import TeacherDashboardPage from './pages/TeacherDashboardPage'; // ← Progress/Chatbot feature
import AttendancePage from './pages/AttendancePage'; // ← Activity/Schedule feature
import TeacherActivityPage from './pages/TeacherActivityPage'; // ← Activity/Schedule feature
import TeacherMealsPage from './pages/teacher/TeacherMealsPage';
// Other Management Pages
import BillingPage from './pages/BillingPage';

import { UserProfile } from './types/user.types';

const mockUser: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@littlespark.com',
  role: 'PARENT',
  password: 'password123',
  address: 'No 123, Matale, Sri Lanka',
  phone1: '0771234567',
  phone2: '0711234567',
  relationship: 'Father',
  children: [{ id: 'c1', name: 'Shemil Doe', age: 4, gender: 'Male', enrolledDate: '2026-01-01' }],
};

export const router = createBrowserRouter([
  // ── PUBLIC ──────────────────────────────────────────────────────────────
  { path: '/', element: <LandingPage /> },
  { path: '/signup-request', element: <SignupRequestForm /> },
  { path: '/request-confirmed', element: <RequestConfirmedPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-otp', element: <VerifyOtpPage /> },
  { path: '/about', element: <AboutUsPage /> },
  { path: '/contact', element: <ContactPage /> },

  // ── ADMIN ────────────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'profile', element: <AdminProfilePage /> },
      { path: 'admissions', element: <AdmissionsPage /> },
      { path: 'students', element: <Student /> },
      { path: 'students/:studentId', element: <ChildProfilePage /> },
      { path: 'parents', element: <ParentManagement /> },
      { path: 'teachers', element: <Teachers /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'meals', element: <MealsPage /> },
      { path: 'broadcast', element: <BroadcastPortal /> },
      { path: 'learning', element: <AdminProgressPage /> },
      { path: 'activities', element: <AdminActivityPage /> },
      { path: 'schedules', element: <AdminActivityPage /> },
    ],
  },

  // ── PARENT ───────────────────────────────────────────────────────────────
  {
    path: '/parent',
    element: <ParentLayout />,
    children: [
      { path: 'dashboard', element: <ParentDashboard /> },
      { path: 'profile', element: <ParentProfilePage initialUser={mockUser} /> },
      { path: 'children', element: <MyChildren /> },
      { path: 'child-profile/:studentId', element: <ChildViewPage /> },
      { path: 'progress', element: <ParentProgressPage /> },
      { path: 'payments', element: <div>Payments</div> },
      { path: 'notifications', element: <div>Notifications</div> },
      { path: 'messaging', element: <div>Messaging</div> },
    ],
  },

  // ── TEACHER ──────────────────────────────────────────────────────────────
  {
    path: '/teacher',
    element: <TeacherLayout />,
    children: [
      { path: 'dashboard', element: <TeacherDashboardPage /> },
      {
        path: 'profile',
        element: <TeacherProfilePage initialUser={{ ...mockUser, role: 'TEACHER' }} />,
      },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'activities', element: <TeacherActivityPage /> },
      { path: 'meals', element: <TeacherMealsPage /> },
      { path: 'messages', element: <div>Messaging</div> },
    ],
  },
]);

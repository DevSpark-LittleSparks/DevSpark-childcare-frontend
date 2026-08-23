import { createBrowserRouter } from 'react-router-dom';

// Layouts Import 
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
import AdminMessagingPage from './pages/admin/MessagingPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { AlertsPage } from './pages/admin/AlertsPage';
import { MyAlertsPage } from './pages/alerts/MyAlertsPage';
import BroadcastPortal from './pages/admin/BroadcastPortal';

// Parent Pages
import ParentProfilePage from './pages/parent/ProfilePage';
import ChildViewPage from './pages/parent/ChildViewPage';
import MyChildren from './pages/parent/MyChildren';
import ParentDashboard from './pages/parent/dashboard/ParentDashboard';
import MessagingPage from './pages/parent/MessagingPage';

// Teacher Pages
import TeacherProfilePage from './pages/teacher/ProfilePage';

// Other Management Pages
import { BillingPage } from './pages/billing/BillingPage';
import { RevenueAnalysisPage } from './pages/billing/RevenueAnalysisPage';
import { PaymentStatusPage } from './pages/billing/PaymentStatusPage';
import MealsPage from './pages/MealsPage';

// Import Types
import { UserProfile } from './types/user.types';

// Mock data for initial profile states
const mockUser: any = {
  id: '1',
  name: 'John Doe',
  email: 'john@littlespark.com',
  role: 'PARENT',
  password: 'password123',
  address: 'No 123, Matale, Sri Lanka',
  phone1: '0771234567',
  phone2: '0711234567',
  relationship: 'Father',
  centerName: 'Little Sparks',
  capacity: 50,
  children: [
    { id: 'c1', name: 'Shemil Doe', age: 4, gender: 'Male', enrolledDate: '2026-01-01' }
  ]
};

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  { path: '/', element: <LandingPage /> },
  { path: '/signup-request', element: <SignupRequestForm /> },
  { path: '/request-confirmed', element: <RequestConfirmedPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-otp', element: <VerifyOtpPage /> },
  { path: '/about', element: <AboutUsPage /> },
  { path: '/contact', element: <ContactPage /> },


  // --- ADMIN SECTION ---
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'profile', element: <AdminProfilePage initialUser={{ ...mockUser, role: 'ADMIN' }} /> },
      { path: 'admissions', element: <AdmissionsPage /> },
      { path: 'students', element: <Student /> },
      // Admin route for full management/editing
      { path: 'students/:studentId', element: <ChildProfilePage /> },
      { path: 'parents', element: <ParentManagement /> },
      { path: 'teachers', element: <Teachers /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'revenue-analysis', element: <RevenueAnalysisPage /> },
      { path: 'payment-status', element: <PaymentStatusPage /> },
      { path: 'meal', element: <MealsPage /> },
      { path: 'messages', element: <AdminMessagingPage /> },
      { path: 'logs', element: <AuditLogsPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'broadcast', element: <BroadcastPortal /> },
    ],
  },

  // --- PARENT SECTION ---
  {
    path: '/parent',
    element: <ParentLayout />,
    children: [
      { path: 'dashboard', element: <ParentDashboard /> },
      { path: 'profile', element: <ParentProfilePage initialUser={mockUser} /> },
      { path: 'children', element: <MyChildren /> },
      { path: 'child-profile/:studentId', element: <ChildViewPage /> },
      { path: 'progress', element: <div>Progress</div> },
      { path: 'payments', element: <BillingPage /> },
      { path: 'messages', element: <MessagingPage /> },
      { path: 'alerts', element: <MyAlertsPage /> },
    ],
  },

  // --- TEACHER SECTION ---
  {
    path: '/teacher',
    element: <TeacherLayout />,
    children: [
      { path: 'dashboard', element: <div>Teacher Dashboard</div> },
      {
        path: 'profile',
        element: <TeacherProfilePage initialUser={{ ...mockUser, role: 'TEACHER' }} />
      },
      { path: 'attendance', element: <div>Daily Attendance</div> },
      { path: 'activities', element: <div>My Activities</div> },
      { path: 'meals', element: <div>Meals</div> },
      { path: 'messages', element: <div>Messaging</div> },
    ],
  },
]);
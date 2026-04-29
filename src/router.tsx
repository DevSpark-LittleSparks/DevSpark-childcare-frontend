import { createBrowserRouter } from 'react-router-dom';

// Layouts Import 
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
import AdminProfilePage from './pages/admin/ProfilePage';
import StaffPage from './pages/StaffPage';
import BillingPage from './pages/BillingPage';
import ParentProfilePage from './pages/parent/ProfilePage';
import TeacherProfilePage from './pages/teacher/ProfilePage';

// Import Types
import { UserProfile } from './types/user.types';

/**
 * Temporary Mock User for Profile Testing
 * This should ideally come from your Auth Context later.
 */
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
  children: [
    { id: 'c1', name: 'Shemil Doe', age: 4, gender: 'Male', enrolledDate: '2026-01-01' }
  ]
};

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
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
    element: <AdminLayout />, 
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'profile', element: <AdminProfilePage initialUser={{...mockUser, role: 'ADMIN'}} /> },
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
    element: <ParentLayout />, 
    children: [
      { path: 'dashboard', element: <div>Parent Dashboard</div> },
      { path: 'profile', element: <ParentProfilePage initialUser={mockUser} /> },
      { path: 'children', element: <div>My Children</div> },
      { path: 'progress', element: <div>Progress</div> },
      { path: 'payments', element: <div>Payments</div> },
      { path: 'notifications', element: <div>Notifications</div> },
      { path: 'messaging', element: <div>Messaging</div> },
    ],
  },

  // --- TEACHER SECTION ---
  {
    path: '/teacher',
    element: <TeacherLayout />, 
    children: [
      { path: 'dashboard', element: <div>Teacher Dashboard</div> },
      { path: 'profile', element: <TeacherProfilePage initialUser={{...mockUser, role: 'TEACHER'}} /> },
      { path: 'attendance', element: <div>Daily Attendance</div> },
      { path: 'activities', element: <div>My Activities</div> },
      { path: 'meals', element: <div>Meals</div> },
      { path: 'messages', element: <div>Messaging</div> },
    ],
  },
]);
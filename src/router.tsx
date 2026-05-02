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

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboard';
import AdminProfilePage from './pages/admin/ProfilePage';
import AdmissionsPage from './pages/admin/Admissions';
import Student from './pages/admin/Student';
import ChildProfilePage from './pages/admin/ChildProfilePage'; // Admin Edit/Manage Page
import ParentManagement from './pages/admin/ParentManagement';

// Parent Pages
import ParentProfilePage from './pages/parent/ProfilePage';
import ChildViewPage from './pages/parent/ChildViewPage'; // Parent View-Only Page
import MyChildren from './pages/parent/MyChildren';
import ParentDashboard from './pages/parent/dashboard/ParentDashboard';

// Teacher Pages
import TeacherProfilePage from './pages/teacher/ProfilePage';

// Other Management Pages
import BillingPage from './pages/BillingPage';
import MealsPage from './pages/MealsPage';

// Import Types
import { UserProfile } from './types/user.types';

// Mock data for initial profile states
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
  { path: '/', element: <LandingPage /> },
  { path: '/signup-request', element: <SignupRequestForm /> },
  { path: '/request-confirmed', element: <RequestConfirmedPage /> },  
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },

  // --- ADMIN SECTION ---
  {
    path: '/admin',
    element: <AdminLayout />, 
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'profile', element: <AdminProfilePage initialUser={{...mockUser, role: 'ADMIN'}} /> },
      { path: 'admissions', element: <AdmissionsPage /> }, 
      { path: 'students', element: <Student /> },
      // Admin route for full management/editing
      { path: 'students/:studentId', element: <ChildProfilePage /> }, 
      { path: 'parents', element: <ParentManagement /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'meal', element: <MealsPage /> },
    ],
  },

  // --- PARENT SECTION 
      
      // --- PARENT SECTION ---
{
  path: '/parent',
  element: <ParentLayout />, // Use the Layout here, NOT MyChildren
  children: [
    // This makes /parent redirect to dashboard or children automatically
    { path: 'dashboard', element: <ParentDashboard /> },
    { path: 'profile', element: <ParentProfilePage initialUser={mockUser} /> },
    
    // This is the page with your clickable cards
    { path: 'children', element: <MyChildren /> }, 
    
    // This is the profile page you want to see when you click
    { path: 'child-profile/:studentId', element: <ChildViewPage /> }, 
    
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
      { 
        path: 'profile', 
        element: <TeacherProfilePage initialUser={{...mockUser, role: 'TEACHER'}} /> 
      },
      { path: 'attendance', element: <div>Daily Attendance</div> },
      { path: 'activities', element: <div>My Activities</div> },
      { path: 'meals', element: <div>Meals</div> },
      { path: 'messages', element: <div>Messaging</div> },
    ],
  },
]);
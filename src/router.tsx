import { createBrowserRouter } from 'react-router-dom';

// Import Layouts (Using direct paths)
import AdminLayout from './components/layout/AdminLayout';

// Import Pages (Using direct paths)
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import MealsPage from './pages/MealsPage';
import ActivityPage from './pages/ActivityPage';
import StaffPage from './pages/StaffPage';
import BillingPage from './pages/BillingPage';

/**
 * Application Router Configuration
 * Defines all the paths and their corresponding components.
 */
export const router = createBrowserRouter([
  {
    // The main landing page of the application
    path: '/',
    element: <LandingPage />,
  },
  {
    // Protected Admin Dashboard Routes wrapped in the AdminLayout
    element: <AdminLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },

      // Newly added modules for your specific requirements
      { path: '/attendance', element: <AttendancePage /> },
      { path: '/meals', element: <MealsPage /> },
      { path: '/activity', element: <ActivityPage /> },

      // Other existing modules
      { path: '/staff', element: <StaffPage /> },
      { path: '/billing', element: <BillingPage /> },
    ],
  },
]);

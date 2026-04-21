import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from '@/components/shared/Layout';

// Import all 5 main pages for each module using absolute paths
import DashboardPage from '@/pages/DashboardPage';
import AcademicPage from '@/pages/AcademicPage';
import StaffPage from '@/pages/StaffPage';
import HealthPage from '@/pages/HealthPage';
import BillingPage from '@/pages/BillingPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Render all pages inside the shared Layout wrapper */}
        <Route
          path="/"
          element={
            <Layout>
              <DashboardPage />
            </Layout>
          }
        />
        <Route
          path="/academic"
          element={
            <Layout>
              <AcademicPage />
            </Layout>
          }
        />
        <Route
          path="/staff"
          element={
            <Layout>
              <StaffPage />
            </Layout>
          }
        />
        <Route
          path="/health"
          element={
            <Layout>
              <HealthPage />
            </Layout>
          }
        />
        <Route
          path="/billing"
          element={
            <Layout>
              <BillingPage />
            </Layout>
          }
        />

        {/* Catch-all route: Redirect to home page if an invalid URL is entered */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { router } from './router';
import { Toaster } from 'react-hot-toast';
import { selectAuthLoading } from './features/auth/model/authSlice';
import './index.css';

/**
 * LittleSpark App Component
 */
const App: React.FC = () => {
  // Wait for Firebase's first auth check before rendering any route — a page's
  // own data-fetch can otherwise fire before a session is restored on refresh,
  // going out with no auth token and coming back empty.
  const isAuthLoading = useSelector(selectAuthLoading);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#06B6D4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      {/*  */}
      <Toaster />
    </>
  );
};

export default App;

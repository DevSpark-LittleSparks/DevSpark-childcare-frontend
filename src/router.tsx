import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import MessagesPage from './pages/MessagesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/messages" replace /> },
      { path: '/messages', element: <MessagesPage /> },
      // Other mock routes
      { path: '/home', element: <div className="p-8">Home</div> },
      { path: '/children', element: <div className="p-8">My Children</div> },
      { path: '/progress', element: <div className="p-8">Progress</div> },
      { path: '/payments', element: <div className="p-8">Payments</div> },
      { path: '/notifications', element: <div className="p-8">Notifications</div> },
      { path: '/profile', element: <div className="p-8">My Profile</div> },
    ],
  },
]);

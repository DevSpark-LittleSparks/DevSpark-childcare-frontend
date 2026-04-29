
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; 
import './index.css';

/**
 * LittleSpark App Component
 * * This is the root component that initializes the Routing system.
 * Global configurations like Auth Providers or Theme Providers 
 * should wrap the RouterProvider here if added later.
 */
const App: React.FC = () => {
  return (
    // The RouterProvider handles the rendering of pages based on the URL
    // defined in your router.tsx file (including the new ProfilePage).
    <RouterProvider router={router} />
  );
};

export default App;
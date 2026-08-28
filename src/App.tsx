import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'react-hot-toast';
import './index.css';

/**
 * LittleSpark App Component
 */
const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      {/*  */}
      <Toaster />
    </>
  );
};

export default App;

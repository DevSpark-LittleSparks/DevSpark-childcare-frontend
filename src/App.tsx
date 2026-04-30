import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // Corrected to root path
import { UniversalSproutyAssistant } from '@/components/chatbot/UniversalSproutyAssistant';
import './index.css';

/**
 * App Component
 * The entry point that wraps the application with the Router.
 */
export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <UniversalSproutyAssistant />
    </>
  );
}
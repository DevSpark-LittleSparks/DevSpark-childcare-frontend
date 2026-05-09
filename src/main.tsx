import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

// Paths checked based on your sidebar
import App from './App'; 
import { store } from './store'; 
import { FirebaseAuthProvider } from './components/auth/FirebaseAuthProvider';
import './index.css';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <FirebaseAuthProvider>
          <App />
        </FirebaseAuthProvider>
      </Provider>
    </React.StrictMode>
  );
}
import { Provider } from 'react-redux';
import { store } from './store';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {/* If more Providers come in the future (e.g. ThemeProvider), they can also be added here */}
      {children}
    </Provider>
  );
}

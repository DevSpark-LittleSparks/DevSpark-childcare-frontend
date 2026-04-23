import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      {children}
    </ReduxProvider>
  );
}

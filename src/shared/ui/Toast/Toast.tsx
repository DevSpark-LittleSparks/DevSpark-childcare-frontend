import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
}

export const Toast = ({ message }: ToastProps) => {
  if (!message) return null;

  return (
    <div className="toast">
      <CheckCircle2 size={20} color="var(--success-text)" />
      {message}
    </div>
  );
};

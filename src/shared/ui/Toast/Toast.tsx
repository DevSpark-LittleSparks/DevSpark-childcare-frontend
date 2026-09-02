import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast">
      <CheckCircle2 size={20} color="var(--success-text)" />
      {message}
    </div>
  );
};

import React from 'react';

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">{message}</p>;
};

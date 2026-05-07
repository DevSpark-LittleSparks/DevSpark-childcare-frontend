import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 h-5 w-5",
        className
      )}
    />
  );
};

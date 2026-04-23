import React from "react";
import { Link } from "react-router-dom";
import logo from "@/shared/assets/images/logo.png";

interface AuthHeaderProps {
  backLink?: string;
  backText?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  backLink = "/", 
  backText = "← Back" 
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src={logo} alt="LittleSparks Logo" className="w-8 h-8 object-contain" />
        <span className="text-xl font-bold tracking-tight text-slate-800 uppercase">LittleSparks</span>
      </div>
      <Link 
        to={backLink} 
        className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors"
      >
        {backText}
      </Link>
    </header>
  );
};

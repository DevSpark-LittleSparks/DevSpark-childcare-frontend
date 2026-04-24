import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; // Make sure to install lucide-react if you haven't already: npm install lucide-react
import { Logo } from "../../../components/common/Logo";

interface AuthHeaderProps {
  backLink?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ backLink = "/login" }) => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      {/* Logo */}
      <Link to="/" className="hover:opacity-90 transition-opacity">
        <Logo 
          variant="dark" 
          iconClassName="w-8 h-8" 
          textClassName="text-xl" 
        />
      </Link>

      {/*back button*/}
      <Link 
        to={backLink} 
        className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </Link>
    </header>
  );
};
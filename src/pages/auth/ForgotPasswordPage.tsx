import React from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";
import { AuthHeader } from "../../shared/ui/AuthHeader/AuthHeader";


const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      { <AuthHeader backLink="/login" /> }

      <main className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl border-t-4 border-t-cyan-500 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Reset Password</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email to receive a password reset link.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
            />

            <Button 
              type="submit" 
              variant="primary"
              className="w-full py-4 rounded-xl shadow-lg shadow-cyan-500/30" 
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
            <span className="text-slate-500">Remember your password? </span>
            <Link 
              to="/login" 
              className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors underline decoration-2 underline-offset-4"
            >
              Back to Login
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;

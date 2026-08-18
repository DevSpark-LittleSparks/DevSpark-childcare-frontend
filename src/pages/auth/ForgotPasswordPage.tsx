import React from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";
import { AuthHeader } from "../../shared/ui/AuthHeader/AuthHeader";


import { firebaseAuth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Use Firebase SDK directly to send reset email
      await sendPasswordResetEmail(firebaseAuth, email);
      
      setMessage({
        type: 'success',
        text: "Success! A password reset link has been sent to your email address."
      });
      setEmail("");
    } catch (err: any) {
      console.error("Firebase reset error:", err);
      let errorText = "An error occurred. Please try again later.";
      
      // Firebase may silently succeed for non-existent emails for security reasons
      // auth/user-not-found is deprecated in newer Firebase SDK versions
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        errorText = "Please enter a valid email address.";
      } else if (err.code === 'auth/too-many-requests') {
        errorText = "Too many attempts. Please try again later.";
      }

      setMessage({
        type: 'error',
        text: errorText
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {message && (
              <div className={`p-4 rounded-xl text-sm font-bold animate-in fade-in duration-300 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {message.text}
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary"
              className="w-full py-4 rounded-xl shadow-lg shadow-cyan-500/30"
              isLoading={isSubmitting}
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

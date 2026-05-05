import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Logo } from "../../components/common/Logo";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { apiClient } from "../../services/axiosInstance";
import { AuthHeader } from "../../shared/ui/AuthHeader/AuthHeader";

const VerifyOtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from query params or state
  const queryEmail = new URLSearchParams(location.search).get("email") || "";
  const [email, setEmail] = useState(queryEmail);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If email was passed in location state (e.g. from Signup form)
  useEffect(() => {
    if (!email && location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      setError("Please enter both email and verification code.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/api/v1/auth/signup/verify-otp", {
        email: email,
        otpCode: otp
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { state: { message: "Account activated! Please login with your password." } });
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-500">
          
          {/* Main Verification Card */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-10 lg:p-12 relative overflow-hidden">
            
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500" />

            <div className="flex flex-col items-center mb-10">
              <Logo iconClassName="w-16 h-16" textClassName="text-3xl" />
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                Verify Email Address
              </h1>
              <p className="text-slate-500 font-medium">
                {email ? (
                  <>Code sent to <span className="text-slate-900 font-bold">{email}</span></>
                ) : (
                  "Please enter your email and the verification code sent to you."
                )}
              </p>
            </div>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                  <CheckIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-emerald-900">Verification Successful!</h2>
                <p className="text-emerald-700 text-sm">Redirecting you to the login page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {!queryEmail && (
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Verification Code
                  </label>
                  <input
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-cyan-500 focus:bg-white transition-all text-center text-2xl font-black tracking-[0.5em] text-slate-800 placeholder:text-slate-200"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center animate-shake">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-full py-5 rounded-2xl shadow-xl shadow-cyan-500/20 text-lg"
                  isLoading={isSubmitting}
                >
                  Confirm Activation
                </Button>

                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  Account will not be activated without verification.
                </p>
              </form>
            )}

            <div className="mt-12 flex flex-col items-center gap-6">
              <Link to="/login" className="text-sm font-black text-slate-400 hover:text-cyan-600 transition-colors uppercase tracking-widest">
                Back to Sign In
              </Link>
              
              <div className="h-px w-24 bg-slate-100" />
              
              <Link to="/login" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors underline decoration-2 underline-offset-4">
                Already have an account?
              </Link>
            </div>
          </div>

          <p className="text-center mt-10 text-slate-400 text-xs font-medium">
            &copy; 2026 DevSpark ChildCare. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

// --- Helper Icons ---
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default VerifyOtpPage;

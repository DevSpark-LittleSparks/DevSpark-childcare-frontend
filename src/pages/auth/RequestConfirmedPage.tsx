import React from "react";
import { Link } from "react-router-dom";
import { AuthHeader } from "../../shared/ui/AuthHeader/AuthHeader";
import ConfirmImg from "@/assets/images/request-confirm.png";

const RequestConfirmedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col font-sans">
      <AuthHeader />

      <main className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        
        {/* LEFT: CONTENT SECTION - Professional Alignment */}
        <section className="flex-1 p-8 lg:p-16 xl:p-24 bg-white dark:bg-[#0f172a] flex flex-col justify-center items-center lg:items-end">
          <div className="max-w-md w-full lg:mr-12 xl:mr-20">
            
            {/* Professional Checkmark Icon with Pulse Effect */}
            <div className="relative mb-10 mx-auto lg:mx-0 w-20 h-20">
              <div className="absolute inset-0 bg-cyan-400 opacity-20 rounded-full animate-ping"></div>
              <div className="relative w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-200">
                <span className="text-4xl text-white font-bold">✓</span>
              </div>
            </div>

            {/* Typography: More Professional Hierarchy */}
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
              Request <br />
              <span className="text-cyan-600">Submitted!</span>
            </h1>
            
            <div className="space-y-6 mb-12 border-l-4 border-slate-100 dark:border-slate-800/60 pl-6">
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
                Thank you for requesting access. The childcare administrator has been
                notified and will review your details shortly.
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Once approved, you will receive an email with a <b>Verification OTP</b> to activate your account. 
                Please keep an eye on your inbox!
              </p>
            </div>

            {/* CTA Button with better styling */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="w-full lg:w-max">
                <button className="w-full lg:w-max bg-cyan-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:bg-cyan-600 transition-all transform hover:-translate-y-1 active:scale-95 duration-300">
                  Back to Sign In
                </button>
              </Link>
            </div>

            {/* Subtle Support Text */}
            <p className="mt-8 text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
              Application ID: #{Math.floor(Math.random() * 90000) + 10000}
            </p>
          </div>
        </section>

        {/* RIGHT: FULL SIDE IMAGE (Kept exactly as before) */}
        <section className="hidden lg:flex flex-1 relative items-end justify-center overflow-hidden p-12">
          <div className="absolute inset-0 z-0">
            <img 
              src={ConfirmImg} 
              alt="Confirmation Background" 
              className="w-full h-full object-cover blur-[1px] brightness-[0.85] scale-105"
              style={{ objectPosition: 'center 35%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/50 to-blue-800/70 mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 text-center text-white space-y-3 max-w-sm mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl">
              You're All Set!
            </h2>
            <p className="text-cyan-50 text-lg opacity-95 leading-relaxed font-medium drop-shadow-lg">
              We'll notify you as soon as your account is ready for action.
            </p>
            <div className="w-16 h-1.5 bg-cyan-400 mx-auto rounded-full mt-6 shadow-lg" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default RequestConfirmedPage;
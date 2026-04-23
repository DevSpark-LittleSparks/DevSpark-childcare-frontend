import React from "react";
import { Link } from "react-router-dom";
import { AuthHeader } from "@/shared/ui/AuthHeader/AuthHeader";
import ConfirmImg from "@/shared/assets/images/request-confirm.png";

const RequestConfirmedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader />

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full">
        {/* LEFT: CONTENT */}
        <section className="flex-1 p-8 lg:p-16 xl:p-24 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-8 mx-auto lg:mx-0 shadow-inner">
              <span className="text-4xl text-emerald-600 font-bold">✓</span>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Request Submitted!
            </h1>
            
            <div className="space-y-4 mb-10">
              <p className="text-lg text-slate-600 leading-relaxed">
                Thank you for requesting access. The childcare administrator has been
                notified and will review your details shortly.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                You will receive an email confirmation with Login instructions once
                your request is approved.
              </p>
            </div>

            <Link to="/login" className="block">
              <button className="w-full lg:w-max bg-cyan-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all transform duration-300">
                Back to Sign In
              </button>
            </Link>
          </div>
        </section>

        {/* RIGHT: ILLUSTRATION */}
        <section className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-500 to-cyan-600 p-24 items-center justify-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 text-center text-white">
            <div className="w-full max-w-md aspect-square bg-white/20 backdrop-blur-lg rounded-3xl mb-12 flex items-center justify-center p-10 shadow-2xl transition-all duration-500">
              <img 
                src={ConfirmImg} 
                alt="Request Confirmation Illustration" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
            <p className="text-emerald-50 max-w-sm mx-auto text-lg opacity-90">
              We'll notify you as soon as your account is ready for action.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RequestConfirmedPage;

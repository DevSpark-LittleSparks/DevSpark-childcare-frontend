import React from "react";
import { AuthHeader } from "@/shared/ui/AuthHeader/AuthHeader";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import loginImg from "@/shared/assets/images/login.png";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader backLink="/" />

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full">
        {/* LEFT: FORM */}
        <section className="flex-1 p-8 lg:p-16 xl:p-24 bg-white flex flex-col justify-center relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0891B2 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 w-full max-w-md mx-auto">
            <LoginForm />
          </div>
        </section>

        {/* RIGHT: VISUAL */}
        <section className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-24 items-center justify-center relative overflow-hidden">
          {/* Abstract geometric elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
          </div>
          
          <div className="relative z-10 text-center text-white">
            <div className="w-full max-w-md aspect-square bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mb-12 flex items-center justify-center p-12 shadow-2xl transition-all duration-700 hover:rotate-1">
              <img 
                src={loginImg} 
                alt="Secure Login Illustration" 
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(8,145,178,0.3)] animate-float"
              />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Secure Access</h2>
            <p className="text-slate-300 max-w-sm mx-auto text-lg leading-relaxed">
              Log in to manage your center, track milestones, and stay connected with your community.
            </p>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

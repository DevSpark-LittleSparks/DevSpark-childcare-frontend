import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe } from 'lucide-react';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans text-slate-900 relative overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-white z-0"></div>
      
      {/* Blurred Background Logos (Watermarks) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        <div 
          className="absolute top-1/4 -left-32 w-[600px] h-[600px] opacity-[0.6] rotate-12"
          style={{ filter: 'blur(8px)' }}
        >
          <Logo iconClassName="w-full h-full !fill-slate-950 !stroke-slate-950" textClassName="hidden" variant="dark" />
        </div>
        <div 
          className="absolute top-2/3 -right-48 w-[800px] h-[800px] opacity-[0.4] -rotate-12"
          style={{ filter: 'blur(12px)' }}
        >
          <Logo iconClassName="w-full h-full !fill-slate-900 !stroke-slate-900" textClassName="hidden" variant="dark" />
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo iconClassName="w-10 h-10" textClassName="text-2xl" />
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-black text-slate-500 hover:text-primary-500 uppercase tracking-widest transition-colors hidden md:block"
            >
              Home
            </button>
            <Button
              variant="secondary"
              className="rounded-full px-6"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 italic">
            Get In <span className="text-primary-400">Touch.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg font-medium leading-relaxed">
            Have questions or need support? We are here to help your childcare center thrive.
            Reach out through any of our official channels.
          </p>
        </div>
      </section>

      {/* Contact Content - Centered Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-16">

          <div className="text-center space-y-4 max-w-2xl">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Official Channels</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Our support team is available Monday through Friday to assist you with any inquiries or technical needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <ContactInfoCard
              icon={<Mail size={24} className="text-primary-500" />}
              title="Email Us"
              detail="littlesparks@gmail.com"
              subDetail="24/7 Support Response"
            />
            <ContactInfoCard
              icon={<Phone size={24} className="text-emerald-500" />}
              title="Call Us"
              detail="+94 742062388"
              subDetail="Mon - Fri, 8am to 5pm"
            />
            <ContactInfoCard
              icon={<MapPin size={24} className="text-rose-500" />}
              title="Office"
              detail="Katubedda, Moratuwa"
              subDetail="Western Province, Sri Lanka"
            />
          </div>

          {/* Social / Quick Help */}
          <div className="flex flex-col md:flex-row gap-8 items-center pt-12 border-t border-slate-100 w-full max-w-5xl justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-500 transition-all cursor-pointer"><Globe size={24} /></div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-500 transition-all cursor-pointer"><MessageSquare size={24} /></div>
            </div>

            <div className="inline-flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
                <Clock size={20} />
              </div>
              <div className="text-left pr-4">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Fast Support</h4>
                <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Average response: 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-slate-100 relative z-10">
        <div className="text-center text-gray-500 border-t border-gray-800 pt-8">©2026_LittleSparks.com — All rights reserved</div>
      </footer>
    </div>
  );
};

const ContactInfoCard = ({ icon, title, detail, subDetail }: { icon: React.ReactNode, title: string, detail: string, subDetail: string }) => (
  <div className="flex flex-col items-center text-center p-10 bg-white/95 backdrop-blur-xl rounded-[3rem] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group border border-slate-100 relative overflow-hidden">
    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-50 transition-all duration-500 shadow-sm">
      {icon}
    </div>
    <div className="space-y-3">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</h4>
      <p className="text-xl font-black text-slate-900 tracking-tight leading-tight">{detail}</p>
      <p className="text-xs font-medium text-slate-500">{subDetail}</p>
    </div>
    {/* Subtle hover effect background */}
    <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

export default ContactPage;

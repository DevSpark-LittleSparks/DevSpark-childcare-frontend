import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { Heart, Target, Users, Sparkles, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import aboutImg from '../assets/images/aboutus.jpg';
import member1 from '../assets/images/member1.jpeg';
import member2 from '../assets/images/member2.jpeg';
import member3 from '../assets/images/member3.jpeg';
import member4 from '../assets/images/member4.jpeg';

const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo iconClassName="w-10 h-10" textClassName="text-2xl" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-sm font-black text-slate-500 hover:text-primary-500 uppercase tracking-widest transition-colors mr-6 hidden md:block"
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
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-cyan-200 to-cyan-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-[15px] text-black font-black uppercase tracking-widest mb-8 animate-fadeUp">

            Our Mission & Journey
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1] animate-fadeUp">
            Empowering The Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 italic">
              Generation Of Learners.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-12 animate-fadeUp delay-100">
            LittleSparks is more than just a management tool. We are a dedicated team
            on a mission to simplify early childhood education, giving educators more
            time to focus on what matters most: the children.
          </p>
          <div className="flex justify-center gap-4 animate-fadeUp delay-200">
            <Button
              variant="primary"
              className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20"
              onClick={() => navigate('/signup-request')}
            >
              Start Your Journey
            </Button>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </section>

      {/* Our Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100 border-8 border-white">
                <img
                  src={aboutImg}
                  alt="Child learning"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-50 max-w-xs hidden md:block">
                <div className="flex items-center gap-3 mb-3 text-primary-500">
                  <Target size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Our Vision</span>
                </div>
                <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                  "To be the digital heartbeat of every early learning center worldwide."
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Built by EDUCATORS, for EDUCATORS.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-6 group">
                  <div className="h-14 w-14 shrink-0 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 transition-transform group-hover:rotate-6">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Simplicity & Trust</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      We believe technology should be invisible. Our platform is designed to be
                      intuitive, secure, and reliable, so you can trust us with your most valuable data.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="h-14 w-14 shrink-0 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 transition-transform group-hover:rotate-6">
                    <Heart size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Passion for Progress</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Every update we ship and every feature we build is driven by the feedback
                      of thousands of teachers who use LittleSparks every day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diversity Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mb-8">
              <Globe size={14} className="text-primary-400" />
              Inclusion & Equity
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 leading-tight italic">
              Celebrating The Importance <br />
              <span className="text-primary-400 ">Of Diversity.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
              At LittleSparks, we believe that early childhood is where the seeds of
              inclusion are sown. Our platform is built to support diverse families,
              multicultural curricula, and accessible learning for every child,
              regardless of their background or ability.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nationalities</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessible</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Users size={14} />
              Our Team
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">Meet Our Leadership</h2>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TeamMember
              name="Senuri Werangana"
              image={member1}
            />
            <TeamMember
              name="Anjana Jayamaha"
              image={member2}
            />
            <TeamMember
              name="Agnes Ostina"
              image={member3}
            />
            <TeamMember
              name="Kavindu Welagedara"
              image={member4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-primary-500 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-[0_20px_50px_rgba(34,211,238,0.3)]">
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 italic">Ready to ignite your center?</h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-slate-50 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs w-full sm:w-auto"
                  onClick={() => navigate('/signup-request')}
                >
                  Join LittleSparks Today
                </Button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-100 text-center">

        <p className="mt-6 text-slate-400 text-sm font-medium tracking-wide italic">"Every spark tells a story. Let's make it beautiful."</p>
        <div className="mt-8 pt-8 border-t border-slate-50 max-w-7xl mx-auto">
          <div className="text-center text-gray-500 border-t border-gray-800 pt-8">©2026_LittleSparks.com — All rights reserved</div>
        </div>
      </footer>
    </div>
  );
};

const TeamMember = ({ name, image }: { name: string, image: string }) => (
  <div className="group space-y-4 text-center max-w-[200px] mx-auto">
    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg border-4 border-white transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-primary-100">
      <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">{name}</h4>
    </div>
  </div>
);

export default AboutUsPage;

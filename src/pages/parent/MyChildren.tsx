import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, GraduationCap, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';

const MyChildren = () => {
  const navigate = useNavigate();

  // This data structure matches the children array in your mockUser
  const childrenList = [
    { 
      id: 'c1', 
      name: 'Shemil Doe', 
      age: 4, 
      gender: 'Male', 
      enrolledDate: '2026-01-01', 
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80' 
    }
  ];

  return (
    <div className="p-8 bg-surface-secondary min-h-screen font-sans text-left">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2 text-primary-500">
            <Sparkles size={16} className="fill-primary-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Family Dashboard</p>
          </div>
          <h1 className="text-4xl font-black text-midnight tracking-tight italic">My Children</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {childrenList.map((child) => (
            /* CLICKABLE BOX START */
            <div 
              key={child.id}
              onClick={() => navigate(`/parent/child-profile/${child.id}`)}
              className="group bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-primary-200 transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-[-10%] right-[-5%] p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700">
                <GraduationCap size={160} />
              </div>

              <div className="flex items-center gap-6 mb-8 relative z-10">
                <div className="h-24 w-24 rounded-[2rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                  <img src={child.image} alt={child.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-midnight tracking-tight">{child.name}</h3>
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[9px] font-black uppercase tracking-widest inline-block">
                    {child.gender}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Age</p>
                  <p className="text-sm font-black text-midnight">{child.age} Years</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-black text-emerald-500 italic">Enrolled</p>
                </div>
              </div>

              {/* --- UPDATED BUTTON SECTION --- */}
              <div className="pt-6 border-t border-slate-50 relative z-10">
                <Button 
                  onClick={() => navigate(`/parent/child-profile/${child.id}`)}
                  className="w-full justify-between rounded-2xl py-6 group/btn"
                >
                  <span className="text-xs text-white font-black uppercase tracking-widest">
                    View Profile
                  </span>
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 text-white transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyChildren;
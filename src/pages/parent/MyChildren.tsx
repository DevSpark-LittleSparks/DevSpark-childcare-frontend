import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { User, ArrowRight, GraduationCap, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

const MyChildren = () => {
  const navigate = useNavigate();

  const { user } = useAppSelector((state: any) => state.auth);
  const [childrenList, setChildrenList] = useState<any[]>([
    { 
      id: 'c1', 
      name: 'Shemil Doe', 
      age: 4, 
      gender: 'Male', 
      enrolledDate: '2026-01-01', 
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80' 
    }
  ]);

  useEffect(() => {
    const allAdmissions = JSON.parse(localStorage.getItem('admissionsData') || '[]');
    
    const calculateAge = (dob: string) => {
      if (!dob) return 0;
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      return calculatedAge >= 0 ? calculatedAge : 0;
    };

    if (allAdmissions.length > 0) {
      let filtered = allAdmissions;
      if (user?.email) {
        filtered = allAdmissions.filter((c: any) => c.parentEmail === user.email);
      }
      
      if (filtered.length > 0) {
        setChildrenList(filtered.map((c: any) => ({
          id: c.id,
          name: c.fullName || c.nameWithInitials || 'Unknown',
          age: calculateAge(c.dob),
          gender: c.gender || 'Unknown',
          enrolledDate: c.enrolledDate || 'Unknown',
          image: c.profileImage || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80'
        })));
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft className="text-slate-400 group-hover:text-primary-500" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
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
      </main>
    </div>
  );
};

export default MyChildren;
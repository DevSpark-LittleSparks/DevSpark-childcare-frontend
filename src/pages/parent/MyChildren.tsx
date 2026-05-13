import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { User, ArrowRight, GraduationCap, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { apiClient } from '../../services/axiosInstance';

const MyChildren = () => {
  const navigate = useNavigate();

  const { user } = useAppSelector((state: any) => state.auth);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const calculateAge = (dob: string) => {
    if (!dob) return '---';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '---';
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await apiClient.get('/api/v1/parent/profile');
        if (res.data.success) {
          const parentData = res.data.data;
          setChildrenList(parentData.children.map((c: any) => ({
            id: c.childId,
            name: c.name,
            age: calculateAge(c.dob),
            gender: 'Enrolled',
            image: c.profilePic || ''
          })));
        }
      } catch (err) {
        console.error("Failed to fetch children:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

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
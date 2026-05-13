import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/model/authSlice';
import { 
  User, MapPin, ArrowLeft, Sparkles, Scale, Ruler, 
  Droplets, ClipboardList, Calendar, Heart, Fingerprint 
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo'; 
import { apiClient } from '../../services/axiosInstance';

const ChildViewPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const reduxUser = useSelector(selectUser);
  const [age, setAge] = useState<string>("");

  const [child, setChild] = useState({
    name: 'Loading...',
    fullName: 'Loading...',
    profileImage: '',
    dob: '',
    gender: '---',
    bloodGroup: '---',
    height: '---',
    weight: '---',
    address: '---',
    specialNote: '',
    enrolledDate: '---'
  });

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const res = await apiClient.get(`/api/v1/parent/child/${studentId}`);
        if (res.data.success) {
          const data = res.data.data;
          setChild({
            name: data.firstName,
            fullName: data.firstName + " " + data.lastName,
            profileImage: data.profilePic || '',
            dob: data.dob,
            gender: data.gender,
            bloodGroup: data.bloodGroup,
            height: data.height ? data.height.toString() : '---',
            weight: data.weight ? data.weight.toString() : '---',
            address: data.address,
            specialNote: data.specialNote,
            enrolledDate: data.enrolledDate || '---'
          });
        }
      } catch (err) {
        console.error("Failed to fetch child data:", err);
      }
    };

    if (studentId) {
      fetchChildData();
    }
  }, [studentId]);

  useEffect(() => {
    if (child.dob) {
      const birthDate = new Date(child.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? `${calculatedAge} Years` : "---");
    }
  }, [child.dob]);

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
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(10,6,55,0.02)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* --- CONTENT SECTION --- */}
          <div className="flex-[1.5] p-8 md:p-12 lg:p-16">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-3 text-primary-500">
                <Sparkles size={16} className="fill-primary-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Student Profile</p>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans uppercase">
                {child.name}
              </h1>
            </div>

            <div className="space-y-12">
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-10 h-[3px] bg-primary-500 rounded-full"></div> Personal Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoItem label="Full Name" value={child.fullName} />
                  <InfoItem label="Gender" value={child.gender} />
                  <InfoItem label="Date of Birth" value={`${child.dob} (${age})`} />
                  <InfoItem label="Enrolled Since" value={child.enrolledDate} />
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-10 h-[3px] bg-secondary-500 rounded-full"></div> Growth & Health
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={<Ruler size={20}/>} label="Height" value={`${child.height} cm`} color="text-blue-500" />
                  <StatCard icon={<Scale size={20}/>} label="Weight" value={`${child.weight} kg`} color="text-emerald-500" />
                  <StatCard icon={<Droplets size={20}/>} label="Blood" value={child.bloodGroup} color="text-rose-500" />
                  <StatCard icon={<Heart size={20}/>} label="Status" value="Healthy" color="text-orange-500" />
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100/50">
                  <div className="flex items-center gap-3 mb-4 text-rose-600">
                    <ClipboardList size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Medical Notes</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                    \"{child.specialNote || "No medical alerts for this student."}\"
                  </p>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <MapPin size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Home Address</span>
                  </div>
                  <p className="text-sm font-bold text-midnight leading-relaxed">
                    {child.address}
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* --- IMAGE SECTION --- */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-full overflow-hidden flex items-center justify-center p-6 bg-slate-900">
            <div className="absolute inset-0">
              <img 
                src={child.profileImage} 
                alt="background blur"
                className="w-full h-full object-cover scale-110 blur-2xl opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-[280px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-[8px] border-white/10 backdrop-blur-sm animate-fadeUp">
              <img 
                src={child.profileImage} 
                alt={child.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-6 right-8 z-20 bg-white/95 backdrop-blur-md p-4 rounded-[2.2rem] shadow-2xl flex items-center gap-4 transition-all hover:scale-105 border border-white">
               <div className="h-12 w-12 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                  <Fingerprint size={24} />
               </div>

               <div className="pr-4 text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                      Verified Student
                  </p>
                  <Logo 
                    variant="dark" 
                    iconClassName="w-6 h-6" 
                    textClassName="text-lg" 
                  />
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-base font-bold text-midnight tracking-tight">{value}</p>
  </div>
);

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-2">
    <div className={`${color} opacity-80`}>{icon}</div>
    <div className="space-y-0.5">
      <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{label}</p>
      <p className="text-xs font-black text-midnight">{value}</p>
    </div>
  </div>
);

export default ChildViewPage;
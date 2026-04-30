import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, MapPin, ArrowLeft, Sparkles, Scale, Ruler, 
  Droplets, ClipboardList, Calendar, Heart, Fingerprint 
} from 'lucide-react';
import { Button } from '../../components/common/Button';
// Assuming you have a Logo component in your project
import { Logo } from '../../components/common/Logo'; 

const ChildViewPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [age, setAge] = useState<string>("");

  // Sample data as fallback
  const [child, setChild] = useState({
    name: 'Amaya Perera',
    fullName: 'Amaya Sudeshini Perera',
    profileImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80', // Placeholder
    dob: '2020-05-15',
    gender: 'Female',
    bloodGroup: 'A+',
    height: '105',
    weight: '18',
    address: 'No 45, Flower Road, Colombo 07',
    specialNote: 'Nut allergy, requires inhaler for dust.',
    enrolledDate: '2026-01-10'
  });

  useEffect(() => {
    const allAdmissions = JSON.parse(localStorage.getItem('admissionsData') || '[]');
    const foundChild = allAdmissions.find((c: any) => c.id === studentId);
    
    if (foundChild) {
      setChild({
        name: foundChild.fullName || foundChild.nameWithInitials || 'Unknown',
        fullName: foundChild.fullName || 'Unknown',
        profileImage: foundChild.profileImage || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80',
        dob: foundChild.dob || '2020-01-01',
        gender: foundChild.gender || 'Not specified',
        bloodGroup: foundChild.bloodGroup || 'Not specified',
        height: foundChild.height || 'N/A',
        weight: foundChild.weight || 'N/A',
        address: foundChild.address || 'N/A',
        specialNote: foundChild.specialNote || 'No special notes.',
        enrolledDate: foundChild.enrolledDate || new Date().toISOString().split('T')[0]
      });
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
    <div className="h-screen w-full bg-white overflow-hidden font-sans">
      <div className="h-full w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* --- LEFT SIDE: CONTENT SECTION (60%) --- */}
        <div className="flex-[1.5] h-full overflow-y-auto p-8 md:p-16 scrollbar-hide">
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          
          {/* Navigation & Title */}
          <div className="mb-12">

            
              <button 
                            onClick={() => navigate('/parent/profile')}
                            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-primary-500 hover:shadow-md transition-all active:scale-95"
                          >
                            <ArrowLeft size={20} />
                          </button>

            <div className="flex items-center gap-2 mb-3 text-primary-500">
              <Sparkles size={16} className="fill-primary-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Student Profile</p>
            </div>
            <h1 className="text-5xl font-black text-midnight tracking-tight italic">
              {child.name}
            </h1>
          </div>

          <div className="space-y-12">
            {/* 1. Basic Information Grid */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b pb-4">Personal Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem label="Full Name" value={child.fullName} />
                <InfoItem label="Gender" value={child.gender} />
                <InfoItem label="Date of Birth" value={`${child.dob} (${age})`} />
                <InfoItem label="Enrolled Since" value={child.enrolledDate} />
              </div>
            </section>

            {/* 2. Physical & Health Stats (The Icons Section) */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b pb-4">Growth & Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<Ruler size={20}/>} label="Height" value={`${child.height} cm`} color="text-blue-500" />
                <StatCard icon={<Scale size={20}/>} label="Weight" value={`${child.weight} kg`} color="text-emerald-500" />
                <StatCard icon={<Droplets size={20}/>} label="Blood" value={child.bloodGroup} color="text-rose-500" />
                <StatCard icon={<Heart size={20}/>} label="Status" value="Healthy" color="text-orange-500" />
              </div>
            </section>

            {/* 3. Medical Notes & Address */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100/50">
                <div className="flex items-center gap-3 mb-4 text-rose-600">
                  <ClipboardList size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Medical Notes</span>
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                  "{child.specialNote || "No medical alerts for this student."}"
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

        {/* --- RIGHT SIDE: IMAGE SECTION (40%) --- */}
<div className="flex-1 relative min-h-[500px] md:min-h-full overflow-hidden flex items-center justify-center p-6 bg-slate-900">
  
  {/* 1. Background Blurred Image */}
  <div className="absolute inset-0">
    <img 
      src={child.profileImage} 
      alt="background blur"
      className="w-full h-full object-cover scale-110 blur-2xl opacity-40"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>
  </div>

  {/* 2. Focused Small Box Image - Size eka max-w-[280px] kiremen podi kara */}
  <div className="relative z-10 w-full max-w-[280px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-[8px] border-white/10 backdrop-blur-sm animate-fadeUp">
    <img 
      src={child.profileImage} 
      alt={child.name}
      className="w-full h-full object-cover"
    />
  </div>

  {/* 3. Floating Verified Badge - bottom-6 kiremen thawa pahalata kara */}
  <div className="absolute bottom-6 right-8 z-20 bg-white/95 backdrop-blur-md p-4 rounded-[2.2rem] shadow-2xl flex items-center gap-4 transition-all hover:scale-105 border border-white">
     {/* Verified Icon - Size poddak adu kara */}
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
    </div>
  );
};

// Helper Components
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
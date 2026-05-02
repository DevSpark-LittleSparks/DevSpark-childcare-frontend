import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, User, Users, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParentManagement = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<any[]>([]);

  useEffect(() => {
    // Load parents from admissionsData
    const admissionsData = JSON.parse(localStorage.getItem('admissionsData') || '[]');
    
    // Group children by parentEmail
    const parentsMap = new Map();

    admissionsData.forEach((child: any) => {
      if (!child.parentEmail) return;

      if (!parentsMap.has(child.parentEmail)) {
        parentsMap.set(child.parentEmail, {
          email: child.parentEmail,
          fullName: child.parentFullName,
          contact: child.parentContact,
          idNumber: child.parentID,
          relationship: child.relationship,
          children: []
        });
      }

      parentsMap.get(child.parentEmail).children.push({
        id: child.id,
        name: child.fullName || child.nameWithInitials,
        age: child.dob ? Math.floor((new Date().getTime() - new Date(child.dob).getTime()) / 31557600000) : 0,
        gender: child.gender,
        image: child.profileImage || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80'
      });
    });

    setParents(Array.from(parentsMap.values()));
  }, []);

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft className="text-slate-400 group-hover:text-primary-500" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
        {parents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
            <Users className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-600">No Parents Registered</h3>
            <p className="text-sm text-slate-400">Register new children via Admissions to populate this list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {parents.map((parent, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-8">
                
                {/* Parent Details */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 font-black text-xl">
                      {parent.fullName?.charAt(0) || <User />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{parent.fullName || "Unknown Parent"}</h2>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 inline-block">
                        {parent.relationship || "Guardian"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={16} className="text-cyan-500" />
                      <span className="text-sm font-semibold">{parent.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone size={16} className="text-cyan-500" />
                      <span className="text-sm font-semibold">{parent.contact || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <ShieldCheck size={16} className="text-cyan-500" />
                      <span className="text-sm font-semibold">ID: {parent.idNumber || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Linked Children */}
                <div className="md:w-1/3 bg-slate-50 rounded-3xl p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Linked Children ({parent.children.length})</h3>
                  <div className="space-y-4">
                    {parent.children.map((child: any) => (
                      <div key={child.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm">
                        <img src={child.image} alt="child" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{child.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{child.age} Years • {child.gender}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentManagement;

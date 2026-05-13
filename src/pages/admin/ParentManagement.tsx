import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, User, Users, ShieldCheck, ChevronRight, ArrowLeft, Search, Square, CheckSquare, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { apiClient } from '../../services/axiosInstance';

const ParentManagement = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [viewingParent, setViewingParent] = useState<any | null>(null);

  const loadParents = async () => {
    try {
      // Fetch parent records
      const [parentsRes, childrenRes] = await Promise.all([
        apiClient.get('/api/v1/auth/admin/all-parents'),
        apiClient.get('/api/v1/auth/admin/all-children')
      ]);

      const liveParents = parentsRes.data.data;
      const liveChildren = childrenRes.data.data;

      const parentsMap = new Map();

      liveParents.forEach((p: any) => {
        // Ensure we handle cases where account might be missing (though it shouldn't be)
        const email = p.account?.email || "Unknown";
        const status = p.account?.status?.toLowerCase() === 'active' ? 'active' : 'inactive';
        
        parentsMap.set(email, {
          // Map data to state
          parentId: p.parentId,
          email: email,
          fullName: p.fullName || "Unknown",
          contact: p.phone || "N/A",
          idNumber: p.nic || "N/A",
          relationship: p.relationship || "Guardian",
          status: status,
          children: []
        });
      });

      liveChildren.forEach((c: any) => {
        // Link children to parents
        if (parentsMap.has(c.guardianEmail)) {
          parentsMap.get(c.guardianEmail).children.push({
            id: c.childId,
            name: c.firstName + " " + c.lastName,
            age: c.dob ? Math.floor((new Date().getTime() - new Date(c.dob).getTime()) / 31557600000) : 0,
            gender: c.gender,
            image: c.profilePic || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80'
          });
        }
      });

      const sortedParents = Array.from(parentsMap.values()).sort((a: any, b: any) => 
        a.fullName.localeCompare(b.fullName)
      );
      setParents(sortedParents);
    } catch (err) {
      console.error("Failed to load parents and children:", err);
    }
  };

  useEffect(() => {
    loadParents();
    window.addEventListener('storage', loadParents);
    return () => window.removeEventListener('storage', loadParents);
  }, []);

  const filteredParents = parents.filter(p =>
    `${p.fullName} ${p.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (email: string) => {
    if (window.confirm("Are you sure you want to remove this parent and their linked records?")) {
      try {
        // Find the parent's ID from backend data
        const parent = parents.find(p => p.email === email);
        if (parent?.parentId) {
          await apiClient.delete(`/api/v1/auth/admin/parent/${parent.parentId}`);
        }
        setParents(parents.filter(p => p.email !== email));
        setSelectedParents(selectedParents.filter(e => e !== email));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete parent. Please try again.");
      }
    }
  };

  const toggleSelect = (email: string) => {
    setSelectedParents(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  };

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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parent Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[120px]">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Parents</span>
              <span className="text-xl font-black text-slate-900 leading-none">{parents.length}</span>
            </div>
            {selectedParents.length > 0 && (
              <button 
                onClick={() => {
                  if(window.confirm(`Delete ${selectedParents.length} selected parents?`)) {
                    setParents(parents.filter(p => !selectedParents.includes(p.email)));
                    setSelectedParents([]);
                  }
                }}
                className="bg-rose-50 text-rose-600 border border-rose-100 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                Delete Selected ({selectedParents.length})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">

        {/* --- SEARCH BAR --- */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/5 focus:bg-white transition-all text-slate-600 font-medium placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 w-20 text-center">
                   <button onClick={() => {
                      if(selectedParents.length === filteredParents.length) setSelectedParents([]);
                      else setSelectedParents(filteredParents.map(p => p.email));
                   }} className="text-slate-400 hover:text-primary-500 transition-colors">
                      {selectedParents.length === filteredParents.length && filteredParents.length > 0 ? <CheckSquare size={20} className="text-primary-500 mx-auto" /> : <Square size={20} className="mx-auto" />}
                   </button>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Children</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredParents.map((parent, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setViewingParent(parent)}
                  className={`hover:bg-slate-50/50 transition-all group cursor-pointer ${selectedParents.includes(parent.email) ? 'bg-primary-50/20' : ''}`}
                >
                  <td className="px-8 py-6 text-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(parent.email)} className="text-slate-300 hover:text-primary-500 transition-colors">
                      {selectedParents.includes(parent.email) ? <CheckSquare size={20} className="text-primary-500 mx-auto" /> : <Square size={20} className="mx-auto" />}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center font-black text-lg border border-cyan-100 shadow-sm">
                        {parent.fullName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 tracking-tight">{parent.fullName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{parent.relationship || 'Guardian'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} className="text-primary-400" />
                        <span className="text-xs font-semibold">{parent.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={14} />
                        <span className="text-[10px] font-bold">{parent.contact || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      parent.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {parent.status === 'active' ? 'Account Active' : 'No Account'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-2">
                      {parent.children.map((c: any) => (
                        <div key={c.id} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm" title={c.name}>
                          <img src={c.image} alt="child" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewingParent(parent)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(parent.email)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Parent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- PARENT DETAILS MODAL --- */}
      {viewingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingParent(null)}>
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            
            <div className="relative h-40 bg-gradient-to-br from-cyan-500 to-blue-600">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <div className="absolute -bottom-12 left-10">
                  <div className="h-24 w-24 bg-white p-2 rounded-[2rem] shadow-xl">
                    <div className="h-full w-full bg-cyan-50 rounded-[1.5rem] flex items-center justify-center text-cyan-600 font-black text-3xl">
                      {viewingParent.fullName?.charAt(0) || 'P'}
                    </div>
                  </div>
               </div>
               <button 
                 onClick={() => setViewingParent(null)}
                 className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all"
               >
                 <ArrowLeft className="rotate-180" size={20} />
               </button>
            </div>

            <div className="pt-16 p-10 space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{viewingParent.fullName}</h2>
                  <p className="text-cyan-500 font-black uppercase text-[10px] tracking-[0.3em] mt-1">{viewingParent.relationship || 'Primary Guardian'}</p>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Linked Records</p>
                   <p className="text-sm font-black text-slate-700 text-center">{viewingParent.children.length} Children</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-y border-slate-50 py-8">
                <DetailItem icon={<Mail size={16} className="text-cyan-500"/>} label="Email Address" value={viewingParent.email} />
                <DetailItem icon={<Phone size={16} className="text-cyan-500"/>} label="Contact Number" value={viewingParent.contact} />
                <DetailItem icon={<ShieldCheck size={16} className="text-cyan-500"/>} label="ID Number" value={viewingParent.idNumber} />
                <DetailItem icon={<MapPin size={16} className="text-cyan-500"/>} label="Relationship" value={viewingParent.relationship} />
              </div>

              <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Enrolled Children</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewingParent.children.map((child: any) => (
                      <div key={child.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                         <img src={child.image} alt={child.name} className="h-14 w-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                         <div>
                            <p className="font-bold text-slate-900 text-sm tracking-tight">{child.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{child.age} Years • {child.gender}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setViewingParent(null)}
                  className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cyan-500/10"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-sm font-bold text-slate-700 ml-6">{value || 'Not Provided'}</p>
  </div>
);

export default ParentManagement;

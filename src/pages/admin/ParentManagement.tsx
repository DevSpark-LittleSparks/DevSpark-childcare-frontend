import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, ChevronRight, Search, Square, CheckSquare, Trash2, Eye, ChevronLeft, MoreHorizontal, X, Users, User } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { apiClient } from '../../services/axiosInstance';

const formatPhoneNumber = (phone: string | undefined) => {
  if (!phone || phone === 'N/A') return 'N/A';
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '+94' + cleaned.substring(1);
  } else if (!cleaned.startsWith('+') && cleaned.startsWith('94')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+') && cleaned.length === 9) {
    cleaned = '+94' + cleaned;
  }

  if (cleaned.length === 12 && cleaned.startsWith('+94')) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
  }
  return cleaned;
};

const ParentManagement = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingParent, setViewingParent] = useState<any | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadParents = async () => {
    try {
      // Fetch parent records
      const [parentsRes, childrenRes] = await Promise.all([
        apiClient.get('/api/v1/auth/admin/all-parents?size=1000'),
        apiClient.get('/api/v1/auth/admin/all-children?size=1000')
      ]);

      const liveParents = parentsRes.data.data.content || [];
      const liveChildren = childrenRes.data.data.content || [];

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
          contact: formatPhoneNumber(p.phone || "N/A"),
          idNumber: p.nic || "N/A",
          relationship: p.relationship || "Guardian",
          status: status,
          profilePic: p.profilePic || null,
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

      const validParents = Array.from(parentsMap.values()).filter((p: any) => p.children.length > 0);
      const sortedParents = validParents.sort((a: any, b: any) => 
        a.fullName.localeCompare(b.fullName)
      );
      setParents(sortedParents);
      setTotalElements(sortedParents.length);
    } catch (err) {
      console.error("Failed to load parents and children:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const filteredParents = parents.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    return p.fullName.toLowerCase().includes(searchLower) || p.email.toLowerCase().includes(searchLower);
  });

  const totalPages = Math.max(1, Math.ceil(filteredParents.length / 10));
  const paginatedParents = filteredParents.slice(currentPage * 10, (currentPage + 1) * 10);

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
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-16">
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Parents</h1>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-black rounded-full border border-slate-200 dark:border-slate-700">
              {loading ? '...' : totalElements}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {selectedParents.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete ${selectedParents.length} selected parents?`)) {
                    setParents(parents.filter(p => !selectedParents.includes(p.email)));
                    setSelectedParents([]);
                  }
                }}
                className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all"
              >
                Delete ({selectedParents.length})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-4">

        {/* Toolbar: Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : (
        <>
        <div className="bg-white dark:bg-[#0f172a]/70 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60">
                <th className="px-8 py-5 w-20 text-center">
                   <button onClick={() => {
                      if(selectedParents.length === filteredParents.length) setSelectedParents([]);
                      else setSelectedParents(filteredParents.map(p => p.email));
                   }} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">
                      {selectedParents.length === filteredParents.length && filteredParents.length > 0 ? <CheckSquare size={20} className="text-primary-500 mx-auto" /> : <Square size={20} className="mx-auto" />}
                   </button>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Parent Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Linked Children</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80 dark:divide-slate-800/60">
              {paginatedParents.map((parent) => (
                <tr 
                  key={parent.parentId || parent.email} 
                  onClick={() => setViewingParent(parent)}
                  className={`dark:bg-slate-800/40 transition-all group cursor-pointer ${selectedParents.includes(parent.email) ? 'bg-primary-50/20' : 'hover:bg-white dark:hover:bg-[#0f172a]/60'}`}
                >
                  <td className="px-8 py-6 text-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(parent.email)} className="text-slate-300 hover:text-primary-500 transition-colors">
                      {selectedParents.includes(parent.email) ? <CheckSquare size={20} className="text-primary-500 mx-auto" /> : <Square size={20} className="mx-auto" />}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {parent.profilePic ? (
                        <img src={parent.profilePic} alt={parent.fullName} className="h-12 w-12 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="h-12 w-12 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center font-black text-lg border border-cyan-100 dark:border-cyan-800 shadow-sm">
                          {parent.fullName?.charAt(0) || 'P'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight group-hover:text-primary-600 transition-colors">{parent.fullName}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">{parent.relationship || 'Guardian'}</p>
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
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
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
                        className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(parent.email)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500">
              Showing page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-2 aspect-square text-slate-500 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1 hidden sm:flex">
                {Array.from({ length: totalPages }).map((_, i) => {
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= currentPage - 1 && i <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          currentPage === i
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  
                  if (
                    (i === 1 && currentPage > 2) ||
                    (i === totalPages - 2 && currentPage < totalPages - 3)
                  ) {
                    return (
                      <div key={i} className="w-8 h-8 flex items-center justify-center text-slate-400">
                        <MoreHorizontal size={14} />
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>

              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="p-2 aspect-square text-slate-500 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
        </>
        )}
      </main>

      {/* --- PARENT DETAILS MODAL --- */}
      {viewingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn" onClick={() => setViewingParent(null)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp" onClick={e => e.stopPropagation()}>
            
            {/* Header Area */}
            <div className="relative p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div className="flex gap-6 items-center">
                 <div className="h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-[1.5rem] p-1 shadow-lg shadow-primary-500/30">
                    {viewingParent.profilePic ? (
                      <img src={viewingParent.profilePic} alt={viewingParent.fullName} className="h-full w-full rounded-[1.25rem] object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-primary-500 font-black text-4xl">
                         {viewingParent.fullName?.charAt(0) || 'P'}
                      </div>
                    )}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{viewingParent.fullName}</h2>
                    <p className="text-primary-600 dark:text-primary-400 font-black uppercase text-[10px] tracking-[0.2em] mt-1 flex items-center gap-1.5">
                       <User size={12} /> {viewingParent.relationship || 'Primary Guardian'}
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => setViewingParent(null)}
                className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto space-y-8 bg-white dark:bg-slate-900">
               
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/60">
                <DetailItem icon={<Mail size={16} className="text-primary-500"/>} label="Email Address" value={viewingParent.email} />
                <DetailItem icon={<Phone size={16} className="text-primary-500"/>} label="Contact Number" value={viewingParent.contact} />
                <DetailItem icon={<ShieldCheck size={16} className="text-primary-500"/>} label="ID Number (NIC)" value={viewingParent.idNumber} />
                <DetailItem icon={<MapPin size={16} className="text-primary-500"/>} label="Relationship" value={viewingParent.relationship} />
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Users size={14} /> Enrolled Children
                   </h3>
                   <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                     {viewingParent.children.length} {viewingParent.children.length === 1 ? 'Child' : 'Children'}
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewingParent.children.map((child: any) => (
                      <div 
                        key={child.id} 
                        onClick={() => navigate(`/admin/students/${child.id}`)}
                        className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all group cursor-pointer"
                      >
                         <img src={child.image} alt={child.name} className="h-12 w-12 rounded-[1rem] object-cover shadow-sm group-hover:scale-105 transition-transform" />
                         <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{child.name}</p>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{child.age} Years • {child.gender}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <Button 
                onClick={() => setViewingParent(null)}
                className="rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 px-8 py-2.5 flex items-center gap-2"
              >
                Close Profile
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-6">{value || 'Not Provided'}</p>
  </div>
);

export default ParentManagement;

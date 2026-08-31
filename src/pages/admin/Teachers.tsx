import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Trash2, Eye, Mail, Phone, X,
  MapPin, ShieldCheck, CheckSquare, Square, ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { apiClient } from '../../services/axiosInstance';

interface TeacherData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  phone?: string;
  address?: string;
  joinedAt?: string;
  profilePicture?: string;
}

const getRoleBadge = (role: string) => {
  const r = role?.toUpperCase();
  if (r === 'SENIOR') return 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300';
  if (r === 'JUNIOR') return 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300';
  return 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300 border border-transparent dark:border-slate-700 shadow-sm';
};

const getAvatarStyle = (role: string) => {
  const r = role?.toUpperCase();
  if (r === 'SENIOR') return 'bg-indigo-50 text-indigo-600 border-indigo-100';
  if (r === 'JUNIOR') return 'bg-orange-50 text-orange-600 border-orange-100';
  return 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800/60';
};

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

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [viewingTeacher, setViewingTeacher] = useState<TeacherData | null>(null);
  const [filter, setFilter] = useState<'all' | 'senior' | 'junior'>('all');
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadTeachers = async () => {
    try {
      // Fetch staff records
      const response = await apiClient.get('/api/v1/auth/admin/all-teachers?size=1000');
      const liveData = response.data.data.content || [];
      setTotalElements(response.data.data.totalElements || liveData.length);

      const mappedTeachers = liveData.map((t: any) => ({
        id: t.id || t.teacherId || t.email,
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email,
        role: t.role || 'Teacher',
        status: t.status?.toLowerCase() === 'active' ? 'active' : 'inactive',
        phone: formatPhoneNumber(t.phoneNumber || 'N/A'),
        address: t.address || 'N/A',
        joinedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        profilePicture: t.profilePicture || undefined,
      }));

      // Sort by first name
      const sortedTeachers = mappedTeachers.sort((a: any, b: any) =>
        a.firstName.localeCompare(b.firstName)
      );
      setTeachers(sortedTeachers);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
    window.addEventListener('storage', loadTeachers);
    return () => window.removeEventListener('storage', loadTeachers);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, filter]);

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const toggleStatus = (id: string) => {
    setTeachers(teachers.map(t =>
      t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t
    ));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        await apiClient.delete(`/api/v1/auth/admin/teacher/${id}`);
        setTeachers(teachers.filter(t => t.id !== id));
        setSelectedTeachers(selectedTeachers.filter(sid => sid !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete teacher. Please try again.");
      }
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedTeachers.includes(id)) {
      setSelectedTeachers(selectedTeachers.filter(sid => sid !== id));
    } else {
      setSelectedTeachers([...selectedTeachers, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(t => t.id));
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || t.role.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / 10));
  const paginatedTeachers = filteredTeachers.slice(currentPage * 10, (currentPage + 1) * 10);

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-16">

      {/* --- HEADER SECTION --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Staff</h1>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-black rounded-full border border-slate-200 dark:border-slate-700">
              {loading ? '...' : totalElements}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {selectedTeachers.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm(`Delete ${selectedTeachers.length} selected members?`)) {
                    setTeachers(teachers.filter(t => !selectedTeachers.includes(t.id)));
                    setSelectedTeachers([]);
                  }
                }}
                className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 text-xs px-4 py-2 rounded-xl"
              >
                Delete ({selectedTeachers.length})
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-4">

        {/* Toolbar: Search + Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Compact search bar */}
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${
                filter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('senior')}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${
                filter === 'senior'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              Senior
            </button>
            <button
              onClick={() => setFilter('junior')}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${
                filter === 'junior'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-orange-200 hover:bg-orange-50'
              }`}
            >
              Junior
            </button>
          </div>
        </div>

        {/* --- TEACHERS TABLE --- */}
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
                <th className="px-8 py-5 w-20">
                  <button onClick={toggleSelectAll} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">
                    {selectedTeachers.length === filteredTeachers.length ? <CheckSquare size={20} className="text-primary-500" /> : <Square size={20} />}
                  </button>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Teacher</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80 dark:divide-slate-800/60">
              {paginatedTeachers.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => setViewingTeacher(t)}
                  className={`dark:bg-slate-800/40 transition-all group cursor-pointer ${selectedTeachers.includes(t.id) ? 'bg-primary-50/20' : 'hover:bg-white dark:hover:bg-[#0f172a]/60'}`}
                >
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(t.id)} className="text-slate-300 hover:text-primary-500 transition-colors">
                      {selectedTeachers.includes(t.id) ? <CheckSquare size={20} className="text-primary-500" /> : <Square size={20} />}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {t.profilePicture ? (
                        <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 ring-2 ring-white shadow-md">
                          <img src={t.profilePicture} alt={t.firstName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg border shadow-sm ${getAvatarStyle(t.role)}`}>
                          {t.firstName[0]}{t.lastName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight group-hover:text-primary-600 transition-colors">{t.firstName} {t.lastName}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mt-1 ${getRoleBadge(t.role)}`}>
                          {t.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} className="text-primary-400" />
                        <span className="text-xs font-semibold">{t.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={14} />
                        <span className="text-[10px] font-bold">{t.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleStatus(t.id)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${t.status === 'active'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      {t.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingTeacher(t)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Delete Staff"
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

      {/* --- TEACHER DETAILS MODAL --- */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn" onClick={() => setViewingTeacher(null)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp" onClick={e => e.stopPropagation()}>
            
            {/* Header Area */}
            <div className="relative p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div className="flex gap-6 items-center">
                 <div className="h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-[1.5rem] p-1 shadow-lg shadow-primary-500/30">
                    {viewingTeacher.profilePicture ? (
                      <img src={viewingTeacher.profilePicture} alt={viewingTeacher.firstName} className="h-full w-full rounded-[1.25rem] object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-primary-500 font-black text-4xl">
                         {viewingTeacher.firstName[0]}
                      </div>
                    )}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{viewingTeacher.firstName} {viewingTeacher.lastName}</h2>
                    <p className="text-primary-600 dark:text-primary-400 font-black uppercase text-[10px] tracking-[0.2em] mt-1 flex items-center gap-1.5">
                       <ShieldCheck size={12} /> {viewingTeacher.role}
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => setViewingTeacher(null)}
                className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto space-y-8 bg-white dark:bg-slate-900">
               
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/60">
                <DetailItem icon={<Mail size={16} className="text-primary-500"/>} label="Work Email" value={viewingTeacher.email} />
                <DetailItem icon={<Phone size={16} className="text-primary-500"/>} label="Mobile Number" value={viewingTeacher.phone} />
                <DetailItem icon={<ShieldCheck size={16} className="text-primary-500"/>} label="Staff Status" value={viewingTeacher.status.toUpperCase()} />
                <DetailItem icon={<MapPin size={16} className="text-primary-500"/>} label="Resident Address" value={viewingTeacher.address} />
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={14} /> Joined On
                   </h3>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-sm font-bold text-slate-500">{viewingTeacher.joinedAt}</p>
                 </div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <Button 
                onClick={() => setViewingTeacher(null)}
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
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-6">{value || 'Not Provided'}</p>
  </div>
);

export default Teachers;

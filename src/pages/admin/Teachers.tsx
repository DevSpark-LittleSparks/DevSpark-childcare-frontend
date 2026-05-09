import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Trash2, Eye, User, Mail, Phone,
  MapPin, ShieldCheck, UserCheck, UserX, MoreVertical, CheckSquare, Square
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
}

const Teachers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [viewingTeacher, setViewingTeacher] = useState<TeacherData | null>(null);

  const loadTeachers = async () => {
    try {
      const response = await apiClient.get('/api/v1/auth/admin/all-teachers');
      const liveData = response.data.data;
      
      const mappedTeachers = liveData.map((t: any) => ({
        id: t.id || t.teacherId || t.email,
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email,
        role: t.role || 'Teacher',
        status: t.status?.toLowerCase() === 'active' ? 'active' : 'inactive',
        phone: t.phoneNumber || 'N/A',
        address: t.address || 'N/A',
        joinedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'
      }));
      
      const sortedTeachers = mappedTeachers.sort((a: any, b: any) => 
        a.firstName.localeCompare(b.firstName)
      );
      setTeachers(sortedTeachers);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    }
  };

  useEffect(() => {
    loadTeachers();
    window.addEventListener('storage', loadTeachers);
    return () => window.removeEventListener('storage', loadTeachers);
  }, []);

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

  const filteredTeachers = teachers.filter(t =>
    `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">

      {/* --- HEADER SECTION --- */}
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

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[120px]">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Staff</span>
              <span className="text-xl font-black text-slate-900 leading-none">{teachers.length}</span>
            </div>

            {selectedTeachers.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm(`Delete ${selectedTeachers.length} selected members?`)) {
                    setTeachers(teachers.filter(t => !selectedTeachers.includes(t.id)));
                    setSelectedTeachers([]);
                  }
                }}
                className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"
              >
                Delete Selected ({selectedTeachers.length})
              </Button>
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

        {/* --- TEACHERS TABLE --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 w-20">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-primary-500 transition-colors">
                    {selectedTeachers.length === filteredTeachers.length ? <CheckSquare size={20} className="text-primary-500" /> : <Square size={20} />}
                  </button>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className={`hover:bg-slate-50/50 transition-all group ${selectedTeachers.includes(t.id) ? 'bg-primary-50/20' : ''}`}>
                  <td className="px-8 py-6">
                    <button onClick={() => toggleSelect(t.id)} className="text-slate-300 hover:text-primary-500 transition-colors">
                      {selectedTeachers.includes(t.id) ? <CheckSquare size={20} className="text-primary-500" /> : <Square size={20} />}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-lg border border-indigo-100 shadow-sm">
                        {t.firstName[0]}{t.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 tracking-tight">{t.firstName} {t.lastName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{t.role}</p>
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
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => toggleStatus(t.id)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${t.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                    >
                      {t.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingTeacher(t)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
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
      </main>

      {/* --- TEACHER DETAILS MODAL --- */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingTeacher(null)}>
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>

            <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-primary-600">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="absolute -bottom-12 left-10">
                <div className="h-24 w-24 bg-white p-2 rounded-[2rem] shadow-xl">
                  <div className="h-full w-full bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 font-black text-3xl">
                    {viewingTeacher.firstName[0]}{viewingTeacher.lastName[0]}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingTeacher(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all"
              >
                <ArrowLeft className="rotate-180" size={20} />
              </button>
            </div>

            <div className="pt-16 p-10 space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{viewingTeacher.firstName} {viewingTeacher.lastName}</h2>
                <p className="text-primary-500 font-black uppercase text-[10px] tracking-[0.3em] mt-1">{viewingTeacher.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-y border-slate-50 py-8">
                <DetailItem icon={<Mail size={16} />} label="Work Email" value={viewingTeacher.email} />
                <DetailItem icon={<Phone size={16} />} label="Mobile Number" value={viewingTeacher.phone} />
                <DetailItem icon={<MapPin size={16} />} label="Resident Address" value={viewingTeacher.address} />
                <DetailItem icon={<ShieldCheck size={16} />} label="Staff Status" value={viewingTeacher.status.toUpperCase()} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Joined On</p>
                  <p className="text-sm font-bold text-slate-500">{viewingTeacher.joinedAt}</p>
                </div>
                <Button
                  onClick={() => setViewingTeacher(null)}
                  className="px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
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

export default Teachers;

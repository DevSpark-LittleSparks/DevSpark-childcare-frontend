import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical, ArrowLeft, Trash2, Eye, Search, Sparkles, Plus
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { apiClient } from '../../services/axiosInstance';

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female';
  class: string;
  parentName: string;
  status: string;
}

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [students, setStudents] = useState<StudentData[]>([]);
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all');

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch student records
        const response = await apiClient.get('/api/v1/auth/admin/all-children');
        const liveData = response.data.data;
        
        const mappedStudents = liveData.map((c: any) => ({
          id: c.childId,
          firstName: c.firstName,
          lastName: c.lastName,
          age: c.dob ? Math.floor((new Date().getTime() - new Date(c.dob).getTime()) / 31557600000) : 0,
          gender: c.gender ? (c.gender.charAt(0).toUpperCase() + c.gender.slice(1).toLowerCase()) : 'Unknown',
          class: c.status || 'ENROLLED',
          parentName: c.guardianName || 'Guardian', 
          status: c.status || 'ENROLLED'
        }));
        
        const sortedStudents = mappedStudents.sort((a: any, b: any) => 
          a.firstName.localeCompare(b.firstName)
        );
        
        setStudents(sortedStudents);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      try {
        await apiClient.delete(`/api/v1/auth/admin/child/${id}`);
        setStudents(students.filter(s => s.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const filtered = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || s.gender.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">

      {/* --- HEADER SECTION --- */}
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

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[120px]">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Total Sparks</span>
              <span className="text-xl font-black text-slate-900 leading-none">{students.length}</span>
            </div>

            <Button
              onClick={() => navigate('/admin/admissions')}
              variant="primary"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-500/10"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="text-sm">Add New Student</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">

        {/* --- SEARCH BAR --- */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <label className="block text-slate-500 font-bold text-sm mb-3 ml-2 italic">Search Directory</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Select student in list..."
              className="w-full pl-6 pr-12 py-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/5 focus:bg-white transition-all text-slate-600 font-medium placeholder:text-slate-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-[#F8FAFC] text-slate-400 hover:bg-slate-100'}`}
            >
              All Sparks
            </button>
            <button
              onClick={() => setFilter('male')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'male' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-sky-50 text-sky-400 hover:bg-sky-100'}`}
            >
              Male Sparks
            </button>
            <button
              onClick={() => setFilter('female')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'female' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-rose-50 text-rose-400 hover:bg-rose-100'}`}
            >
              Female Sparks
            </button>
          </div>
        </div>

        {/* Unified Table View */}
        <div className="space-y-8 animate-fadeUp">
          {filter !== 'female' && filtered.filter(s => s.gender === 'Male').length > 0 && (
            <CompactTable
              title="Male Sparks"
              data={filtered.filter(s => s.gender === 'Male')}
              primaryColor="sky"
              onDelete={handleDelete}
            />
          )}
          {filter !== 'male' && filtered.filter(s => s.gender === 'Female').length > 0 && (
            <CompactTable
              title="Female Sparks"
              data={filtered.filter(s => s.gender === 'Female')}
              primaryColor="rose"
              onDelete={handleDelete}
            />
          )}
          {filtered.length === 0 && (
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
              <Sparkles className="mx-auto text-slate-200 mb-4" size={40} />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching students found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const CompactTable = ({ title, data, primaryColor, onDelete }: any) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const styles = {
    rose: { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-500', border: 'border-sky-100' }
  }[primaryColor as 'rose' | 'sky'];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <h2 className="text-xl font-bold text-slate-800 italic font-inter tracking-tight">
          {title}
        </h2>
        <span className={`text-[10px] font-black px-3 py-1 ${styles.bg} ${styles.text} rounded-lg border ${styles.border}`}>
          {data.length} STUDENTS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Age</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((s: StudentData) => (
                <tr 
                  key={s.id} 
                  onClick={() => navigate(`/admin/students/${s.id}`)}
                  className="hover:bg-slate-50/50 transition-all group relative cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 ${styles.bg} ${styles.text} rounded-xl flex items-center justify-center font-black border ${styles.border} shadow-sm`}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 tracking-tight">{s.firstName} {s.lastName}</p>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                          Guardian: {s.parentName}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border shadow-sm ${styles.bg} ${styles.text} ${styles.border}`}>
                      {s.age} {s.age === 1 ? 'Year' : 'Years'}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <p className={`inline-block text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border shadow-sm ${
                      s.status === 'BIG_SCHOOL_READY' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      s.status === 'ALUMNI' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {s.status?.replace(/_/g, ' ') || 'ENROLLED'}
                    </p>
                  </td>

                  <td className="px-8 py-5 text-right relative" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
                        title="View & Edit Profile"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Student"
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
    </div>
  );
};

export default Students;
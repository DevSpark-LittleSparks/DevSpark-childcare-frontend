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

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
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

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        </div>

        {/* --- GENDER SPLIT TABLES --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <CompactTable
            title="Female Sparks"
            data={filtered.filter(s => s.gender === 'Female')}
            primaryColor="rose"
            onDelete={handleDelete}
          />
          <CompactTable
            title="Male Sparks"
            data={filtered.filter(s => s.gender === 'Male')}
            primaryColor="sky"
            onDelete={handleDelete}
          />
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
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 tracking-tight">{s.firstName} {s.lastName}</p>
                          {s.status === 'BIG_SCHOOL_READY' && (
                            <span className="animate-pulse flex h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border ${
                            s.status === 'BIG_SCHOOL_READY' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            s.status === 'ALUMNI' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {s.status?.replace(/_/g, ' ') || 'ENROLLED'}
                          </p>
                        </div>
                      </div>
                    </div>
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, ArrowLeft, Trash2, Eye, Search, Sparkles, Plus 
} from 'lucide-react';
import { Button } from '../../components/common/Button'; 

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female';
  class: string;
  parentName: string;
}

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [students, setStudents] = useState<StudentData[]>([
    { id: '001', firstName: 'Amaya', lastName: 'Perera', age: 4, gender: 'Female', class: 'Nursery A', parentName: 'Sunil Perera' },
    { id: '002', firstName: 'Ethan', lastName: 'Silva', age: 5, gender: 'Male', class: 'Kindergarten', parentName: 'Kasun Silva' },
    { id: '003', firstName: 'Dinuli', lastName: 'Fernando', age: 3, gender: 'Female', class: 'Toddler B', parentName: 'Ruwan Fernando' },
    { id: '004', firstName: 'Liam', lastName: 'Jayasinghe', age: 4, gender: 'Male', class: 'Nursery A', parentName: 'Arjuna Jayasinghe' },
  ]);

  const handleDelete = (id: string) => {
    if(window.confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const filtered = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 animate-fadeUp">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group"
          >
            <ArrowLeft className="text-slate-400 group-hover:text-primary-500" size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 text-primary-500">
              <Sparkles size={14} className="fill-primary-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">LittleSparks Management</p>
            </div>
            <h1 className="text-3xl font-black text-midnight tracking-tight italic font-sans">All Sparks List</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[120px]">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Total Sparks</span>
            <span className="text-xl font-black text-slate-900 leading-none">{students.length}</span>
          </div>

          <Button 
            onClick={() => navigate('/admin/admissions')}
            variant="primary" 
            className="flex items-center gap-2 px-6 py-4 rounded-2xl text-white font-bold transition-all active:scale-95 shadow-lg shadow-primary-500/10"
          >
            <Plus size={18} strokeWidth={3} />
            <span className="text-sm">Add New Student</span>
          </Button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
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
              <tr key={s.id} className="hover:bg-slate-50/50 transition-all group relative">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 ${styles.bg} ${styles.text} rounded-xl flex items-center justify-center font-black border ${styles.border} shadow-sm`}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 tracking-tight">{s.firstName} {s.lastName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.class}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-8 py-5 text-right relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === s.id ? null : s.id)}
                    className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* ACTION MENU: Simplified to View and Delete only */}
                  {activeMenu === s.id && (
                    <div className="absolute right-16 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 flex gap-1 animate-in zoom-in duration-150">
                      
                      {/* VIEW & EDIT ACTION: Navigates to the detailed profile page */}
                      <button 
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="p-3 hover:bg-primary-50 text-primary-500 rounded-xl transition-all flex items-center gap-2"
                        title="View & Edit Profile"
                      >
                        <Eye size={18}/>
                        <span className="text-xs font-bold pr-1">View Profile</span>
                      </button>
                      
                      {/* DELETE ACTION */}
                      <button 
                        onClick={() => onDelete(s.id)} 
                        className="p-3 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"
                        title="Delete Student"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  )}
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Search, Plus, Users } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { apiClient } from '../../services/axiosInstance';

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | string;
  parentName: string;
  status: string;
  profileImageUrl?: string;
}

// ─── Status Config ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  ENROLLED: {
    label: 'Enrolled',
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-600 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  BIG_SCHOOL_READY: {
    label: 'Big School Ready',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  ALUMNI: {
    label: 'Alumni',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? {
    label: status?.replace(/_/g, ' ') || 'Unknown',
    bg: 'bg-slate-50 dark:bg-slate-800/400/10',
    text: 'text-slate-500 dark:text-slate-300',
    dot: 'bg-slate-400',
  };

// ─── Avatar Component ────────────────────────────────────────────────────────
const StudentAvatar = ({
  firstName,
  lastName,
  imageUrl,
  gender,
}: {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  gender: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const isFemale = gender?.toLowerCase() === 'female';
  const gradientClass = isFemale ? 'from-rose-400 to-pink-500' : 'from-sky-400 to-cyan-500';

  if (imageUrl && !imgError) {
    return (
      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 ring-2 ring-white shadow-md">
        <img
          src={imageUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`w-12 h-12 rounded-2xl shrink-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center font-black text-white text-sm shadow-md`}
    >
      {firstName?.[0]}{lastName?.[0]}
    </div>
  );
};

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get('/api/v1/auth/admin/all-children');
        const liveData = response.data.data;
        const mappedStudents: StudentData[] = liveData.map((c: any) => ({
          id: c.childId,
          firstName: c.firstName,
          lastName: c.lastName,
          age: c.dob
            ? Math.floor((new Date().getTime() - new Date(c.dob).getTime()) / 31557600000)
            : 0,
          gender: c.gender
            ? c.gender.charAt(0).toUpperCase() + c.gender.slice(1).toLowerCase()
            : 'Unknown',
          parentName: c.guardianName || 'Guardian',
          status: c.status || 'ENROLLED',
          profileImageUrl: c.profilePic || c.profileImageUrl || c.imageUrl || undefined,
        }));
        setStudents(mappedStudents.sort((a, b) => a.firstName.localeCompare(b.firstName)));
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await apiClient.delete(`/api/v1/auth/admin/child/${id}`);
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } catch {
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const filtered = students.filter((s) => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || s.gender.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const maleStudents = filtered.filter((s) => s.gender === 'Male');
  const femaleStudents = filtered.filter((s) => s.gender === 'Female');

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-16">

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Students</h1>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-black rounded-full border border-slate-200 dark:border-slate-700">
              {loading ? '...' : students.length}
            </span>
          </div>
          <Button
            onClick={() => navigate('/admin/admissions')}
            variant="primary"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold shadow-md shadow-primary-500/20 text-sm"
          >
            <Plus size={15} strokeWidth={3} />
            Add Student
          </Button>
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all shadow-sm"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5">
            {(['all', 'male', 'female'] as const).map((f) => {
              const active = filter === f;
              const colors = {
                all: active ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50',
                male: active ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-sky-200 hover:bg-sky-50',
                female: active ? 'bg-rose-500 text-white shadow-sm' : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-rose-200 hover:bg-rose-50',
              }[f];
              const labels = { all: 'All', male: 'Male', female: 'Female' };
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${colors}`}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>

          {/* Status legend */}
          <div className="ml-auto flex items-center gap-4">
            {Object.values(STATUS_CONFIG).map((cfg) => (
              <span key={cfg.label} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-5">
            {filter !== 'female' && maleStudents.length > 0 && (
              <StudentTable title="Male Sparks" accentColor="sky" data={maleStudents} onDelete={handleDelete} />
            )}
            {filter !== 'male' && femaleStudents.length > 0 && (
              <StudentTable title="Female Sparks" accentColor="rose" data={femaleStudents} onDelete={handleDelete} />
            )}
            {filtered.length === 0 && (
              <div className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-slate-300" size={28} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">No students found</p>
                <p className="text-slate-300 text-xs mt-1">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Student Table ────────────────────────────────────────────────────────────
const StudentTable = ({
  title,
  accentColor,
  data,
  onDelete,
}: {
  title: string;
  accentColor: 'sky' | 'rose';
  data: StudentData[];
  onDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const accent = {
    sky: {
      icon: 'text-sky-500',
      count: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300',
      symbol: '♂',
      symbolBg: 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300',
    },
    rose: {
      icon: 'text-rose-500',
      count: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300',
      symbol: '♀',
      symbolBg: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300',
    },
  }[accentColor];

  return (
    <div className="bg-white dark:bg-[#0f172a]/70 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-sm">

      {/* Section header */}
      <div className="px-7 py-4 border-b border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 flex items-center justify-between bg-white dark:bg-[#0f172a]/40">
        <div className="flex items-center gap-2.5">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black ${accent.symbolBg}`}>
            {accent.symbol}
          </span>
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">{title}</h2>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${accent.count}`}>
          {data.length} Students
        </span>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 px-7 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Student</span>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Age</span>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</span>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-50/80 dark:divide-slate-800/60">
        {data.map((s) => (
          <div
            key={s.id}
            onClick={() => navigate(`/admin/students/${s.id}`)}
            className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 px-7 py-4 hover:bg-white dark:bg-[#0f172a]/60 transition-all cursor-pointer items-center group"
          >
            {/* Student info */}
            <div className="flex items-center gap-4">
              <StudentAvatar
                firstName={s.firstName}
                lastName={s.lastName}
                imageUrl={s.profileImageUrl}
                gender={s.gender}
              />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-primary-600 transition-colors leading-tight">
                  {s.firstName} {s.lastName}
                </p>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] block mt-0.5">
                  Parent: {s.parentName}
                </span>
              </div>
            </div>

            {/* Age */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 border border-transparent dark:border-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                {s.age} {s.age === 1 ? 'yr' : 'yrs'}
              </span>
            </div>

            {/* Status */}
            <div>
              <StatusBadge status={s.status} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => navigate(`/admin/students/${s.id}`)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
                title="View Profile"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                title="Delete Student"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;

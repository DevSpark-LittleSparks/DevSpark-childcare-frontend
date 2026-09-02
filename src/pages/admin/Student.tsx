import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Search, Plus, Users, ChevronLeft, ChevronRight, MoreHorizontal, Square, CheckSquare } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { TableControls } from '../../components/common/TableControls';
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
    label: 'Preschool',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  BIG_SCHOOL_READY: {
    label: 'School Age',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-300',
    dot: 'bg-amber-500',
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
  const [ageGroup, setAgeGroup] = useState<'all' | 'preschool' | 'school-age'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  React.useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/api/v1/auth/admin/all-children?size=1000');
        const liveData = response.data.data.content || [];
        setTotalElements(response.data.data.totalElements || liveData.length);
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

  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, filter, ageGroup]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setCurrentPage((p) => p + 1);

  const toggleSelect = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

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

  const [orderBy, setOrderBy] = useState("firstNameAsc");
  const [pageSize, setPageSize] = useState(10);

  const orderOptions = [
    { label: "First Name A - Z", value: "firstNameAsc" },
    { label: "First Name Z - A", value: "firstNameDesc" },
    { label: "Age Ascending", value: "ageAsc" },
    { label: "Age Descending", value: "ageDesc" },
  ];

  const filtered = students.filter((s) => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesAge = true;
    if (ageGroup === 'preschool') matchesAge = s.status !== 'BIG_SCHOOL_READY';
    if (ageGroup === 'school-age') matchesAge = s.status === 'BIG_SCHOOL_READY';
    
    return matchesSearch && matchesAge;
  }).sort((a, b) => {
    if (orderBy === "firstNameAsc") return a.firstName.localeCompare(b.firstName);
    if (orderBy === "firstNameDesc") return b.firstName.localeCompare(a.firstName);
    if (orderBy === "ageAsc") return a.age - b.age;
    if (orderBy === "ageDesc") return b.age - a.age;
    return 0;
  });

  const allMales = filtered.filter(s => s.gender === 'Male');
  const allFemales = filtered.filter(s => s.gender === 'Female');

  let maleStudents: StudentData[] = [];
  let femaleStudents: StudentData[] = [];
  let totalPages = 1;

  if (filter === 'all') {
    const halfSize = Math.max(1, Math.floor(pageSize / 2));
    const malePages = Math.ceil(allMales.length / halfSize);
    const femalePages = Math.ceil(allFemales.length / halfSize);
    totalPages = Math.max(1, malePages, femalePages);
    
    maleStudents = allMales.slice(currentPage * halfSize, (currentPage + 1) * halfSize);
    femaleStudents = allFemales.slice(currentPage * halfSize, (currentPage + 1) * halfSize);
  } else if (filter === 'male') {
    totalPages = Math.max(1, Math.ceil(allMales.length / pageSize));
    maleStudents = allMales.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  } else if (filter === 'female') {
    totalPages = Math.max(1, Math.ceil(allFemales.length / pageSize));
    femaleStudents = allFemales.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-16">

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Students</h1>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-black rounded-full border border-slate-200 dark:border-slate-700">
              {loading ? '...' : totalElements}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {selectedStudents.length > 0 && (
              <Button
                variant="outline"
                onClick={async () => {
                  if (window.confirm(`Delete ${selectedStudents.length} selected students?`)) {
                    try {
                      await Promise.all(selectedStudents.map(id => apiClient.delete(`/api/v1/auth/admin/child/${id}`)));
                      setStudents(students.filter(s => !selectedStudents.includes(s.id)));
                      setSelectedStudents([]);
                    } catch {
                      alert('Failed to delete some students. Please try again.');
                    }
                  }
                }}
                className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 text-xs px-4 py-2 rounded-xl"
              >
                Delete ({selectedStudents.length})
              </Button>
            )}
            <Button
              onClick={() => navigate('/admin/admissions')}
              variant="primary"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold shadow-md shadow-primary-500/20 text-sm"
            >
              <Plus size={15} strokeWidth={3} />
              Add Student
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-4">

        {/* Age Group Main Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          {(['all', 'preschool', 'school-age'] as const).map((ag) => {
            const active = ageGroup === ag;
            const labels = { all: 'All Ages', preschool: 'Preschool (3-5)', 'school-age': 'School Age (6+)' };
            return (
              <button
                key={ag}
                onClick={() => setAgeGroup(ag)}
                className={`pb-3 text-sm font-bold transition-all relative ${active ? 'text-primary-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {labels[ag]}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Toolbar: Controls */}
        <TableControls 
          orderOptions={orderOptions}
          selectedOrder={orderBy}
          onOrderChange={setOrderBy}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(0); }}
          currentPage={currentPage}
          totalElements={filter === 'all' ? filtered.length : (filter === 'male' ? allMales.length : allFemales.length)}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          totalPages={totalPages}
        />

        {/* Toolbar: Search + Secondary Filters */}
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

          {/* Gender Filter chips */}
          <div className="flex items-center gap-2 ml-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Gender:</span>
            <div className="flex items-center gap-1.5">
              {(['all', 'male', 'female'] as const).map((f) => {
                const active = filter === f;
                const colors = {
                  all: active ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50',
                  male: active ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-sky-200 hover:bg-sky-50',
                  female: active ? 'bg-pink-500 text-white shadow-sm' : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:border-pink-200 hover:bg-pink-50',
                }[f];
                const labels = { all: 'All', male: 'Male', female: 'Female' };
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${colors}`}
                  >
                    {labels[f]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status legend */}
          <div className="ml-auto flex items-center gap-4">
            {Object.values(STATUS_CONFIG).map((cfg) => (
              <span key={cfg.label} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              10+ Yrs (Action Required)
            </span>
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
              <StudentTable title="Male Sparks" accentColor="sky" data={maleStudents} onDelete={handleDelete} selected={selectedStudents} onToggleSelect={toggleSelect} onToggleSelectAll={() => {
                const allSelected = maleStudents.every(s => selectedStudents.includes(s.id));
                if (allSelected) {
                  setSelectedStudents(selectedStudents.filter(id => !maleStudents.some(s => s.id === id)));
                } else {
                  const newIds = maleStudents.map(s => s.id).filter(id => !selectedStudents.includes(id));
                  setSelectedStudents([...selectedStudents, ...newIds]);
                }
              }} />
            )}
            {filter !== 'male' && femaleStudents.length > 0 && (
              <StudentTable title="Female Sparks" accentColor="pink" data={femaleStudents} onDelete={handleDelete} selected={selectedStudents} onToggleSelect={toggleSelect} onToggleSelectAll={() => {
                const allSelected = femaleStudents.every(s => selectedStudents.includes(s.id));
                if (allSelected) {
                  setSelectedStudents(selectedStudents.filter(id => !femaleStudents.some(s => s.id === id)));
                } else {
                  const newIds = femaleStudents.map(s => s.id).filter(id => !selectedStudents.includes(id));
                  setSelectedStudents([...selectedStudents, ...newIds]);
                }
              }} />
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
  selected,
  onToggleSelect,
  onToggleSelectAll,
}: {
  title: string;
  accentColor: 'sky' | 'pink';
  data: StudentData[];
  onDelete: (id: string) => void;
  selected: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}) => {
  const navigate = useNavigate();
  const accent = {
    sky: {
      icon: 'text-sky-500',
      count: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300',
      symbol: '♂',
      symbolBg: 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300',
    },
    pink: {
      icon: 'text-pink-500',
      count: 'bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300',
      symbol: '♀',
      symbolBg: 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300',
    },
  }[accentColor];

  return (
    <div className="bg-white dark:bg-[#0f172a]/70 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">

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
      <div className="grid grid-cols-[auto_2fr_1fr_1.5fr_auto] gap-4 px-7 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 items-center">
        <button onClick={onToggleSelectAll} className="w-5 text-slate-400 hover:text-primary-500 transition-colors">
          {data.length > 0 && data.every(s => selected.includes(s.id)) ? <CheckSquare size={16} className="text-primary-500" /> : <Square size={16} />}
        </button>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Student</span>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Age</span>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</span>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-50/80 dark:divide-slate-800/60">
        {data.map((s) => {
          const isActionRequired = s.age >= 10;
          
          let displayStatus = s.status;
          if (displayStatus === 'ALUMNI') {
            displayStatus = s.age >= 6 ? 'BIG_SCHOOL_READY' : 'ENROLLED';
          }
          if (isActionRequired) {
            displayStatus = 'BIG_SCHOOL_READY';
          }

          return (
          <div
            key={s.id}
            onClick={() => navigate(`/admin/students/${s.id}`)}
            className={`grid grid-cols-[auto_2fr_1fr_1.5fr_auto] gap-4 px-7 py-4 transition-all cursor-pointer items-center group border-l-4 ${
              isActionRequired 
                ? 'bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-500/5 dark:hover:bg-rose-500/10 border-rose-500' 
                : 'hover:bg-white dark:bg-[#0f172a]/60 border-transparent'
            } ${selected.includes(s.id) ? 'bg-primary-50/20' : ''}`}
          >
            {/* Checkbox */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(s.id);
              }} 
              className="text-slate-300 hover:text-primary-500 transition-colors w-5"
            >
              {selected.includes(s.id) ? <CheckSquare size={20} className="text-primary-500" /> : <Square size={20} />}
            </button>

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
              <StatusBadge status={displayStatus} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => navigate(`/admin/students/${s.id}`)}
                className={`p-2.5 rounded-xl transition-all ${isActionRequired ? 'text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20' : 'text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10'}`}
                title="View Profile"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className={`p-2.5 rounded-xl transition-all ${isActionRequired ? 'text-rose-600 hover:bg-rose-200 dark:hover:bg-rose-500/30' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'}`}
                title="Delete Student"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          );
        })}
      </div>
      </div>
      </div>
    </div>
  );
};

export default Students;

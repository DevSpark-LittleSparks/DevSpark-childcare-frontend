import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, User, MapPin, ArrowLeft, Loader2,
  CheckCircle, Scale, Ruler, Droplets,
  ClipboardList, Users, Mail, Phone, Hash
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { PhoneInput } from '../../components/common/PhoneInput';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { apiClient } from '../../services/axiosInstance';

const AdmissionsPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalStudents, setTotalStudents] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await apiClient.get('/api/v1/auth/admin/stats');
        setTotalStudents(statsRes.data.data.totalStudents || 0);
        
        const profileRes = await apiClient.get('/api/v1/auth/admin/profile');
        setCapacity(parseInt(profileRes.data.data.capacity) || 0);
      } catch (err) {
        console.error("Failed to fetch capacity stats:", err);
      }
    };
    fetchStats();
  }, []);

  const capacityPercentage = capacity > 0 ? Math.min(Math.round((totalStudents / capacity) * 100), 100) : 0;

  const [formData, setFormData] = useState({
    fullName: '',
    nameWithInitials: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    address: '',
    specialNote: '',
    relationship: '',
    parentFullName: '',
    parentEmail: '',
    parentContact: '',
    parentID: ''
  });

  // Calculate child age
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? `${calculatedAge} Years` : "");
    }
  }, [formData.dob]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "parentContact") {
      finalValue = "+94" + value.replace(/^\+94\s?/, '');
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      'fullName', 'nameWithInitials', 'dob', 'gender', 'bloodGroup',
      'height', 'weight', 'address', 'relationship', 'parentFullName',
      'parentEmail', 'parentContact', 'parentID'
    ];

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (typeof value === 'string' ? value.trim() === "" : !value) {
        newErrors[field] = "This field is required";
      }
    });

    if (!previewImage) {
      newErrors['photo'] = "Child's Profile Picture is mandatory.";
    }

    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      const ageInYears = Math.floor((today.getTime() - dob.getTime()) / 31557600000);

      if (dob > today) {
        newErrors['dob'] = "Date of birth cannot be in the future.";
      } else if (ageInYears < 3) {
        newErrors['dob'] = "Child must be at least 3 years old.";
      } else if (ageInYears > 10) {
        newErrors['dob'] = "Child must be 10 years old or younger.";
      }
    }

    const slPhoneRegex = /^\+94\d{9}$/;
    if (formData.parentContact && !slPhoneRegex.test(formData.parentContact)) {
      newErrors['parentContact'] = "Invalid Mobile Number (e.g., +94701234567)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.parentEmail && !emailRegex.test(formData.parentEmail)) {
      newErrors['parentEmail'] = "Invalid Email Address";
    }

    const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
    if (formData.parentID && !nicRegex.test(formData.parentID)) {
      newErrors['parentID'] = "Invalid NIC format (e.g., 981234567V or 199812345678)";
    }

    if (formData.height) {
      const h = Number(formData.height);
      if (isNaN(h) || h < 30 || h > 200) {
        newErrors['height'] = "Height must be between 30cm and 200cm";
      }
    }

    if (formData.weight) {
      const w = Number(formData.weight);
      if (isNaN(w) || w < 2 || w > 100) {
        newErrors['weight'] = "Weight must be between 2kg and 100kg";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/child/register', {
        fullName: formData.fullName,
        nameWithInitials: formData.nameWithInitials,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        address: formData.address,
        specialNote: formData.specialNote,
        relationship: formData.relationship,
        parentFullName: formData.parentFullName,
        parentEmail: formData.parentEmail,
        parentContact: formData.parentContact,
        parentID: formData.parentID,
        profilePic: previewImage,
      });

      alert("Registration Successful! The parent can now sign up using the registered email.");
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error("Registration failed:", err);
      alert(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-10">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-3 bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50 transition-all group"
            >
              <ArrowLeft className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-primary-500" size={20} />
            </button>

          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="bg-white dark:bg-[#0f172a] px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col items-center min-w-[120px] relative overflow-hidden group">
              {/* Animated Water Background */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bg-primary-500/30 dark:bg-primary-500/40 rounded-[40%] animate-wave transition-all duration-1000 ease-in-out"
                style={{ 
                  width: '320px', 
                  height: '320px', 
                  top: `${100 - capacityPercentage}%`,
                  zIndex: 0
                }}
              />
              <div 
                className="absolute left-1/2 -translate-x-1/2 bg-primary-500/20 dark:bg-primary-500/30 rounded-[43%] animate-wave transition-all duration-1000 ease-in-out"
                style={{ 
                  width: '300px', 
                  height: '300px', 
                  top: `${100 - capacityPercentage + 2}%`,
                  animationDuration: '10s',
                  animationDirection: 'reverse',
                  zIndex: 0
                }}
              />
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter relative z-10">Capacity</span>
              <span className="text-sm font-black text-midnight dark:text-white leading-none mt-1 relative z-10 group-hover:scale-110 transition-transform">{capacityPercentage}% Full</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-[0_20px_60px_rgba(10,6,55,0.03)] border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 p-8 md:p-12">

              <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-black text-midnight dark:text-white uppercase tracking-tight">Student Information</h2>
              </div>

              {/* Photo & Identity */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 w-32 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden cursor-pointer flex items-center justify-center relative group"
                  >
                    {previewImage ? <img src={previewImage} className="h-full w-full object-cover" alt="child" /> : <Camera size={24} className="text-slate-300" />}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  <p className="mt-3 text-[9px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Child Photo</p>
                  <ErrorMessage message={errors.photo} />
                </div>

                <div className="md:col-span-3 space-y-7">
                  <LittleInput label="Full Legal Name" name="fullName" placeholder="As per birth certificate" onChange={handleInputChange} error={errors.fullName} />
                  <LittleInput label="Name with Initials" name="nameWithInitials" placeholder="A.B.C. Perera" onChange={handleInputChange} error={errors.nameWithInitials} />
                </div>
              </div>

              {/* Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Birthday</label>
                  <input
                    type="date"
                    name="dob"
                    onChange={handleInputChange}
                    // 3 to 10 years limit
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]}
                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
                    className={`w-full p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.dob ? 'border-red-500' : 'border-transparent focus:border-primary-500'} focus:bg-white dark:bg-[#0f172a] rounded-2xl outline-none text-sm font-bold shadow-sm transition-all`}
                  />
                  <ErrorMessage message={errors.dob} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                    Age
                  </label>
                  <div className="w-full p-4 bg-slate-100 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold text-midnight dark:text-white shadow-sm">
                    {age || "AGE"}
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select
                    name="gender"
                    onChange={handleInputChange}
                    className={`w-full p-4 bg-slate-100 dark:bg-slate-800/40 rounded-2xl outline-none text-sm font-bold appearance-none border-2 ${errors.gender ? 'border-red-500' : 'border-transparent focus:border-primary-500'} shadow-sm transition-all`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <ErrorMessage message={errors.gender} />
                </div>
              </div>

              {/* Medical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Droplets size={10} /> Blood Group</label>
                  <select name="bloodGroup" onChange={handleInputChange} className={`w-full p-4 bg-slate-100 dark:bg-slate-800/40 rounded-2xl outline-none text-sm font-bold appearance-none border-2 ${errors.bloodGroup ? 'border-red-500' : 'border-transparent focus:border-primary-500'}`}>
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                  <ErrorMessage message={errors.bloodGroup} />
                </div>
                <div className="space-y-2 text-left lg:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><MapPin size={10} /> Home Address</label>
                  <input type="text" name="address" placeholder="123 Main St, City" onChange={handleInputChange} className={`w-full p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.address ? 'border-red-500' : 'border-transparent focus:border-primary-500'} rounded-2xl outline-none text-sm font-bold`} />
                  <ErrorMessage message={errors.address} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Ruler size={10} /> Height (cm)</label>
                  <input type="number" name="height" placeholder="110" onChange={handleInputChange} className={`w-full p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.height ? 'border-red-500' : 'border-transparent focus:border-primary-500'} rounded-2xl outline-none text-sm font-bold`} />
                  <ErrorMessage message={errors.height} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Scale size={10} /> Weight (kg)</label>
                  <input type="number" name="weight" placeholder="20" onChange={handleInputChange} className={`w-full p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.weight ? 'border-red-500' : 'border-transparent focus:border-primary-500'} rounded-2xl outline-none text-sm font-bold`} />
                  <ErrorMessage message={errors.weight} />
                </div>
              </div>

              {/* Health Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ClipboardList size={12} className="text-primary-500" /> Health Notes / Allergies
                </label>
                <textarea
                  name="specialNote"
                  onChange={handleInputChange}
                  placeholder="Enter any medical conditions or specific requirements..."
                  rows={3}
                  className="w-full p-6 bg-slate-100 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:bg-[#0f172a] rounded-[2rem] outline-none text-sm font-bold text-midnight dark:text-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Guardian Section */}
          <div className="space-y-8 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <div className="bg-midnight rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white">
              {/* Animated Blur Background */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] animate-pulse"></div>
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Users size={120} />
              </div>

              <div className="flex items-center gap-4 mb-10 relative z-10 text-white">
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight">Parental Record</h3>
              </div>

              <div className="space-y-5 text-left relative z-10">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500 dark:text-slate-400">
                    Relationship
                  </label>
                  <select
                    name="relationship"
                    onChange={handleInputChange}
                    className={`w-full p-4 bg-white/10 border-2 ${errors.relationship ? 'border-red-500' : 'border-white/20'} rounded-2xl outline-none text-sm font-bold text-white appearance-none focus:bg-white/15 focus:border-primary-500 shadow-inner transition-all cursor-pointer`}
                  >
                    <option value="" className="bg-midnight">Select Relationship</option>
                    <option value="father" className="bg-midnight">Father</option>
                    <option value="mother" className="bg-midnight">Mother</option>
                    <option value="guardian" className="bg-midnight">Guardian</option>
                  </select>
                  <ErrorMessage message={errors.relationship} />
                </div>

                <LittleInput dark label={<span className="flex items-center gap-1"><Users size={10} /> Guardian Name</span>} name="parentFullName" placeholder="Primary parent name" onChange={handleInputChange} error={errors.parentFullName} />
                {/* Pre-register parent email */}
                <LittleInput dark label={<span className="flex items-center gap-1"><Mail size={10} /> Email Address</span>} name="parentEmail" placeholder="auth@littlesparks.com" onChange={handleInputChange} error={errors.parentEmail} />

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Phone size={10} /> Mobile
                  </label>
                  <PhoneInput
                    name="parentContact"
                    variant="dark"
                    onChange={handleInputChange}
                    value={formData.parentContact}
                    className="border-white/10"
                    error={errors.parentContact}
                  />
                  {/* PhoneInput displays its own error message, no need for ErrorMessage here */}
                </div>

                <LittleInput dark label={<span className="flex items-center gap-1"><Hash size={10} /> Identity Number</span>} name="parentID" placeholder="NIC or Passport" onChange={handleInputChange} error={errors.parentID} />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-7 rounded-[2.2rem] shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-4 font-black text-xs tracking-[0.25em] uppercase"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <><CheckCircle size={20} /> Register with LittleSparks</>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

// Reusable Input Component
const LittleInput = ({ label, dark, error, ...props }: any) => (
  <div className="space-y-2 text-left">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${dark ? 'text-slate-400 dark:text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{label}</label>
    <input
      {...props}
      className={`w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all ${dark
        ? `bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} text-white focus:bg-white/10 focus:border-primary-500`
        : `bg-slate-100 dark:bg-slate-800/40 border-2 ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary-500 focus:bg-white text-midnight shadow-sm`
        }`}
    />
    <ErrorMessage message={error} />
  </div>
);

export default AdmissionsPage;
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, User, MapPin, ArrowLeft, Loader2,
  CheckCircle, Sparkles, Scale, Ruler, Droplets,
  ClipboardList, Users, Mail, Phone, Hash
} from 'lucide-react';
import { Button } from '../../components/common/Button';

const AdmissionsPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Age Auto-calculation Logic
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
    // 1. Check if all boxes are filled (except Special Note)
    const requiredFields = [
      'fullName', 'nameWithInitials', 'dob', 'gender', 'bloodGroup',
      'height', 'weight', 'address', 'relationship', 'parentFullName',
      'parentEmail', 'parentContact', 'parentID'
    ];

    const isAllFilled = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== "");

    if (!isAllFilled) {
      alert("Registration failed! Please fill all the boxes in the form.");
      return false;
    }

    // 2. Sri Lankan Mobile Number Validation (+94 + 9 digits)
    const slPhoneRegex = /^\+94\d{9}$/;
    if (!slPhoneRegex.test(formData.parentContact)) {
      alert("Invalid Mobile Number! It must start with +94 followed by 9 numbers (e.g., +94701234567)");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      // Save data to localStorage
      const existingData = JSON.parse(localStorage.getItem('admissionsData') || '[]');
      const newChild = {
        id: 'c' + Date.now(),
        ...formData,
        profileImage: previewImage || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80',
        enrolledDate: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('admissionsData', JSON.stringify([...existingData, newChild]));

      setTimeout(() => {
        setIsSubmitting(false);
        alert("Registration Successful! Data has been stored in LittleSparks.");
        navigate('/admin/dashboard');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      {/* Header Section */}
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(10,6,55,0.03)] border border-slate-100 p-8 md:p-12">

              <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-black text-midnight uppercase tracking-tight">Student Information</h2>
              </div>

              {/* Photo & Identity */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 w-32 bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden cursor-pointer flex items-center justify-center relative group"
                  >
                    {previewImage ? <img src={previewImage} className="h-full w-full object-cover" alt="child" /> : <Camera size={24} className="text-slate-300" />}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  <p className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Child Photo</p>
                </div>

                <div className="md:col-span-3 space-y-5">
                  <LittleInput label="Full Name" name="fullName" placeholder="Enter full legal name" onChange={handleInputChange} />
                  <LittleInput label="Name with Initials" name="nameWithInitials" placeholder="e.g. A.B.C. Perera" onChange={handleInputChange} />
                </div>
              </div>

              {/* Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Birthday</label>
                  <input type="date" name="dob" onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl outline-none text-sm font-bold" />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Age
                  </label>
                  <div className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-midnight shadow-sm">
                    {age || "AGE"}
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                  <select name="gender" onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold appearance-none border-2 border-transparent focus:border-primary-500">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Medical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><Droplets size={10} /> Blood Group</label>
                  <select name="bloodGroup" onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold appearance-none border-2 border-transparent focus:border-primary-500">
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><Ruler size={10} /> Height (cm)</label>
                  <input type="number" name="height" placeholder="110" onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none text-sm font-bold" />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><Scale size={10} /> Weight (kg)</label>
                  <input type="number" name="weight" placeholder="20" onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none text-sm font-bold" />
                </div>
              </div>

              {/* Notes & Address */}
              <div className="mt-8 space-y-6 text-left">
                <LittleInput label="Home Address" name="address" placeholder="No 123, Street, City" onChange={handleInputChange} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><ClipboardList size={10} /> Special Notes / Allergies</label>
                  <textarea name="specialNote" rows={2} placeholder="Any medical conditions or allergies..." onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none text-sm font-bold transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Guardian Section */}
          <div className="space-y-8 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <div className="bg-midnight rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <h3 className="text-white font-black text-lg uppercase tracking-tight mb-8">Guardian Details</h3>

              <div className="space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relationship</label>
                  <select
                    name="relationship"
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white appearance-none focus:border-primary-500"
                  >
                    <option value="" className="bg-midnight">Select Role</option>
                    <option value="father" className="bg-midnight">Father</option>
                    <option value="mother" className="bg-midnight">Mother</option>
                    <option value="guardian" className="bg-midnight">Guardian</option>
                  </select>
                </div>

                <LittleInput dark label="Guardian Name" name="parentFullName" placeholder="Primary parent name" onChange={handleInputChange} />
                <LittleInput dark label="Email Address" name="parentEmail" placeholder="auth@littlesparks.com" onChange={handleInputChange} />
                <LittleInput dark label="Mobile (+94XXXXXXXXX)" name="parentContact" placeholder="+94701234567" onChange={handleInputChange} />
                <LittleInput dark label="Identity Number" name="parentID" placeholder="NIC or Passport" onChange={handleInputChange} />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-7 rounded-[2.2rem] bg-primary-500 text-white hover:bg-primary-600 shadow-2xl shadow-primary-500/20 transition-all flex items-center justify-center gap-4 font-black text-xs tracking-[0.25em] uppercase active:scale-95"
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
const LittleInput = ({ label, dark, ...props }: any) => (
  <div className="space-y-2 text-left">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
    <input
      {...props}
      className={`w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all ${dark
          ? 'bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-primary-500'
          : 'bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white text-midnight shadow-sm'
        }`}
    />
  </div>
);

export default AdmissionsPage;
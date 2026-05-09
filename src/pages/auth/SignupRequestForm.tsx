import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../shared/ui/AuthHeader/AuthHeader";
import { Button } from "../../components/common/Button";
import { apiClient } from "../../services/axiosInstance";
import heroImg from "../../assets/images/hero.png";
import requestSideImg from "../../assets/images/request-side.png";
import directorDashboardImg from "../../assets/images/image_5.jpg";

type UserRole = "director" | "teacher" | "parent";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  address: string;
  role: UserRole;
  // Parent specific
  childName?: string;
  dob?: string;
  gender?: string;
  relationship?: string;
  nic?: string;
  // Director specific
  centerName?: string;
  centerAddress?: string;
  capacity?: string;
  // Teacher specific
  experience?: string;
  message: string;
}

const SignupRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("director");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "director",
    relationship: "MOTHER",
    experience: "1-5",
    centerName: "",
    centerAddress: "",
    capacity: "",
    childName: "",
    dob: "",
    gender: "male",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculator
  const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
    if (!pw) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-400", width: "50%" };
    if (score === 3) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(form.password || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setForm(prev => ({ ...prev, role: newRole }));
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email address.";

    // Password
    if (!form.password || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    // Phone - Sri Lanka format (07X or +947X, 10 digits)
    const phoneRegex = /^(?:\+94|0)7[0-9]{8}$/;
    if (!phoneRegex.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid Sri Lanka phone number (e.g. 0771234567).";

    // Role specific validations
    if (role === "parent") {
      // NIC - Old (9 digits + V/X) or New (12 digits)
      const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
      if (!form.nic || !nicRegex.test(form.nic.trim()))
        newErrors.nic = "Enter a valid Sri Lanka NIC (e.g. 199012345V or 200012345678).";

      // Child DOB - must be between 0 and 10 years
      if (form.dob) {
        const dob = new Date(form.dob);
        const today = new Date();
        const minAge = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
        const maxAge = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
        
        if (dob > today) {
          newErrors.dob = "Date of birth cannot be in the future.";
        } else if (dob > maxAge) {
          newErrors.dob = "Child must be at least 3 years old.";
        } else if (dob < minAge) {
          newErrors.dob = "Child must be under 10 years old.";
        }
      } else {
        newErrors.dob = "Child's date of birth is required.";
      }
    }

    if (role === "director") {
      const cap = parseInt(form.capacity || "0");
      if (!form.capacity || cap < 1 || cap > 500)
        newErrors.capacity = "Capacity must be between 1 and 500.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Send all data to the backend based on role
      let endpoint = "/api/v1/auth/signup/parent/request";
      if (role === "teacher") endpoint = "/api/v1/auth/signup/teacher/request";
      if (role === "director") endpoint = "/api/v1/auth/signup/director/request";

      await apiClient.post(endpoint, {
        ...form,
        fullName: `${form.firstName} ${form.lastName}`
      });

      navigate("/request-confirmed");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      
      // If backend says email is not registered as a guardian, show it on the email field
      if (msg.toLowerCase().includes("guardian") || msg.toLowerCase().includes("enrollment") || msg.toLowerCase().includes("pre-registered")) {
        setErrors(prev => ({ ...prev, email: msg }));
      } else {
        alert(msg);
      }

    } finally {

      setIsSubmitting(false);
    }
  };

  const content = {
    director: {
      leftTitle: "Manage Your Center",
      leftSubtitle: "Request access to oversee operations, staff, and enrollments in one powerful dashboard.",
      rightTitle: "Executive Oversight",
      rightText: "Scale your childcare business with advanced administrative tools designed for efficiency.",
      image: directorDashboardImg
    },
    teacher: {
      leftTitle: "Empower Your Teaching",
      leftSubtitle: "Connect with students and share wonderful moments with families effortlessly.",
      rightTitle: "Inspire the Future",
      rightText: "Focus on what matters most nurturing and educating every child in your care.",
      image: heroImg
    },
    parent: {
      leftTitle: "Join Your Community",
      leftSubtitle: "Stay updated on your child's daily journey, milestones, and center activities.",
      rightTitle: "Stay Connected",
      rightText: "Real-time updates and complete peace of mind for your family's daily childcare life.",
      image: requestSideImg
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader backLink="/" />

      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        <section className="flex-1 p-8 lg:p-12 xl:p-20 bg-white overflow-y-auto flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md lg:mr-12 xl:mr-24">

            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {content[role].leftTitle}
            </h1>
            <p className="text-slate-500 mb-10 text-lg">
              {content[role].leftSubtitle}
            </p>

            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10 shadow-inner">
              {(["director", "teacher", "parent"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 capitalize ${role === r
                    ? "bg-white text-cyan-600 shadow-md transform scale-[1.02]"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                  <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all" type="text" name="firstName" placeholder="Ann" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                  <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all" type="text" name="lastName" placeholder="Fonseka" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none transition-all`}
                  type="email" name="email" placeholder="ann@example.com"
                  value={form.email} onChange={handleChange} required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <input className={`w-full px-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none transition-all`} type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                {form.password && (
                  <div className="mt-1">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className={`text-xs mt-1 font-semibold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm Password</label>
                <input className={`w-full px-4 py-3 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none transition-all`} type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone</label>
                <input className={`w-full px-4 py-3 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none transition-all`} type="text" name="phone" placeholder="0771234567" value={form.phone} onChange={handleChange} required />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Dynamic Role Fields */}
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                {role === "parent" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all" type="text" name="address" placeholder="Residential Address" value={form.address} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">NIC Number</label>
                      <input className={`w-full px-4 py-3 bg-slate-50 border ${errors.nic ? 'border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none transition-all`} type="text" name="nic" placeholder="199012345V or 200012345678" value={form.nic || ""} onChange={handleChange} required />
                      {errors.nic && <p className="text-red-500 text-xs mt-1">{errors.nic}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Child's Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="text" name="childName" value={form.childName || ""} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Child's DOB</label>
                        <input
                          className={`w-full px-4 py-3 bg-slate-50 border ${errors.dob ? 'border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none`}
                          type="date" name="dob"
                          max={new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]}
                          min={new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toISOString().split('T')[0]}
                          value={form.dob || ""} onChange={handleChange} required
                        />
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" name="gender" value={form.gender || ""} onChange={handleChange} required>
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Relationship</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" name="relationship" value={form.relationship || "MOTHER"} onChange={handleChange} required>
                        <option value="MOTHER">Mother</option>
                        <option value="FATHER">Father</option>
                        <option value="GUARDIAN">Guardian</option>
                      </select>
                    </div>
                  </>
                )}
                {role === "director" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="text" name="centerName" value={form.centerName || ""} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Address</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="text" name="centerAddress" value={form.centerAddress || ""} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Capacity</label>
                      <input className={`w-full px-4 py-3 bg-slate-50 border ${errors.capacity ? 'border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none`} type="number" name="capacity" min="1" max="500" value={form.capacity || ""} onChange={handleChange} required />
                      {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                    </div>
                  </>
                )}
                {role === "teacher" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all" type="text" name="address" placeholder="Residential Address" value={form.address} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" name="experience" value={form.experience || "1-5"} onChange={handleChange} required>
                        <option value="< 1">Less than 1 year</option>
                        <option value="1-5">1 - 5 years</option>
                        <option value="> 5">More than 5 years</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 min-h-[100px] resize-none" name="message" value={form.message} onChange={handleChange} />
              </div>

              <Button variant="primary" className="w-full py-4 rounded-xl shadow-lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-center text-sm text-slate-500">
                Already have an account? <Link className="text-cyan-600 font-bold hover:underline" to="/login">Login here</Link>
              </p>
            </form>
          </div>
        </section>

        <section className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-600 to-blue-700 p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="w-full max-w-[540px] mb-12 relative group transition-all duration-700 transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black/40 rounded-[3rem] blur-3xl translate-y-12 scale-90 opacity-60" />
              <div className="relative bg-slate-900 p-4 rounded-[3.2rem] shadow-2xl border-[10px] border-slate-800/90 overflow-hidden aspect-[4/3] flex items-center justify-center">
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden shadow-inner">
                  <img src={content[role].image} alt="Preview" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                </div>
              </div>
            </div>
            <div className="text-center text-white max-w-md">
              <h2 className="text-4xl font-extrabold mb-4">{content[role].rightTitle}</h2>
              <p className="text-cyan-50 text-lg font-medium opacity-90">{content[role].rightText}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignupRequestForm;
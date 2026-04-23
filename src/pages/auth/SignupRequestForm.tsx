import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdExpandMore as ChevronDown } from "react-icons/md";
import { AuthHeader } from "@/shared/ui/AuthHeader/AuthHeader";

// Assets
import heroImg from "@/shared/assets/images/hero.png";
import tabletImg from "@/shared/assets/images/tablet.png";
import requestSideImg from "@/shared/assets/images/request-side.png";

type UserRole = "director" | "teacher" | "parent";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  // Parent specific
  childName?: string;
  dob?: string;
  gender?: string;
  // Director specific
  centerName?: string;
  centerAddress?: string;
  capacity?: string;
  // Teacher specific
  experience?: string;
  // Common
  message: string;
}

const SignupRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("director");
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "director",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setForm(prev => ({ ...prev, role: newRole }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const savedRequests = JSON.parse(localStorage.getItem("user_requests") || "[]");
    const newRequest = {
      ...form,
      id: Date.now(),
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };
    
    localStorage.setItem("user_requests", JSON.stringify([...savedRequests, newRequest]));

    console.log("Signup Request submitted:", newRequest);
    navigate("/request-confirmed");
  };

  // Dynamic Content Map
  const content = {
    director: {
      leftTitle: "Manage Your Center",
      leftSubtitle: "Request access to oversee operations, staff, and enrollments in one powerful dashboard.",
      rightTitle: "Executive Oversight",
      rightText: "Scale your childcare business with advanced administrative tools designed for efficiency.",
      image: tabletImg
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full">
        {/* LEFT: FORM */}
        <section className="flex-1 p-8 lg:p-16 xl:p-24 bg-white overflow-y-auto">
          <div className="max-w-md mx-auto lg:mx-0">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{content[role].leftTitle}</h1>
            <p className="text-slate-500 mb-10">
              {content[role].leftSubtitle}
            </p>

            {/* Role Selector */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-10 shadow-inner">
              {(["director", "teacher", "parent"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                    role === r 
                      ? "bg-white text-cyan-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Row: First + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ROLE SPECIFIC FIELDS */}
              {role === "parent" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Child's Full Name</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                      type="text"
                      name="childName"
                      placeholder="e.g., Leo Doe"
                      value={form.childName || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date of Birth</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                        type="date"
                        name="dob"
                        value={form.dob || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all appearance-none pr-10 cursor-pointer"
                          name="gender"
                          value={form.gender || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {role === "director" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Name</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                      type="text"
                      name="centerName"
                      placeholder="e.g., Bluebird Early Learning"
                      value={form.centerName || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Address</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                      type="text"
                      name="centerAddress"
                      placeholder="123 Education Way, NY"
                      value={form.centerAddress || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Capacity</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                      type="number"
                      name="capacity"
                      placeholder="e.g., 50"
                      value={form.capacity || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {role === "teacher" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Years of Experience</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all appearance-none pr-10 cursor-pointer"
                      name="experience"
                      value={form.experience || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select Experience</option>
                      <option value="0">0 (New Graduate)</option>
                      <option value="1-5">1 - 5 Years</option>
                      <option value=">5">More than 5 Years</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl" />
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message to Admin (Optional)</label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all min-h-[100px] resize-none"
                  name="message"
                  placeholder="Any specific notes or questions?"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button 
                className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all transform duration-300" 
                type="submit"
              >
                Submit Application
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link className="text-cyan-600 font-bold hover:underline" to="/login">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </section>

        {/* RIGHT: ILLUSTRATION/IMAGE */}
        <section className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-500 to-blue-600 p-24 items-center justify-center relative overflow-hidden">
          {/* Abstract blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-all duration-500" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 transition-all duration-500" />
          
          <div className="relative z-10 text-center text-white">
            <div className="w-full max-w-md aspect-square bg-white/20 backdrop-blur-lg rounded-3xl mb-12 flex items-center justify-center p-8 shadow-2xl transition-all duration-500 transform hover:scale-105">
              <img 
                src={content[role].image} 
                alt={`${role} illustration`} 
                className="w-full h-full object-cover rounded-2xl shadow-xl transition-all duration-500"
              />
            </div>
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">{content[role].rightTitle}</h2>
            <p className="text-cyan-50 max-w-sm mx-auto text-lg opacity-90">
              {content[role].rightText}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignupRequestForm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdExpandMore as ChevronDown } from "react-icons/md";

// AuthHeader and Common Components
import { AuthHeader } from "../../shared/ui/AuthHeader/AuthHeader";

// Assets and Images
import heroImg from "../../assets/images/hero.png";
import requestSideImg from "../../assets/images/request-side.png";
import directorDashboardImg from "../../assets/images/image_5.jpg"; 

type UserRole = "director" | "teacher" | "parent";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  childName?: string;
  dob?: string;
  gender?: string;
  centerName?: string;
  centerAddress?: string;
  capacity?: string;
  experience?: string;
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
    navigate("/request-confirmed");
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

      {/* Main Container: Removed max-w-1440 for Full Width */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        
        {/* LEFT: FORM SECTION */}
        <section className="flex-1 p-8 lg:p-12 xl:p-20 bg-white overflow-y-auto flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md lg:mr-12 xl:mr-24">
            
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {content[role].leftTitle}
            </h1>
            <p className="text-slate-500 mb-10 text-lg">
              {content[role].leftSubtitle}
            </p>

            {/* Role Selector Tabs */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10 shadow-inner">
              {(["director", "teacher", "parent"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 capitalize ${
                    role === r 
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
                  <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all" type="text" name="firstName" placeholder="Jane" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                  <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all" type="text" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all" type="email" name="email" placeholder="jane@example.com" value={form.email} onChange={handleChange} required />
              </div>

              {/* Dynamic Role Fields */}
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                {role === "parent" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Child's Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="text" name="childName" value={form.childName || ""} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">DOB</label>
                        <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="date" name="dob" value={form.dob || ""} onChange={handleChange} required />
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
                  </>
                )}
                {role === "director" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="text" name="centerName" value={form.centerName || ""} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address</label>
                        <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="text" name="centerAddress" value={form.centerAddress || ""} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Capacity</label>
                        <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" type="number" name="capacity" value={form.capacity || ""} onChange={handleChange} required />
                      </div>
                    </div>
                  </>
                )}
                {role === "teacher" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500" name="experience" value={form.experience || ""} onChange={handleChange} required>
                      <option value="" disabled>Select Years</option>
                      <option value="0-1">0 - 1 Year</option>
                      <option value="2-5">2 - 5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 min-h-[100px] resize-none" name="message" value={form.message} onChange={handleChange} />
              </div>

              <button className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-cyan-600 transition-all transform hover:-translate-y-0.5" type="submit">
                Submit Application
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account? <Link className="text-cyan-600 font-bold hover:underline" to="/login">Login here</Link>
              </p>
            </form>
          </div>
        </section>

        {/* RIGHT: MOCKUP SECTION (Full Width) */}
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../shared/ui/AuthHeader/AuthHeader";
import { Button } from "../../components/common/Button";
import { PhoneInput } from "../../components/common/PhoneInput";
import { apiClient } from "../../services/axiosInstance";
import heroImg from "../../assets/images/hero.png";
import requestSideImg from "../../assets/images/request-side.png";
import directorDashboardImg from "../../assets/images/image_5.jpg";
import { Eye, EyeOff } from "lucide-react";

type UserRole = "director" | "teacher" | "parent";

// This defines all the possible information we collect during registration
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  address: string;
  role: UserRole; // Can be 'director', 'teacher', or 'parent'

  // Fields specifically for Parents
  childName?: string;
  dob?: string;
  gender?: string;
  relationship?: string;
  nic?: string;

  // Fields specifically for Directors (Center Owners)
  centerName?: string;
  centerAddress?: string;
  capacity?: string;

  // Fields specifically for Teachers
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
    phone: "+94 ",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (name === "phone") {
      const val = value.replace(/^\+94\s?/, '');
      setForm((prev) => ({ ...prev, phone: `+94 ${val}` }));
      setErrors(prev => ({ ...prev, phone: "" }));
      return;
    }

    // Capitalize first letter of each word for names
    if (name === "firstName" || name === "lastName" || name === "childName") {
      const capitalized = value.replace(/\b\w/g, char => char.toUpperCase());
      setForm((prev) => ({ ...prev, [name]: capitalized }));
      setErrors(prev => ({ ...prev, [name]: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setForm(prev => ({ ...prev, role: newRole }));
    setErrors({});
  };

  // This function checks if the user entered correct information before submitting
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last Name is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!form.email) newErrors.email = "Email Address is required.";
    else if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email address.";

    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm Password is required.";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    const phoneRegex = /^\+94\s7[0-9]{8}$/;
    if (!phoneRegex.test(form.phone))
      newErrors.phone = "Enter a valid Sri Lanka phone number (e.g. +94 771234567).";

    if (role === "parent") {
      if (!form.address.trim()) newErrors.address = "Address is required.";

      const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
      if (!form.nic) newErrors.nic = "NIC Number is required.";
      else if (!nicRegex.test(form.nic.trim())) newErrors.nic = "Enter a valid Sri Lanka NIC (e.g. 199012345V).";

      if (!form.childName?.trim()) newErrors.childName = "Child's Name is required.";

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
      if (!form.centerName?.trim()) newErrors.centerName = "Center Name is required.";
      if (!form.centerAddress?.trim()) newErrors.centerAddress = "Center Address is required.";

      const cap = parseInt(form.capacity || "0");
      if (!form.capacity) newErrors.capacity = "Capacity is required.";
      else if (cap < 1 || cap > 500) newErrors.capacity = "Capacity must be between 1 and 500.";
    }

    if (role === "teacher") {
      if (!form.address.trim()) newErrors.address = "Address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // This function sends the registration request to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // Don't submit if there are validation errors

    setIsSubmitting(true);
    try {
      // Pick the correct API endpoint based on the selected role
      let endpoint = "/api/v1/auth/signup/parent/request";
      if (role === "teacher") endpoint = "/api/v1/auth/signup/teacher/request";
      if (role === "director") endpoint = "/api/v1/auth/signup/director/request";

      // Send the data to the backend
      await apiClient.post(endpoint, {
        ...form,
        fullName: `${form.firstName} ${form.lastName}`
      });

      // If successful, go to the confirmation page
      navigate("/request-confirmed");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";

      // Special case for parents: if they aren't pre-registered as guardians, show a helpful message
      if (msg.toLowerCase().includes("guardian") || msg.toLowerCase().includes("enrollment") || msg.toLowerCase().includes("pre-registered")) {
        setErrors(prev => ({ ...prev, email: msg }));
      } else {
        alert(msg);
      }

    } finally {
      setIsSubmitting(false); // Stop the loading state
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

  const getInputStyle = (errorField?: string) =>
    `w-full px-4 py-3 bg-slate-50 border ${errorField ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-cyan-500'} rounded-xl outline-none transition-all`;

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
                    ? "bg-cyan-600 text-white shadow-md transform scale-[1.02]"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name <RequiredAsterisk /></label>
                  <input className={getInputStyle(errors.firstName)} type="text" name="firstName" placeholder="Ann" value={form.firstName} onChange={handleChange} />
                  <ErrorMessage message={errors.firstName} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name <RequiredAsterisk /></label>
                  <input className={getInputStyle(errors.lastName)} type="text" name="lastName" placeholder="Fonseka" value={form.lastName} onChange={handleChange} />
                  <ErrorMessage message={errors.lastName} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address <RequiredAsterisk /></label>
                <input className={getInputStyle(errors.email)} type="email" name="email" placeholder="ann@example.com" value={form.email} onChange={handleChange} />
                <ErrorMessage message={errors.email} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password <RequiredAsterisk /></label>
                <div className="relative">
                  <input
                    className={`${getInputStyle(errors.password)} pl-4 pr-12`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {form.password && !errors.password && (
                  <div className="mt-1">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className={`text-xs mt-1 font-semibold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                  </div>
                )}
                <ErrorMessage message={errors.password} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm Password <RequiredAsterisk /></label>
                <div className="relative">
                  <input
                    className={`${getInputStyle(errors.confirmPassword)} pl-4 pr-12`}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage message={errors.confirmPassword} />
              </div>

              <PhoneInput
                label={<>Phone <RequiredAsterisk /></>}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                required={false}
              />
              <ErrorMessage message={errors.phone} />

              {/* Dynamic Role Fields */}
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                {role === "parent" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address <RequiredAsterisk /></label>
                      <input className={getInputStyle(errors.address)} type="text" name="address" placeholder="Residential Address" value={form.address} onChange={handleChange} />
                      <ErrorMessage message={errors.address} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">NIC Number <RequiredAsterisk /></label>
                      <input className={getInputStyle(errors.nic)} type="text" name="nic" placeholder="199012345V or 200012345678" value={form.nic || ""} onChange={handleChange} />
                      <ErrorMessage message={errors.nic} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Child's Name <RequiredAsterisk /></label>
                      <input className={getInputStyle(errors.childName)} type="text" name="childName" value={form.childName || ""} onChange={handleChange} />
                      <ErrorMessage message={errors.childName} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Child's DOB <RequiredAsterisk /></label>
                        <input
                          className={getInputStyle(errors.dob)}
                          type="date" name="dob"
                          max={new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]}
                          min={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
                          value={form.dob || ""} onChange={handleChange}
                        />
                        <ErrorMessage message={errors.dob} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender <RequiredAsterisk /></label>
                        <select className={getInputStyle(errors.gender)} name="gender" value={form.gender || ""} onChange={handleChange}>
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        <ErrorMessage message={errors.gender} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Relationship <RequiredAsterisk /></label>
                      <select className={getInputStyle()} name="relationship" value={form.relationship || "MOTHER"} onChange={handleChange}>
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
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Name <RequiredAsterisk /></label>
                      <input className={getInputStyle(errors.centerName)} type="text" name="centerName" value={form.centerName || ""} onChange={handleChange} />
                      <ErrorMessage message={errors.centerName} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Center Address <RequiredAsterisk /></label>
                      <input className={getInputStyle(errors.centerAddress)} type="text" name="centerAddress" value={form.centerAddress || ""} onChange={handleChange} />
                      <ErrorMessage message={errors.centerAddress} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Capacity <RequiredAsterisk /></label>
                      <input className={getInputStyle(errors.capacity)} type="number" name="capacity" min="1" max="500" value={form.capacity || ""} onChange={handleChange} />
                      <ErrorMessage message={errors.capacity} />
                    </div>
                  </>
                )}
                {role === "teacher" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address <RequiredAsterisk /></label>
                      <input className={getInputStyle(errors.address)} type="text" name="address" placeholder="Residential Address" value={form.address} onChange={handleChange} />
                      <ErrorMessage message={errors.address} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience <RequiredAsterisk /></label>
                      <select className={getInputStyle()} name="experience" value={form.experience || "1-5"} onChange={handleChange}>
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
                <textarea className={getInputStyle()} name="message" value={form.message} onChange={handleChange} />
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
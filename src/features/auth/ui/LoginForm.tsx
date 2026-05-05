import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Shared components 
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Card } from "../../../components/common/Card";
import { Spinner } from "../../../components/common/Spinner";

// App store and Firebase
import { useAppDispatch, useAppSelector, RootState } from "../../../store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../../lib/firebase";

// Local model and Routing
import { setUser, setError, setLoading } from "../model/authSlice";
import { useNavigate, Link } from "react-router-dom";

// ==========================================
// 1) Internal Logo Component (Landing Page UI)
// ==========================================
const LittleSparksLogo = () => (
  <div className="flex items-center gap-0 select-none scale-110 mb-2">
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-14 h-14" viewBox="0 0 260.000000 280.000000" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,280.000000) scale(0.100000,-0.100000)" fill="#1F2937" stroke="#1F2937" strokeWidth="80" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1270 2460 c-62 -18 -141 -70 -295 -194 -126 -101 -160 -131 -318 -286 -171 -166 -267 -283 -267 -325 0 -26 62 -45 144 -45 103 0 106 -4 106 -138 0 -120 21 -291 46 -385 63 -236 230 -415 457 -491 58 -19 67 -20 67 -3 0 7 -26 21 -59 31 -89 27 -178 83 -262 166 -147 147 -200 301 -220 645 -5 99 -12 181 -15 184 -7 7 -103 19 -159 20 -69 2 -83 12 -65 46 27 50 208 242 357 379 180 165 337 288 433 339 69 38 72 39 120 27 141 -34 446 -280 702 -567 55 -62 113 -130 129 -152 35 -47 33 -48 -82 -57 -67 -6 -83 -11 -94 -28 -9 -15 -14 -87 -18 -266 -4 -214 -7 -253 -26 -311 -52 -164 -186 -288 -370 -343 -78 -23 -207 -21 -283 5 -220 74 -378 314 -378 573 0 189 68 331 175 366 80 26 170 -46 210 -169 16 -49 23 -196 13 -271 -6 -47 17 -35 34 17 32 100 108 185 206 230 127 59 229 -10 201 -135 -30 -137 -171 -257 -335 -285 -43 -7 -64 -16 -64 -25 0 -31 169 12 250 63 147 93 224 277 158 375 -66 98 -242 64 -358 -67 -22 -25 -40 -50 -40 -54 0 -5 -4 -9 -9 -9 -4 0 -11 33 -13 73 -11 146 -79 257 -175 282 -132 34 -222 -53 -268 -259 -70 -313 118 -656 404 -740 175 -51 400 13 541 153 76 76 121 159 140 256 7 33 14 165 17 293 4 158 9 235 17 238 6 2 49 8 95 13 96 10 120 25 100 62 -63 120 -431 489 -639 641 -144 105 -246 147 -310 128z" />
      </g>
    </svg>
    <span
      className="font-bold tracking-tighter -ml-2 text-3xl text-[#1F2937]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      Little<span style={{ color: '#06C5D4' }}>Sparks</span>
    </span>
  </div>
);

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // 1. Check if input might be an OTP (6-digit number)
      const isOtp = /^\d{6}$/.test(data.password);

      if (isOtp) {
        try {
          await apiClient.post("/api/v1/auth/signup/verify-otp", {
            email: data.email,
            otpCode: data.password
          });
          
          alert("✨ Account Activated Successfully! You can now log in using your permanent password.");
          dispatch(setLoading(false));
          return;
        } catch (otpErr: any) {
          // If it wasn't an OTP or verification failed, continue to normal login
          console.log("Not an OTP or verification failed, trying normal login...");
        }
      }

      // 2. Standard Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      const { uid, email, displayName, photoURL } = userCredential.user;
      
      // Get role from Firebase Custom Claims (we set this in backend)
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role as string;

      dispatch(setUser({ uid, email, displayName, photoURL, role }));
      
      // Redirect based on role
      if (role === 'PARENT') navigate("/parent/children");
      else if (role === 'TEACHER') navigate("/teacher/dashboard");
      else if (role === 'ADMIN') navigate("/admin/dashboard");
      else navigate("/");

    } catch (err: any) {
      if (err.code === 'auth/user-disabled') {
        // Redirect to new verification page with email pre-filled
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
      
      let msg = "Invalid email or password.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      dispatch(setError(msg));
    } finally {

      dispatch(setLoading(false));
    }
  };


  return (
    <Card className="w-full max-w-md p-8 shadow-2xl border-t-4 border-t-cyan-500 bg-white/80 backdrop-blur-sm">

      {/* BRAND SECTION UPDATED */}
      <div className="flex flex-col items-center mb-6">
        <LittleSparksLogo />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors uppercase tracking-wider"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl animate-shake">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 rounded-xl shadow-lg shadow-cyan-500/30"
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : null}
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
        <span className="text-slate-500">Don't have an account? </span>
        <Link
          to="/signup-request"
          className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors underline decoration-2 underline-offset-4"
        >
          Join LittleSparks
        </Link>
      </div>
    </Card>
  );
}
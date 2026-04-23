import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Card } from "@/shared/ui/Card";
import { Spinner } from "@/shared/ui/Spinner";
import { useAppDispatch, useAppSelector, RootState } from "@/app/store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/shared/auth/firebase";
import { setUser, setError, setLoading } from "../model/authSlice";
import { useNavigate, Link } from "react-router-dom";

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
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );
      const { uid, email, displayName, photoURL } = userCredential.user;
      dispatch(setUser({ uid, email, displayName, photoURL }));
      navigate("/");
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to login"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Card className="w-full max-w-md p-8 shadow-2xl border-t-4 border-t-cyan-500 bg-white/80 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
        <p className="mt-2 text-sm text-slate-500">
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
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5" 
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : null}
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
        <span className="text-slate-500">Don't have an account? </span>
        <Link 
          to="/request-form" 
          className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors underline decoration-2 underline-offset-4"
        >
          Join LittleSparks
        </Link>
      </div>
    </Card>
  );
}

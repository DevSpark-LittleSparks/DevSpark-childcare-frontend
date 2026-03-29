import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const Logo = () => (
    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md">
      S
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6">
          <Logo />
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            SPROUTY
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

import { LoginForm } from "../../features/auth/ui/LoginForm";
import loginImg from "../../assets/images/login-dark.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* LEFT SIDE: The actual login form where users type their info */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-white dark:bg-[#0f172a] animate-in fade-in slide-in-from-left-4 duration-1000 z-10 shadow-2xl">
        <LoginForm />
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="hidden md:block w-1/2 relative overflow-hidden bg-slate-900">

        {/* This is the background image with a smooth zoom out animation */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-zoomOutSlow opacity-90"
          style={{
            backgroundImage: `url(${loginImg})`,
          }}
        />

        {/* A subtle dark gradient overlay to make it look premium and blend with the black theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Content area for extra text if needed */}

      </div>
    </div>
  );
}
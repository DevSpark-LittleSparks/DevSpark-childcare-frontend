import { LoginForm } from "../../features/auth/ui/LoginForm";
import discoverKidsImg from "../../assets/images/discover-kids.jpg";

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
            backgroundImage: `url(${discoverKidsImg})`,
          }}
        />

        {/* Removed dark gradient overlays because the new image is bright */}

        {/* Content area for extra text if needed */}

      </div>
    </div>
  );
}
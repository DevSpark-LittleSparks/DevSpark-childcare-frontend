import { LoginForm } from "../../features/auth/ui/LoginForm";
import loginImg from "../../assets/images/login.png";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE: The actual login form where users type their info */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-white">
        <LoginForm />
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">

        {/* This is the background image */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-zoomSlow"
          style={{
            backgroundImage: `url(${loginImg})`,
          }}
        />

        {/* This makes the image look darker so it doesn't hurt the eyes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Content area for extra text if needed */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-10 text-center">

        </div>

      </div>
    </div>
  );
}
import { ProfileForm } from "@/features/profile/ui/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl text-left">
          User Profile
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Manage your account information and preferences
        </p>
      </div>
      
      <div className="mt-8">
        <ProfileForm />
      </div>
    </div>
  );
}

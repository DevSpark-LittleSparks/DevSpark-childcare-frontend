import { SettingsForm } from "@/features/settings/ui/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl text-left">
          Application Settings
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Customize your experience within the SPROUTY platform
        </p>
      </div>
      
      <div className="mt-8">
        <SettingsForm />
      </div>
    </div>
  );
}

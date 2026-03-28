import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["en", "es", "fr"]),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const {
    register,
    handleSubmit,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      theme: "light",
      language: "en",
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    console.log("Settings updated:", data);
    // Add logic to save settings
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-xl font-bold">App Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Notifications</h4>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500">Receive weekly updates and alerts</p>
                </div>
                <input 
                  type="checkbox" 
                  {...register("emailNotifications")}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Push Notifications</label>
                  <p className="text-xs text-gray-500">Receive real-time alerts on your device</p>
                </div>
                <input 
                  type="checkbox" 
                  {...register("pushNotifications")}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Appearance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Theme</label>
                  <select 
                    {...register("theme")}
                    className="w-full h-11 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Language</label>
                  <select 
                    {...register("language")}
                    className="w-full h-11 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="px-8 bg-primary hover:bg-primary-hover">
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

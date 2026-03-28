import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { useAppSelector } from "@/app/store";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Profile updated:", data);
    // Add Firebase update logic here
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Display Name"
              {...register("displayName")}
              error={errors.displayName?.message}
            />
            <Input
              label="Email Address"
              type="email"
              disabled
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Bio
            </label>
            <textarea
              className="flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              placeholder="Tell us a little about yourself"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="px-8 bg-primary hover:bg-primary-hover">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { SelectRoleForm } from "@/features/auth/select-role-form";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Select role");

export default function SelectRolePage() {
  return (
    <section>
      <h1 className="text-h2">How will you use DriverDosth?</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Choose the role that fits how you use DriverDosth.
      </p>
      <div className="mt-8">
        <SelectRoleForm />
      </div>
    </section>
  );
}

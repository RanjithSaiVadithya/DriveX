import { SelectRoleForm } from "@/features/auth/select-role-form";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Select role");

export default function SelectRolePage() {
  return (
    <section>
      <h1 className="text-h2">How will you use DriveX?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose User or Driver. Additional roles can be added later.
      </p>
      <div className="mt-8">
        <SelectRoleForm />
      </div>
    </section>
  );
}

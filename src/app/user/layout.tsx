import type { ReactNode } from "react";
import { UserShell } from "@/components/shared/app-shell";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("User app");

export default function UserLayout({ children }: { children: ReactNode }) {
  return <UserShell>{children}</UserShell>;
}

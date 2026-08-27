import type { ReactNode } from "react";
import { DriverShell } from "@/components/shared/app-shell";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Driver app");

export default function DriverLayout({ children }: { children: ReactNode }) {
  return <DriverShell>{children}</DriverShell>;
}

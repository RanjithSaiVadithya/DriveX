import { privatePageMetadata } from "@/lib/seo";
import { OfflinePageClient } from "./offline-client";

export const metadata = privatePageMetadata("Offline");

export default function OfflinePage() {
  return <OfflinePageClient />;
}

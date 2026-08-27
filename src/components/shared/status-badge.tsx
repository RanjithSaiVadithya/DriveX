import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  ONLINE: "bg-olive/15 text-olive border-olive/20",
  OFFLINE: "bg-muted text-muted-foreground border-border",
  BUSY: "bg-orange/15 text-orange border-orange/20",
  ACTIVE: "bg-olive/15 text-olive border-olive/20",
  PENDING: "bg-warm-beige text-deep-navy border-border",
  CONFIRMED: "bg-olive/15 text-olive border-olive/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  COMPLETED: "bg-deep-navy/10 text-deep-navy border-deep-navy/20",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status.replaceAll("_", " ")}
    </Badge>
  );
}

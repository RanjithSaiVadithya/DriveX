import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("size-4 animate-spin text-olive", className)}
      aria-label="Loading"
    />
  );
}

type IconButtonProps = ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants>;

export function IconButton({ className, size = "icon", ...props }: IconButtonProps) {
  return <Button size={size} className={cn(className)} {...props} />;
}

"use client";

import { useRouter } from "next/navigation";
import { Car, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { getHomeForRole } from "@/services/domain/role-permissions";
import { isAppError } from "@/services/domain/errors";
import type { ActiveRole } from "@/types/auth";
import { cn } from "@/lib/utils";
import { RequireAuth } from "@/components/shared/require-auth";

function SelectRoleInner() {
  const router = useRouter();
  const { selectRole } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function choose(role: ActiveRole) {
    setError(null);
    try {
      const res = await selectRole.mutateAsync({ role });
      toast.success(role === "USER" ? "Welcome" : "Welcome, driver");
      router.push(getHomeForRole(res.data.user.role));
    } catch (err) {
      setError(isAppError(err) ? err.message : "Could not select role");
    }
  }

  const cards: Array<{
    role: ActiveRole;
    title: string;
    description: string;
    icon: typeof UserRound;
  }> = [
    {
      role: "USER",
      title: "Book a Driver",
      description: "I need a driver for my vehicle",
      icon: UserRound,
    },
    {
      role: "DRIVER",
      title: "Drive With Us",
      description: "I want to become a driver",
      icon: Car,
    },
  ];

  return (
    <div className="space-y-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.role}
            type="button"
            disabled={selectRole.isPending}
            onClick={() => void choose(card.role)}
            className={cn(
              "flex w-full items-start gap-4 rounded-xl border border-border bg-warm-white p-5 text-left shadow-soft transition-shadow hover:shadow-medium focus-visible:ring-2 focus-visible:ring-olive/40",
              selectRole.isPending && "opacity-70",
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-lg bg-olive/10 text-olive">
              <Icon className="size-6" aria-hidden />
            </span>
            <span>
              <span className="block text-lg font-semibold text-deep-navy">
                {card.title}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {card.description}
              </span>
            </span>
          </button>
        );
      })}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectRoleForm() {
  return (
    <RequireAuth>
      <SelectRoleInner />
    </RequireAuth>
  );
}

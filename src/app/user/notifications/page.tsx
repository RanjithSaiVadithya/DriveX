"use client";

import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { listQuery, markRead, markAllRead, unreadCount } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 ? (
          <Button
            type="button"
            variant="outline"
            disabled={markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            Mark all read
          </Button>
        ) : null}
      </div>

      <DataState
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage="Unable to load notifications"
        onRetry={() => void listQuery.refetch()}
        isEmpty={(listQuery.data ?? []).length === 0}
        emptyTitle="You're all caught up."
        emptyDescription="Trip and booking updates will appear here."
      >
        <ul className="space-y-2">
          {(listQuery.data ?? [])
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!n.read) markRead.mutate(n.id);
                  }}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left shadow-soft",
                    n.read
                      ? "border-border bg-warm-white"
                      : "border-olive/30 bg-olive/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-deep-navy">{n.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                      <p className="mt-2 text-caption text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.read ? (
                      <span className="rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
        </ul>
      </DataState>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency } from "@/services/domain/booking.service";
import {
  canWithdraw,
  getWalletTransactionLabel,
} from "@/services/domain/wallet.service";
import { withdrawSchema, type WithdrawInput } from "@/schemas/wallet.schema";
import { isAppError } from "@/services/domain/errors";
import { cn } from "@/lib/utils";

export default function DriverWalletPage() {
  const { summaryQuery, transactionsQuery, withdraw } = useWallet();
  const [open, setOpen] = useState(false);
  const balance = summaryQuery.data?.balance ?? 0;
  const form = useForm<WithdrawInput>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: 0 },
  });

  async function onWithdraw(values: WithdrawInput) {
    const check = canWithdraw(values.amount, balance);
    if (!check.allowed) {
      form.setError("amount", { message: check.reason });
      return;
    }
    try {
      await withdraw.mutateAsync(values.amount);
      toast.success("Mock withdrawal recorded");
      setOpen(false);
      form.reset({ amount: 0 });
    } catch (err) {
      form.setError("root", {
        message: isAppError(err) ? err.message : "Unable to withdraw",
      });
    }
  }

  const txs = (transactionsQuery.data ?? [])
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1">Wallet</h1>
          <p className="mt-2 text-muted-foreground">
            Balance from driving-service earnings. Withdrawals are mock only.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Withdraw
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
        <p className="text-sm text-muted-foreground">Available Balance</p>
        <p className="mt-2 text-3xl font-semibold text-deep-navy">
          {summaryQuery.isLoading ? "…" : formatCurrency(balance)}
        </p>
      </div>

      <DataState
        isLoading={transactionsQuery.isLoading}
        isError={transactionsQuery.isError}
        errorMessage="Unable to load wallet transactions"
        onRetry={() => void transactionsQuery.refetch()}
        isEmpty={txs.length === 0}
        emptyTitle="No wallet transactions yet"
      >
        <ul className="space-y-2">
          {txs.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between rounded-xl border border-border bg-warm-white px-4 py-3 text-sm shadow-soft"
            >
              <div>
                <p className="font-medium text-deep-navy">
                  {getWalletTransactionLabel(tx.type)}
                </p>
                <p className="text-caption text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleString()} · {tx.status}
                </p>
              </div>
              <p
                className={cn(
                  "font-semibold",
                  tx.amount >= 0 ? "text-olive" : "text-deep-navy",
                )}
              >
                {tx.amount >= 0 ? "+" : ""}
                {formatCurrency(tx.amount)}
              </p>
            </li>
          ))}
        </ul>
      </DataState>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mock withdrawal</DialogTitle>
            <DialogDescription>
              Available balance: {formatCurrency(balance)}. This does not connect to a
              real bank.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={form.handleSubmit(onWithdraw)}>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="1"
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              ) : null}
            </div>
            {form.formState.errors.root ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={withdraw.isPending}>
                {withdraw.isPending ? "Withdrawing…" : "Confirm Withdrawal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import type { WalletTransaction } from "@/types/wallet";

export function calculateAvailableBalance(
  transactions: WalletTransaction[],
): number {
  if (!transactions.length) return 0;
  const sorted = [...transactions].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  return sorted[sorted.length - 1]?.balanceAfter ?? 0;
}

export function canWithdraw(
  amount: number,
  availableBalance: number,
): { allowed: boolean; reason?: string } {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { allowed: false, reason: "Enter a valid amount greater than zero." };
  }
  if (amount > availableBalance) {
    return {
      allowed: false,
      reason: "Amount cannot exceed your available balance.",
    };
  }
  return { allowed: true };
}

export function getWalletTransactionLabel(
  type: WalletTransaction["type"],
): string {
  const labels: Record<WalletTransaction["type"], string> = {
    TRIP_EARNING: "Trip earning",
    WITHDRAWAL: "Withdrawal",
    REFUND: "Refund",
    ADJUSTMENT: "Adjustment",
    BONUS: "Bonus",
  };
  return labels[type];
}

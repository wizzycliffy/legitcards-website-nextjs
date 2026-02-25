"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  card: string;
  amount: string;
  nairaAmount: string;
  status: string;
  date: string;
  type: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold">Recent Transactions</h3>
        <Link href="/trade-history">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                {tx.card.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{tx.card}</div>
                <div className="text-sm text-muted-foreground">{tx.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{tx.nairaAmount}</div>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full capitalize",
                  tx.status === "completed"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning",
                )}
              >
                {tx.status}
              </span>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No trades yet.
          </div>
        )}
      </div>
    </div>
  );
}

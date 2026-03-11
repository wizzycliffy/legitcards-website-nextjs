"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bitcoin, Wallet } from "lucide-react";

interface Transaction {
  id: string;
  card: string;
  amount: string;
  nairaAmount: string;
  status: string;
  date: string;
  type: "giftcard" | "crypto";
  assetImage?: string[];
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const getCryptoIcon = (name: string) => {
  const key = name?.toLowerCase() || "";
  if (key.includes("btc") || key.includes("bitcoin")) return <Bitcoin className="w-6 h-6" />;
  if (key.includes("eth") || key.includes("ethereum")) return <Wallet className="w-6 h-6" />;
  if (key.includes("usdt") || key.includes("tether")) return <span className="text-xl font-bold">₮</span>;
  return <span className="font-bold text-lg">{name?.charAt(0)}</span>;
};

const getCryptoColor = (name: string) => {
  const key = name?.toLowerCase() || "";
  if (key.includes("btc") || key.includes("bitcoin")) return "bg-orange-500/10 text-orange-500";
  if (key.includes("eth") || key.includes("ethereum")) return "bg-blue-500/10 text-blue-500";
  if (key.includes("usdt") || key.includes("tether")) return "bg-green-500/10 text-green-500";
  return "bg-primary/10 text-primary";
};

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
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden",
                  tx.type === "crypto"
                    ? getCryptoColor(tx.card)
                    : "bg-primary/10 text-primary"
                )}
              >
                {tx.type === "giftcard" ? (
                  tx.assetImage && tx.assetImage.length > 0 ? (
                    <img
                      src={tx.assetImage[0]}
                      alt={tx.card}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-sm">{tx.card?.charAt(0)}</span>
                  )
                ) : (
                  getCryptoIcon(tx.card)
                )}
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {tx.card}
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize",
                    tx.type === "crypto"
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-blue-500/10 text-blue-500"
                  )}>
                    {tx.type === "crypto" ? "Crypto" : "Gift Card"}
                  </span>
                </div>
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
                    : tx.status === "declined" || tx.status === "rejected" || tx.status === "failed"
                    ? "bg-destructive/10 text-destructive"
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

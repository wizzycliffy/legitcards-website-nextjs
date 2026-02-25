"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";

export function UserWallet() {
  const { wallet } = useAppSelector((state) => state.wallet);
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <h3 className="font-display font-semibold mb-4">Wallet</h3>
      <div className="text-3xl font-display font-bold gradient-text mb-4">
        ₦{wallet?.balance?.toLocaleString() || "0"}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link href="/withdraw" className="w-full">
          <Button variant="gradient" className="w-full">Withdraw</Button>
        </Link>
        <Link href="/trade-history" className="w-full">
          <Button variant="outline" className="w-full">History</Button>
        </Link>
      </div>
    </div>
  );
}

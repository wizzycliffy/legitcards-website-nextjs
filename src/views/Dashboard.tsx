"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  Bell,
  ChevronRight,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTrades } from "@/store/slices/tradeSlice";
import { fetchRates } from "@/store/slices/assetSlice";
import { fetchCryptoTrades } from "@/store/slices/cryptoSlice";
import { fetchWallet } from "@/store/slices/walletSlice";
import Header from "@/components/Header";
import { UserWallet } from "@/components/dashboard/UserWallet";
import { StartTradeCTA } from "@/components/dashboard/StartTradeCTA";
import { MarketRates } from "@/components/dashboard/MarketRates";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { trades, isLoading: tradesLoading } = useAppSelector((state) => state.trades);
  const { cryptoTrades } = useAppSelector((state) => state.crypto);
  const { rates } = useAppSelector((state) => state.assets);
  const { wallet } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    if (user?.userid) {
      dispatch(fetchTrades({ id: user.userid, filter: { status: "ALL" }, sort: "DESC", start: 0 }));
      dispatch(fetchCryptoTrades({ id: user.userid, filter: { status: "ALL" }, sort: "desc", start: "0" }));
      dispatch(fetchRates(user.userid));
      dispatch(fetchWallet(user.userid));
    }
  }, [dispatch, user?.userid]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const combinedTrades = [...trades, ...cryptoTrades];
  const completedTrades = combinedTrades.filter((t) => t.status === "COMPLETED");
  const pendingTrades = combinedTrades.filter((t) => t.status === "PENDING" || t.status === "ALL");
  const declinedTrades = combinedTrades.filter(
    (t) => t.status === "DECLINED" || t.status === "REJECTED" || t.status === "FAILED",
  );

  const quickStats = [
    { label: "Total Trades", value: combinedTrades.length.toString(), icon: TrendingUp, change: "", positive: true },
    { label: "Pending", value: pendingTrades.length.toString(), icon: Clock, change: "In review", positive: null },
    { label: "Completed", value: completedTrades.length.toString(), icon: CheckCircle, change: "", positive: true },
    { label: "Declined", value: declinedTrades.length.toString(), icon: Bell, change: "", positive: false },
  ];

  const allTrades = [
    ...trades.map((t) => ({ ...t, tradeType: "giftcard" })),
    ...cryptoTrades.map((t) => ({ ...t, tradeType: "crypto" })),
  ].sort((a, b) => {
    const dateA = typeof a.createdAt === "number" ? a.createdAt : new Date(a.createdAt).getTime();
    const dateB = typeof b.createdAt === "number" ? b.createdAt : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const recentTransactions = allTrades.slice(0, 5).map((t) => {
    const isCrypto = "tradeType" in t && t.tradeType === "crypto";
    return {
      id: t._id,
      card: (t as any).assetName,
      amount: `$${t.userAmount}`,
      nairaAmount: `₦${t.cost?.toLocaleString() || (t.userAmount * (t as any).rate).toLocaleString()}`,
      status: t.status.toLowerCase(),
      date: new Date(typeof t.createdAt === "number" ? t.createdAt : t.createdAt).toLocaleDateString(),
      type: isCrypto ? "crypto" : "giftcard",
    };
  });

  const uniqueRatesByName: typeof rates = [];
  for (const rate of rates) {
    if (!uniqueRatesByName.find((r) => r.asset.name === rate.asset.name)) {
      uniqueRatesByName.push(rate);
    }
  }

  const marketRates = uniqueRatesByName.slice(0, 4).map((r) => ({
    card: r.asset.name,
    rate: `₦${r.rate}/$`,
    trend: (Math.random() > 0.5 ? "up" : "down") as "up" | "down",
  }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header wallet={wallet} user={user} handleLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">
            Welcome back, {user?.email.split("@")[0]}!
          </h1>
        </div>

        {tradesLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            <UserWallet />

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <StartTradeCTA />
                <RecentTransactions transactions={recentTransactions} />
              </div>

              <div className="space-y-8">
                <MarketRates rates={marketRates} />
                <QuickStats stats={quickStats} />

                {/* Support Card */}
                <div className="bg-card rounded-2xl border border-border shadow-card p-6 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-16 h-16 text-primary" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Need Help?</div>
                      <div className="text-sm text-muted-foreground">24/7 Support</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full relative z-10 hover:bg-primary hover:text-white transition-colors"
                  >
                    Chat with us
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StartTradeCTA() {
  return (
    <div className="mb-8 p-6 rounded-2xl gradient-primary text-primary-foreground">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold mb-1">Ready to trade?</h2>
          <p className="text-primary-foreground/80">Sell your gift cards at the best rates</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/sell" className="w-full">
            <Button
              variant="glass"
              size="lg"
              className="w-full bg-white text-primary hover:bg-white/90"
            >
              Sell Gift Card
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/sell-crypto" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Sell Crypto
              <TrendingUp className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

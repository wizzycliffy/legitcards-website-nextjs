"use client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MarketRate {
  card: string;
  rate: string;
  trend: "up" | "down";
}

interface MarketRatesProps {
  rates: MarketRate[];
}

export function MarketRates({ rates }: MarketRatesProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <h3 className="font-display font-semibold mb-4">Market Rates</h3>
      <div className="space-y-3">
        {rates.map((rate, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm">{rate.card.toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{rate.rate}</span>
              {rate.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-success" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

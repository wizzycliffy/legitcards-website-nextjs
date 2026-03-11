'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const BRAND_COLORS = [
  "from-orange-400 to-orange-600",
  "from-pink-400 to-pink-600",
  "from-blue-400 to-blue-600",
  "from-green-400 to-green-600",
  "from-blue-500 to-indigo-600",
  "from-rose-400 to-rose-600",
  "from-purple-400 to-purple-600",
  "from-yellow-400 to-orange-500",
];

const BASE_URL = "https://legitcards-api.onrender.com/api";

export function SupportedCardsSection() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch assets — same endpoint as the sell page
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(`${BASE_URL}/assets/users/get/all`, {
          headers: {
            "Content-Type": "application/json",
            ...(typeof window !== "undefined" && localStorage.getItem("token")
              ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
              : {}),
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setAssets(data.data);
        }
      } catch {
        // fail silently – keep loading false
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  // Pick 8 random cards, re-randomised only when assets change
  const displayCards = useMemo(() => {
    if (assets.length === 0) return [];
    const shuffled = [...assets].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, [assets]);

  const viewAllHref = user ? "/sell" : "/login";

  return (
    <section className="py-16 md:py-24 gradient-secondary">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            200+ Brands
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Supported <span className="gradient-text">Gift Cards</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We accept gift cards from all major brands worldwide. Check our rates and start trading.
          </p>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : displayCards.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No cards available right now.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayCards.map((card, index) => (
              <div
                key={card._id}
                className="flex flex-col items-center justify-center group bg-card rounded-2xl sm:p-5 p-4 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card Icon / Image */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden ${
                    BRAND_COLORS[index % BRAND_COLORS.length]
                  }`}
                >
                  {card.images?.[0] ? (
                    <img
                      src={card.images[0]}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {card.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Card name */}
                <h3 className="font-semibold text-center leading-tight">{card.name}</h3>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href={viewAllHref}
            className="inline-block text-primary font-semibold hover:underline transition-colors"
          >
            View All 200+ Cards →
          </Link>
        </div>
      </div>
    </section>
  );
}

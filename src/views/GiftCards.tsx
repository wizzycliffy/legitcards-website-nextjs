'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Search, TrendingUp, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const giftCardCategories = [
  {
    name: "Shopping",
    cards: [
      { name: "Amazon", rate: "70-85%", logo: "🛒", popular: true },
      { name: "Walmart", rate: "65-80%", logo: "🏪", popular: true },
      { name: "Target", rate: "65-78%", logo: "🎯", popular: false },
      { name: "eBay", rate: "60-75%", logo: "🛍️", popular: false },
      { name: "Best Buy", rate: "60-75%", logo: "📱", popular: false },
      { name: "Macy's", rate: "55-70%", logo: "👗", popular: false },
    ],
  },
  {
    name: "Gaming",
    cards: [
      { name: "Steam", rate: "70-85%", logo: "🎮", popular: true },
      { name: "PlayStation", rate: "65-80%", logo: "🕹️", popular: true },
      { name: "Xbox", rate: "65-80%", logo: "🎯", popular: true },
      { name: "Nintendo", rate: "60-75%", logo: "🍄", popular: false },
      { name: "Roblox", rate: "55-70%", logo: "🧱", popular: false },
      { name: "Epic Games", rate: "55-70%", logo: "⚔️", popular: false },
    ],
  },
  {
    name: "Digital & Entertainment",
    cards: [
      { name: "iTunes/Apple", rate: "70-85%", logo: "🍎", popular: true },
      { name: "Google Play", rate: "65-80%", logo: "▶️", popular: true },
      { name: "Spotify", rate: "55-70%", logo: "🎵", popular: false },
      { name: "Netflix", rate: "50-65%", logo: "🎬", popular: false },
      { name: "Hulu", rate: "45-60%", logo: "📺", popular: false },
      { name: "Disney+", rate: "45-60%", logo: "✨", popular: false },
    ],
  },
  {
    name: "Food & Dining",
    cards: [
      { name: "Starbucks", rate: "60-75%", logo: "☕", popular: true },
      { name: "DoorDash", rate: "55-70%", logo: "🍕", popular: false },
      { name: "Uber Eats", rate: "55-70%", logo: "🍔", popular: false },
      { name: "Chipotle", rate: "50-65%", logo: "🌯", popular: false },
      { name: "Domino's", rate: "45-60%", logo: "🍕", popular: false },
      { name: "Subway", rate: "45-60%", logo: "🥪", popular: false },
    ],
  },
  {
    name: "Travel & Transportation",
    cards: [
      { name: "Uber", rate: "55-70%", logo: "🚗", popular: true },
      { name: "Lyft", rate: "50-65%", logo: "🚕", popular: false },
      { name: "Airbnb", rate: "55-70%", logo: "🏠", popular: false },
      { name: "Delta", rate: "50-65%", logo: "✈️", popular: false },
      { name: "Southwest", rate: "50-65%", logo: "🛫", popular: false },
      { name: "Hotels.com", rate: "45-60%", logo: "🏨", popular: false },
    ],
  },
  {
    name: "Prepaid & Others",
    cards: [
      { name: "Visa Prepaid", rate: "80-90%", logo: "💳", popular: true },
      { name: "Mastercard Prepaid", rate: "80-90%", logo: "💳", popular: true },
      { name: "American Express", rate: "75-85%", logo: "💳", popular: false },
      { name: "Vanilla", rate: "70-80%", logo: "🎁", popular: false },
      { name: "Sephora", rate: "55-70%", logo: "💄", popular: false },
      { name: "Nike", rate: "55-70%", logo: "👟", popular: false },
    ],
  },
];

export default function GiftCards() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = giftCardCategories.map((category) => ({
    ...category,
    cards: category.cards.filter((card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.cards.length > 0);

  const allCards = giftCardCategories.flatMap((c) => c.cards);
  const popularCards = allCards.filter((c) => c.popular);

  return (
    <MainLayout>
      <div className="min-h-screen gradient-hero">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">200+ Brands</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Supported <span className="gradient-text">Gift Cards</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our extensive list of supported gift cards. We offer competitive rates
              for all major brands. Find your card and start trading today.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search gift cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Popular Cards */}
        {!searchQuery && (
          <section className="container mx-auto px-4 pb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-semibold">Popular Cards</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularCards.map((card, idx) => (
                <Link key={idx} href="/sell">
                  <div className="glass rounded-xl p-4 text-center hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="text-3xl mb-2">{card.logo}</div>
                    <h3 className="font-medium text-sm mb-1">{card.name}</h3>
                    <p className="text-xs text-success font-medium">{card.rate}</p>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-primary flex items-center justify-center gap-1">
                        Trade <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Cards by Category */}
        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="space-y-12">
            {filteredCategories.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-xl font-display font-semibold mb-4 gradient-text">
                  {category.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {category.cards.map((card, cardIdx) => (
                    <Link key={cardIdx} href="/sell">
                      <div className="glass rounded-xl p-4 text-center hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="text-3xl mb-2">{card.logo}</div>
                        <h3 className="font-medium text-sm mb-1">{card.name}</h3>
                        <p className="text-xs text-success font-medium">{card.rate}</p>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-primary flex items-center justify-center gap-1">
                            Trade <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No gift cards found matching "{searchQuery}"</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="glass rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-display font-bold mb-3">
              Don't see your card?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're constantly adding new gift cards. Contact us and we'll add your card to our platform.
            </p>
            <Button variant="hero" size="lg">
              Request a Card
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

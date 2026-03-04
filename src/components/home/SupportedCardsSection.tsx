import { useState } from "react";
import { cn } from "@/lib/utils";

const cardCategories = ["Popular", "Gaming", "Shopping", "Entertainment", "Food"];

const giftCards = [
  { name: "Amazon", category: "Shopping", rate: "₦750/$", color: "from-orange-400 to-orange-600" },
  { name: "iTunes", category: "Entertainment", rate: "₦720/$", color: "from-pink-400 to-pink-600" },
  { name: "Steam", category: "Gaming", rate: "₦680/$", color: "from-blue-400 to-blue-600" },
  { name: "Google Play", category: "Entertainment", rate: "₦700/$", color: "from-green-400 to-green-600" },
  { name: "PlayStation", category: "Gaming", rate: "₦690/$", color: "from-blue-500 to-indigo-600" },
  { name: "Xbox", category: "Gaming", rate: "₦670/$", color: "from-green-500 to-green-700" },
  { name: "Sephora", category: "Shopping", rate: "₦650/$", color: "from-rose-400 to-rose-600" },
  { name: "Walmart", category: "Shopping", rate: "₦720/$", color: "from-blue-400 to-blue-500" },
  { name: "Uber", category: "Food", rate: "₦680/$", color: "from-gray-700 to-gray-900" },
  { name: "DoorDash", category: "Food", rate: "₦660/$", color: "from-red-400 to-red-600" },
  { name: "Netflix", category: "Entertainment", rate: "₦700/$", color: "from-red-500 to-red-700" },
  { name: "Spotify", category: "Entertainment", rate: "₦680/$", color: "from-green-400 to-green-500" },
];

export function SupportedCardsSection() {
  const [activeCategory, setActiveCategory] = useState("Popular");

  const filteredCards = activeCategory === "Popular" 
    ? giftCards.slice(0, 8) 
    : giftCards.filter(card => card.category === activeCategory);

  return (
    <section className="py-16 md:py-24 px-[1vw] gradient-secondary">
      <div className="container mx-auto px-4">
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

        {/* Category Tabs */}
        {/* <div className="flex flex-wrap justify-center gap-2 mb-12">
          {cardCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === category
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {category}
            </button>
          ))}
        </div> */}

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredCards.map((card, index) => (
            <div
              key={card.name}
              className="flex flex-col items-center justify-center group bg-card rounded-2xl sm:p-5 p-4 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                card.color
              )}>
                <span className="text-white font-bold text-lg">
                  {card.name.charAt(0)}
                </span>
              </div>
              
              {/* Card Info */}
              <h3 className="font-semibold mb-1 ">{card.name}</h3>
              <div className="flex items-center justify-between">
                {/* <span className="text-sm text-muted-foreground">{card.category}</span>
                <span className="text-sm font-semibold text-primary">{card.rate}</span> */}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="text-primary font-semibold hover:underline">
            View All 200+ Cards →
          </button>
        </div>
      </div>
    </section>
  );
}

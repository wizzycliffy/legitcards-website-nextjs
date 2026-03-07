import { Shield, Zap, HeadphonesIcon, TrendingUp, Lock, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get paid within 5 minutes of approval. No long waits, just instant cash to your account.",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Bank-level encryption protects your data. Your transactions are always safe with us.",
  },
  {
    icon: TrendingUp,
    title: "Best Rates",
    description: "We offer the most competitive rates in the market. Check our live rates anytime.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our support team is always available to help you with any questions or issues.",
  },
  {
    icon: Lock,
    title: "Verified Platform",
    description: "We're a licensed and regulated platform. Trade with confidence and peace of mind.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Trade on the go with our mobile-optimized platform. Available on all devices.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-24 px-[1vw] bg-background">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              The Most <span className="gradient-text">Trusted</span> Gift Card Platform
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of satisfied customers who trust LegitCards for their gift card trading needs. 
              We've processed over $10 million in trades with a 99.9% satisfaction rate.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center sm:p-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="sm:text-3xl text-2xl font-display font-bold gradient-text">100K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center sm:p-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="sm:text-3xl text-2xl font-display font-bold gradient-text">$10M+</div>
                <div className="text-sm text-muted-foreground">Traded</div>
              </div>
              <div className="text-center sm:p-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="sm:text-3xl text-2xl font-display font-bold gradient-text">99.9%</div>
                <div className="text-sm text-muted-foreground">Satisfied</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

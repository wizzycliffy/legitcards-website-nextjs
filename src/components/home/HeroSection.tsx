import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleStartTrading = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  return (
    <section className="relative px-[1vw] -mt-6 overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 100,000+ users</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Convert Your{" "}
              <span className="gradient-text">Gift Cards</span>
              {" "}to Cash Instantly
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Trade gift cards from 200+ brands at the best rates. Fast, secure, and hassle-free. 
              Get paid directly to your bank account within minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full h-[50px] md:rounded-2xl rounded-lg sm:w-auto group"
                onClick={handleStartTrading}
              >
                Start Trading
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              {!isAuthenticated && (
                <Link href="/signup">
                  <Button variant="outline" size="xl" className="w-full h-[50px] md:rounded-2xl rounded-lg sm:w-auto">
                    Create Account
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-success" />
                </div>
                <span>Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span>Instant Payouts</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative hidden lg:block animate-float">
            <div className="relative z-10">
              {/* Floating cards mockup */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 rounded-2xl gradient-primary shadow-glow transform rotate-6 animate-pulse-glow">
                  <div className="p-6 text-primary-foreground">
                    <div className="text-xs opacity-80 mb-2">GIFT CARD</div>
                    <div className="text-2xl font-bold">$500</div>
                    <div className="mt-8 text-sm opacity-80">**** **** **** 4567</div>
                  </div>
                </div>
                
                {/* Secondary card */}
                <div className="absolute top-1/3 left-1/4 w-64 h-40 rounded-2xl bg-card border border-border shadow-card transform -rotate-12">
                  <div className="p-5">
                    <div className="text-xs text-muted-foreground mb-2">AMAZON</div>
                    <div className="text-xl font-bold">$250</div>
                    <div className="mt-6 flex gap-2">
                      <div className="w-8 h-6 rounded bg-primary/20" />
                      <div className="w-8 h-6 rounded bg-accent/20" />
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-10 right-10 w-16 h-16 rounded-full gradient-primary opacity-50 blur-sm animate-bounce-subtle" />
                <div className="absolute bottom-20 left-10 w-12 h-12 rounded-full bg-accent/30 blur-sm animate-bounce-subtle" style={{ animationDelay: "1s" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

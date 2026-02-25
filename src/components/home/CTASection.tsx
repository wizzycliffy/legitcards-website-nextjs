import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ctabackground from "@/assets/ctabackground.jpg";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-[1vw] bg-no-repeat bg-cover bg-blend-darken bg-[#20042044]/80" 
     
      style={{ backgroundImage: `url(${ctabackground})`  
    }}>
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl  p-8 md:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
              Ready to Trade Your Gift Cards?
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Join over 100,000 users who trust GiftFlow. Start trading today and get instant cash for your gift cards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sell">
                <Button 
                  variant="glass" 
                  size="xl" 
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 group"
                >
                  Start Trading Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full sm:w-auto border-white/30 text-primary-foreground hover:bg-white/10"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

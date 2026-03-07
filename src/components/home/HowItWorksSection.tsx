import { Upload, CreditCard, Wallet, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    title: "Select Your Card",
    description: "Choose from over 200+ supported gift card brands including Amazon, iTunes, Steam, and more.",
    step: "01",
  },
  {
    icon: Upload,
    title: "Upload & Submit",
    description: "Take a clear photo of your gift card and enter the card details. Our AI verifies in seconds.",
    step: "02",
  },
  {
    icon: Wallet,
    title: "Get Paid Instantly",
    description: "Receive your cash directly to your bank account or wallet within minutes. No waiting!",
    step: "03",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 px-[2vw] bg-background">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trade your gift cards in three easy steps. No hassle, no delays, just instant cash.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 sm:p-0 p-3 gap-9 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-card border  rounded-2xl sm:p-8 p-6  border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 sm:w-12 w-11 sm:h-12 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-glow">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {/* Arrow for non-last items */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border items-center justify-center z-10">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

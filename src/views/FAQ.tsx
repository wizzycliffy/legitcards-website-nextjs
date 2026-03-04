'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I sell my gift card?",
        a: "Simply create an account, select the gift card brand you want to sell, enter the card details, upload images of your card, and submit. Our team will verify and process your trade within minutes.",
      },
      {
        q: "What gift cards do you accept?",
        a: "We accept over 200+ gift card brands including Amazon, iTunes, Google Play, Steam, PlayStation, Xbox, Walmart, Target, and many more. Check our Gift Cards page for the full list.",
      },
      {
        q: "How long does verification take?",
        a: "Most gift cards are verified within 5-15 minutes during business hours. Complex verifications may take up to 24 hours.",
      },
    ],
  },
  {
    category: "Payments & Rates",
    questions: [
      {
        q: "How do I receive payment?",
        a: "Payments are sent directly to your registered bank account. We support all major banks and payment methods.",
      },
      {
        q: "What determines the exchange rate?",
        a: "Rates vary based on the gift card brand, card value, and current market conditions. We always display the current rate before you confirm a trade.",
      },
      {
        q: "Is there a minimum or maximum trade amount?",
        a: "Minimum trade value is $10. Maximum depends on your account verification level. Fully verified accounts can trade up to $10,000 per transaction.",
      },
    ],
  },
  {
    category: "Security & Trust",
    questions: [
      {
        q: "Is my information safe?",
        a: "Absolutely. We use bank-level 256-bit encryption to protect your data. All transactions are secured and monitored for fraud.",
      },
      {
        q: "Why do I need to verify my identity?",
        a: "Identity verification helps us prevent fraud and ensures the safety of all users. It also unlocks higher trading limits for your account.",
      },
      {
        q: "What if my card is declined?",
        a: "If a card is declined, we'll notify you immediately with the reason. Common issues include invalid codes, already redeemed cards, or regional restrictions.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I contact support?",
        a: "You can reach our support team 24/7 via live chat on our platform, email at : support@legitcards.com.ng, or through our support ticket system.",
      },
      {
        q: "Can I cancel a trade?",
        a: "Trades can be cancelled before verification begins. Once verification starts, cancellation may not be possible. Contact support immediately if needed.",
      },
      {
        q: "How do I update my bank details?",
        a: "Go to your Profile page, navigate to Bank Details, and update your information. Changes may require re-verification for security.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <MainLayout>
      <div className="min-h-screen gradient-hero">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about trading gift cards on LegitCards.
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((category, idx) => (
              <div key={idx} className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-display font-semibold mb-6 gradient-text">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, qIdx) => (
                    <AccordionItem
                      key={qIdx}
                      value={`${idx}-${qIdx}`}
                      className="border border-border/50 rounded-xl px-4 data-[state=open]:bg-muted/30"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 text-center">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our support team is available 24/7 to help you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Link href={'/contact'}> Contact Support </Link>
              </Button>
              <Link href="/signup">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

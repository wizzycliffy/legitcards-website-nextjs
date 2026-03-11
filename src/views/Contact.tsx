'use client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Mail, Phone, Globe, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 lg:px-10 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              At LegitCards, we are committed to providing fast, reliable, and secure services. Our support team is always available to assist you with any questions, transactions, or technical issues.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Customer Support */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display font-semibold mb-2">Customer Support</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Need help with your account, a pending transaction, or any other issue? Our support team is ready to help.
              </p>
              <div className="space-y-2">
                <a href="mailto:support@legitcards.com.ng" className="flex items-center gap-2 text-primary hover:underline font-medium">
                  <Mail className="w-4 h-4" /> support@legitcards.com.ng
                </a>
                <a href="tel:+2348060517997" className="flex items-center gap-2 text-primary hover:underline font-medium">
                  <Phone className="w-4 h-4" /> +234-806-051-7997
                </a>
              </div>
            </div>

            {/* Business Inquiries */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display font-semibold mb-2">Business Inquiries</h2>
              <p className="text-muted-foreground text-sm mb-4">
                For partnerships, collaborations, or business-related inquiries, please contact us through our official email.
              </p>
              <div className="space-y-2">
                <a href="mailto:support@legitcards.com.ng" className="flex items-center gap-2 text-primary hover:underline font-medium">
                  <Mail className="w-4 h-4" /> support@legitcards.com.ng
                </a>
                <a href="https://legitcards.com.ng" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline font-medium">
                  <Globe className="w-4 h-4" /> legitcards.com.ng
                </a>
              </div>
            </div>
          </div>

          {/* Live Chat CTA */}
          <div className="gradient-primary rounded-2xl p-8 text-center text-white">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">24/7 Live Chat</h2>
            <p className="text-white/80 mb-6">
              LegitCards — The Trusted Platform to Sell Gift Cards and Bitcoin in Nigeria.
            </p>
            <a
              href="mailto:support@legitcards.com.ng"
              className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-all"
            >
              Send us a Message
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

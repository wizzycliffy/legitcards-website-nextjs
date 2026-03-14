'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppDownloadButtons } from '@/components/AppDownloadButtons';
import { DownloadAppCTA } from '@/components/shared/DownloadAppCTA';
import {
  ShieldCheck,
  Zap,
  Users,
  BadgeCheck,
  Star,
  Lock,
  HeadphonesIcon,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Fast & Secure Transactions',
    description: 'Every trade is handled with security-first systems ensuring your money and data are always protected.',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Exchange Rates',
    description: 'Get the best competitive gift card exchange rates in Nigeria — transparent and with no hidden fees.',
  },
  {
    icon: BadgeCheck,
    title: 'Reliable Bitcoin Trading',
    description: 'Trade Bitcoin for Naira securely with instant, direct-to-bank payments.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Responsive Customer Support',
    description: 'Our support team is always available to assist you through any challenge.',
  },
  {
    icon: Lock,
    title: 'Platform Built for Safety',
    description: 'Designed to protect users from the scams and risks common in online trading.',
  },
  {
    icon: Zap,
    title: 'Instant Cash Payments',
    description: 'Convert unused gift cards to Naira quickly and receive payment directly to your bank account.',
  },
];

const supportedCards = ['iTunes', 'Amazon', 'Steam', 'Tremendous Visa', 'Apple'];

export default function AboutUs() {
  return (
    <MainLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-primary text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative container mx-auto px-6 lg:px-10 py-24 max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-4">About Us</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Welcome to <span className="text-white/90 underline decoration-white/30">LegitCards</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto leading-relaxed">
            LegitCards is a trusted digital platform that provides a secure and convenient way for people
            in Nigeria to sell gift cards and trade Bitcoin for instant Naira. Our mission is simple —
            to make digital asset trading safe, fast, and accessible for everyone.
          </p>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built to Solve a Real Problem</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In a market where many people fear getting scammed while trying to sell gift cards
                online, LegitCards was created to offer a reliable and transparent solution. We are
                committed to helping our users convert their unused digital assets into real money
                with confidence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We also continuously improve our platform to provide a secure and smooth experience
                for all users.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Trusted Users', value: '10,000+' },
                { label: 'Gift Card Brands', value: '200+' },
                { label: 'Bitcoin Traded', value: '100M+ ₦' },
                { label: 'Uptime', value: '24/7' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-6 lg:px-10 max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Our Mission</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What Drives Us Every Day</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-4">
            Our mission is to build Nigeria's most reliable gift card and cryptocurrency trading
            platform, where users can easily convert gift cards to Naira, trade bitcoin securely,
            and enjoy fast payments without stress.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We believe everyone should have access to a safe and trusted marketplace for digital assets.
          </p>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-10 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-bold">How LegitCards Helps You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              'Sell gift cards online for Naira',
              'Trade Bitcoin safely and securely',
              'Convert unused gift cards into instant cash',
              'Access competitive and transparent exchange rates',
              'Complete transactions quickly and securely',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-center">
            Our platform supports many popular gift cards, including{' '}
            {supportedCards.map((card, i) => (
              <span key={card}>
                <strong className="text-foreground">{card}</strong>
                {i < supportedCards.length - 1 ? ', ' : ''}
              </span>
            ))}{' '}
            and other international gift cards.
          </p>
        </div>
      </section>

      {/* ── Why Choose LegitCards ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-6 lg:px-10 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LegitCards</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thousands of users choose LegitCards because we prioritize trust, security, and speed.
              We understand the concerns many Nigerians have about online trading platforms, which is
              why we have built our services around transparency and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Our goal is to provide a stress-free trading experience so you can confidently convert
            your digital assets into cash.
          </p>
        </div>
      </section>

      {/* ── Our Commitment to Security ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-10 max-w-6xl">
          <div className="rounded-3xl gradient-primary text-white p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">Security First</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Commitment to Security</h2>
              <p className="text-white/85 leading-relaxed mb-4">
                At LegitCards, protecting our users is a top priority. We implement strong security
                measures and secure systems to ensure that every transaction on our platform is
                handled safely.
              </p>
              <p className="text-white/85 leading-relaxed">
                We also continuously improve our platform to provide a secure and smooth experience
                for all users.
              </p>
            </div>
            <div className="shrink-0 w-28 h-28 rounded-3xl bg-white/20 flex items-center justify-center">
              <Lock className="w-14 h-14 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Join Thousands ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-6 lg:px-10 max-w-6xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background gradient-primary flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Community</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of Trusted Users</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            LegitCards has become a growing community of users who trust our platform to sell gift
            cards and trade Bitcoin in Nigeria. Whether you have a gift card you no longer need or
            want to exchange bitcoin for Naira, LegitCards makes the process simple and reliable.
          </p>

          {/* CTA */}
          <div className="bg-card border border-border rounded-2xl p-10 mt-4 max-w-xl mx-auto shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Get Started Today</p>
            <h3 className="text-2xl font-bold mb-3">Ready to turn your gift cards into cash?</h3>
            <p className="text-muted-foreground mb-6">
              Create an account today and experience why many people consider LegitCards one of the
              most trusted platforms to sell gift cards and bitcoin in Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-11 px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-sm"
              >
                Create an Account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-11 px-8 rounded-xl border border-border hover:bg-muted font-semibold transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DownloadAppCTA />
    </MainLayout>
  );
}

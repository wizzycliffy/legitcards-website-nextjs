'use client';

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Gift, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppDownloadButtons } from "@/components/AppDownloadButtons";

const footerLinks = {
  company: [
    { name: "About Us", path: "/about" },
    // { name: "Careers", path: "/careers" },
    // { name: "Press", path: "/press" },
    { name: "Blog", path: "/blog" },
  ],
  support: [
    // { name: "Help Center", path: "/help" },
    { name: "Contact Us", path: "/contact" },
    { name: "FAQs", path: "/faq" },
    { name: "Live Chat", path: "/chat" },
  ],
  legal: [
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "AML Policy", path: "/aml" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 lg:px-10 py-12 md:py-16">

        {/* Top Grid */}
        <div className="
          grid gap-10
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
        ">

          {/* Brand / Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">
                Legitcard
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
              The fastest and most secure platform to trade your gift cards for
              instant cash. Join over 100,000 satisfied users today.
            </p>

            {/* App Download Call to Action */}
            <div className="mb-8 pt-2">
              <p className="font-display font-semibold mb-4">Trade on the Go</p>
              <AppDownloadButtons buttonClassName="scale-90 origin-left" />
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@legitcards.com.ng</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+234-806-051-7997</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>NO.1, Nanka Street, Lakowe, Lekki, Lagos State, 105101</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="
          mt-12 pt-6 border-t border-border
          flex flex-col gap-4
          md:flex-row md:items-center md:justify-between
        ">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Legitcard. All rights reserved.
          </p>

          <p className="text-sm text-muted-foreground text-center md:text-left">"All third-party trademarks appearing on this website are the property of their respective owners. Legitcards is not affiliated to or endorsed by any brand who's trademarks or gift cards appears on this website."</p>

          <div className="flex justify-center md:justify-end gap-2">
            {socialLinks.map((social, index) => (
              <Button key={index} variant="ghost" size="icon" asChild>
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <social.icon className="w-4 h-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

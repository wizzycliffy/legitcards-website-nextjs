import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LegitCards - Sell Gift Cards & Crypto for Naira',
    template: '%s | LegitCards',
  },
  description:
    'Sell your gift cards and cryptocurrency for Nigerian Naira. Fast, secure, and trusted by thousands of Nigerians.',
  keywords: [
    'sell gift cards Nigeria',
    'gift card exchange Nigeria',
    'sell crypto Nigeria',
    'gift card to naira',
    'buy gift cards naira',
    'Amazon gift card Nigeria',
    'iTunes gift card Nigeria',
  ],
  metadataBase: new URL('https://legitcards.onrender.com'),
  openGraph: {
    siteName: 'LegitCards',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@legitcards',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

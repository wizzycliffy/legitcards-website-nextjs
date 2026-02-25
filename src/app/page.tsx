import type { Metadata } from 'next';
import Index from '@/pages/Index';

export const metadata: Metadata = {
  title: 'LegitCards - Sell Gift Cards & Crypto for Naira',
  description:
    'Sell your Amazon, iTunes, Steam, Google Play, and other gift cards for Nigerian Naira. Also sell Bitcoin, Ethereum, and USDT. Fast, secure, and reliable.',
  keywords: [
    'sell gift cards Nigeria',
    'gift card exchange Nigeria',
    'sell crypto Nigeria',
    'Amazon gift card Naira',
    'iTunes gift card Nigeria',
    'Bitcoin to Naira',
  ],
  openGraph: {
    title: 'LegitCards - Sell Gift Cards & Crypto for Naira',
    description:
      'Trade gift cards and cryptocurrency for Nigerian Naira instantly. Trusted by thousands of Nigerians.',
    type: 'website',
    url: 'https://legitcards.onrender.com',
  },
  twitter: {
    title: 'LegitCards - Sell Gift Cards & Crypto for Naira',
    description: 'Trade gift cards and cryptocurrency for Nigerian Naira instantly.',
  },
};

export default function Page() {
  return <Index />;
}

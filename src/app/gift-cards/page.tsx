import type { Metadata } from 'next';
import GiftCards from '@/pages/GiftCards';

export const metadata: Metadata = {
  title: 'Gift Cards - Supported Cards & Live Rates',
  description:
    'View all supported gift cards and current exchange rates in Nigerian Naira. Sell Amazon, iTunes, Steam, Google Play, Visa, eBay, and many more gift cards instantly.',
  keywords: [
    'gift card rates Nigeria',
    'Amazon gift card Nigeria rate',
    'iTunes gift card Naira',
    'Steam gift card Nigeria',
    'Google Play gift card Nigeria',
    'gift card exchange rates',
  ],
  openGraph: {
    title: 'Gift Cards & Live Rates | LegitCards',
    description: 'View all supported gift cards and current exchange rates in Nigerian Naira.',
    type: 'website',
    url: 'https://legitcards.onrender.com/gift-cards',
  },
};

export default function Page() {
  return <GiftCards />;
}

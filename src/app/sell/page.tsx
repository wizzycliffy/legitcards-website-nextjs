import type { Metadata } from 'next';
import SellGiftCard from '@/views/SellGiftCard';

export const metadata: Metadata = {
  title: 'Sell Gift Card - Trade for Nigerian Naira',
  description:
    'Sell your gift cards for Nigerian Naira instantly. Supported cards: Amazon, iTunes, Steam, Google Play, Visa, eBay, and more. Secure and fast payments.',
  keywords: [
    'sell gift card Nigeria',
    'trade gift card Naira',
    'sell Amazon gift card Nigeria',
    'sell iTunes gift card Naira',
    'gift card for Naira',
  ],
  openGraph: {
    title: 'Sell Gift Card | LegitCards',
    description: 'Sell your gift cards for Nigerian Naira instantly. Fast and secure.',
    type: 'website',
    url: 'https://legitcards.onrender.com/sell',
  },
};

export default function Page() {
  return <SellGiftCard />;
}

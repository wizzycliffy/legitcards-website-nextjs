import type { Metadata } from 'next';
import FAQ from '@/views/FAQ';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Get answers to common questions about selling gift cards and cryptocurrency on LegitCards. Learn about our rates, payment process, and how to get started.',
  keywords: [
    'LegitCards FAQ',
    'how to sell gift cards Nigeria',
    'gift card exchange questions',
    'LegitCards help',
    'sell crypto Nigeria questions',
  ],
  openGraph: {
    title: 'FAQ | LegitCards',
    description: 'Answers to common questions about selling gift cards and crypto on LegitCards.',
    type: 'website',
    url: 'https://legitcards.onrender.com/faq',
  },
};

export default function Page() {
  return <FAQ />;
}

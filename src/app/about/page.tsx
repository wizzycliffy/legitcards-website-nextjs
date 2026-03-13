import type { Metadata } from 'next';
import AboutUs from '@/views/AboutUs';

export const metadata: Metadata = {
  title: 'About Us - LegitCards',
  description:
    'Learn about LegitCards — Nigeria\'s trusted platform for selling gift cards and trading Bitcoin for instant Naira. Fast, secure, and transparent.',
  keywords: [
    'about LegitCards',
    'sell gift cards Nigeria',
    'Bitcoin trading Nigeria',
    'gift card exchange Nigeria',
    'legit gift card platform',
  ],
  openGraph: {
    title: 'About Us | LegitCards',
    description: 'Nigeria\'s most trusted platform for selling gift cards and trading Bitcoin for Naira.',
    type: 'website',
    url: 'https://legitcards.onrender.com/about',
  },
};

export default function Page() {
  return <AboutUs />;
}

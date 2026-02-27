import type { Metadata } from 'next';
import Signup from '@/views/Signup';

export const metadata: Metadata = {
  title: 'Sign Up - Create Your Free Account',
  description:
    'Create your free LegitCards account and start selling gift cards and cryptocurrency for Nigerian Naira today. Quick registration in minutes.',
  openGraph: {
    title: 'Sign Up | LegitCards',
    description: 'Create your free account and start trading today.',
    type: 'website',
  },
};

export default function Page() {
  return <Signup />;
}

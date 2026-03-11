import type { Metadata } from 'next';
import Contact from '@/views/Contact';

export const metadata: Metadata = {
  title: 'Contact Us | LegitCards',
  description: 'Get in touch with LegitCards support. We are available 24/7 to help with your gift card trading and crypto transactions.',
};

export default function Page() {
  return <Contact />;
}

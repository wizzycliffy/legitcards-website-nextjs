import type { Metadata } from 'next';
import PrivacyPolicy from '@/views/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy | LegitCards',
  description: 'Read the LegitCards privacy policy to understand how we collect, use, and protect your personal data.',
};

export default function Page() {
  return <PrivacyPolicy />;
}

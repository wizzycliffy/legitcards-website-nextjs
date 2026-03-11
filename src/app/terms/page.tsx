import type { Metadata } from 'next';
import TermsOfService from '@/views/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service | LegitCards',
  description: 'Read the LegitCards Terms of Service to understand the rules and conditions for using our platform.',
};

export default function Page() {
  return <TermsOfService />;
}

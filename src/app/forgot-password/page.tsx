import type { Metadata } from 'next';
import ForgotPassword from '@/pages/ForgotPassword';

export const metadata: Metadata = {
  title: 'Forgot Password - Reset Your Account',
  description: 'Reset your LegitCards account password quickly and securely.',
};

export default function Page() {
  return <ForgotPassword />;
}

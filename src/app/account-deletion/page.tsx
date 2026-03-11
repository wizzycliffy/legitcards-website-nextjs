import type { Metadata } from 'next';
import AccountDeletion from '@/views/AccountDeletion';

export const metadata: Metadata = {
  title: 'Account Deletion | LegitCards',
  description: 'Learn how to delete your LegitCards account and all associated data.',
};

export default function Page() {
  return <AccountDeletion />;
}

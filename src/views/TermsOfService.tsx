'use client';
import { MainLayout } from '@/components/layout/MainLayout';

export default function TermsOfService() {
  const sections = [
    {
      title: 'General Terms',
      content: `This website, legitCards.com, is operated and controlled by Legitcards Ltd. Throughout the site, the terms "we", "us" and "our" refer to Legitcards Ltd, owner of the website, inclusive of all information posted and services provided to the user. By visiting our site and/or engaging in the purchase and sale of gift cards and Bitcoins, the user is binding themselves to the following terms and conditions.`,
    },
    {
      title: 'Jurisdiction',
      content: `legitCards.com falls under the remits of Legitcards Ltd, which is a limited company incorporated and based in Nigeria, therefore the laws of Nigeria shall apply to all legitCards.com activities. Failure to comply with these laws will result in immediate expulsion from this site, without necessitating any forewarning.`,
    },
    {
      title: 'Revisions & Updates',
      content: `Any revisions, changes and updates made to this website shall be subject to the terms of service listed on this page. It is the user's responsibility to ensure they have notice of the latest terms of service prior to engaging in any activities. By continuing to engage with the website in any manner equates to your acceptance of these terms and conditions.`,
    },
    {
      title: 'Pricing',
      content: `By transacting on legitCards.com you agree that the shown prices are only estimates, and that the actual price you will get will be the effective market price plus any commissions at the time of completion of the transaction. Listed prices are subject to change without any notice. We shall not be liable for any changes to price.`,
    },
    {
      title: 'Breach of Terms',
      content: `A breach or violation of any of the Terms will result in an immediate termination of your Services. We reserve the right to refuse service to anyone for any reason at any time. Minimum and maximum purchase and/or sale order amounts are subject to change without notice; we reserve the right to deny any transaction on the basis of it not satisfying these thresholds.`,
    },
    {
      title: 'Wallet Address Accuracy',
      content: `It is the customer's responsibility to ensure the correct wallet address has been used. Failure to do so is wholly to the loss of the customer and we cannot be held responsible for any loss resulting from this, or any loss to any third party as a consequence of the inaccuracy.`,
    },
    {
      title: 'Limitation of Liability',
      content: `In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.`,
    },
    {
      title: 'Account Deletion',
      content: `Users have the right to delete their LegitCards account at any time. You can delete your account using the "Delete Account" button in the Profile section of both our mobile app and website. Alternatively, contact our customer support team at support@legitcards.com.ng with the subject line "Account Deletion Request." Once confirmed, your account and all associated personal data will be permanently deleted within 30 days, except for information we are legally required to retain. After account deletion: you will no longer be able to access your account or transaction history; any pending transactions must be completed or canceled before deletion; deleted accounts cannot be restored.`,
    },
    {
      title: 'Website Availability',
      content: `Every effort is made to keep the website up and running smoothly. However, LegitCards.com.ng takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.`,
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 lg:px-10 max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Terms of Service</h1>
            <p className="text-muted-foreground">
              By using LegitCards, you agree to the terms outlined below. If you do not agree or cannot adhere to any terms, you may not access any LegitCards service.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-display font-semibold mb-3">{index + 1}. {section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <p className="text-muted-foreground">Questions about the Terms of Service should be sent to us at:</p>
            <a href="mailto:support@legitcards.com.ng" className="text-primary font-semibold hover:underline">
              support@legitcards.com.ng
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

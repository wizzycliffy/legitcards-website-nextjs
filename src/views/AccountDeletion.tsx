'use client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Smartphone, Mail, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AccountDeletion() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 lg:px-10 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Account Deletion</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We respect your privacy and your right to delete your account. You can delete your LegitCards account and all associated data using either of the two methods below.
            </p>
          </div>

          <div className="space-y-6 mb-10">
            {/* Method 1 — Mobile App */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-semibold">Delete Through Mobile App</h2>
                  <p className="text-sm text-muted-foreground">Quickest method</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                You can delete your account directly from the LegitCards mobile app by following these simple steps:
              </p>
              <ol className="space-y-3">
                {[
                  'Login to the LegitCards mobile app',
                  'Go to Profile',
                  'Select Advance',
                  'Tap on Account Deletion',
                  'Click Delete My Account',
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Method 2 — Email */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-semibold">Email Support Team</h2>
                  <p className="text-sm text-muted-foreground">Alternative method</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Alternatively, you can send an email to our support team to request account deletion:
              </p>
              <div className="bg-muted/40 rounded-xl p-4 space-y-2 text-sm mb-5">
                <div><strong>Email:</strong> <a href="mailto:support@legitcards.com.ng" className="text-primary hover:underline">support@legitcards.com.ng</a></div>
                <div><strong>Subject:</strong> Account Deletion</div>
                <div><strong>Body:</strong> Request for your account and all associated data to be permanently deleted</div>
              </div>
              <a
                href="mailto:support@legitcards.com.ng?subject=Account%20Deletion&body=Hello%20LegitCards%20Support%2C%0A%0AI%20would%20like%20to%20request%20the%20deletion%20of%20my%20account%20and%20all%20associated%20data.%0A%0AThank%20you."
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
              >
                <Mail className="w-4 h-4" />
                Send Email Now
              </a>
            </div>
          </div>

          {/* Warnings */}
          <div className="space-y-4">
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Important Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Account deletion is <strong>permanent and irreversible</strong>. Once your account is deleted, you will not be able to recover your data, transaction history, or any other information associated with your account. Please make sure you want to proceed before requesting deletion.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Data Deletion Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    All your personal data will be permanently deleted from LegitCards within <strong>48 hours</strong> of your deletion request. We do not keep any of your data after deletion. Your privacy and data security are our top priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

'use client';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 lg:px-10 max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: October 27, 2025</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              At LegitCards.com.ng, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your information when you use our website, mobile app, and related services. By using LegitCards, you agree to the terms outlined in this policy.
            </p>

            {/* Table of Contents */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ol className="space-y-1 text-primary">
                {['Information We Collect', 'How We Use Your Information', 'Data Sharing and Disclosure', 'Data Security', 'Your Privacy Rights', 'Data Retention', "Children's Privacy", 'Policy Updates', 'Contact Us'].map((item, i) => (
                  <li key={i}><a href={`#section-${i + 1}`} className="hover:underline">{i + 1}. {item}</a></li>
                ))}
              </ol>
            </div>

            <section id="section-1">
              <h2 className="text-2xl font-display font-bold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-3">We may collect the following categories of personal and technical information from our users:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    {['Full Name', 'Email Address', 'User ID', 'Phone Number', 'Gender'].map(item => <li key={item} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{item}</li>)}
                  </ul>
                </div>
                <div className="bg-muted/40 rounded-xl p-5">
                  <h3 className="font-semibold mb-3">App Information & Performance</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    {['Crash Logs', 'Diagnostics Data', 'App Activity (in-app actions and usage patterns)'].map(item => <li key={item} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section id="section-2">
              <h2 className="text-2xl font-display font-bold mb-4">2. How We Use Your Information</h2>
              <ul className="space-y-2 text-muted-foreground">
                {['Provide and improve our services.', 'Personalize your experience within the app.', 'Manage and verify user accounts.', 'Communicate with users regarding transactions, support, and updates.', 'Enhance app performance and fix bugs or crashes.', 'Conduct analytics and research to improve user experience.', 'For lawful marketing and promotional purposes.'].map(item => (
                  <li key={item} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />{item}</li>
                ))}
              </ul>
            </section>

            <section id="section-3">
              <h2 className="text-2xl font-display font-bold mb-4">3. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-4">LegitCards.com.ng may share certain user data with third parties under the following circumstances:</p>
              <div className="space-y-3">
                <div className="border border-border rounded-xl p-4"><strong>Marketing and Advertising:</strong> <span className="text-muted-foreground">We may share limited data with trusted marketing partners to provide personalized offers and updates.</span></div>
                <div className="border border-border rounded-xl p-4"><strong>Developer and Technical Services:</strong> <span className="text-muted-foreground">We may share crash logs or diagnostics with service providers to improve app stability and performance.</span></div>
              </div>
              <p className="text-muted-foreground mt-4">Whenever data is shared, we do so using secure, encrypted methods. <strong>We do not sell or rent personal data to unauthorized third parties.</strong></p>
            </section>

            <section id="section-4">
              <h2 className="text-2xl font-display font-bold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">We implement advanced security measures to protect your data from unauthorized access, alteration, or misuse. This includes encryption, secure data storage, and limited employee access to sensitive information.</p>
            </section>

            <section id="section-5">
              <h2 className="text-2xl font-display font-bold mb-4">5. Your Privacy Rights</h2>
              <p className="text-muted-foreground mb-3">You have the right to:</p>
              <ul className="space-y-2 text-muted-foreground">
                {['Access and review your personal data.', 'Request correction or deletion of your information.', 'Withdraw consent for data processing where applicable.'].map(item => (
                  <li key={item} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />{item}</li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">To exercise these rights, please contact us at <a href="mailto:support@legitcards.com.ng" className="text-primary hover:underline">support@legitcards.com.ng</a> or use the "Delete Account" button in the Profile section of our app or website.</p>
            </section>

            <section id="section-6">
              <h2 className="text-2xl font-display font-bold mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground">We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, or resolve disputes. After this period, your data will be securely deleted or anonymized.</p>
            </section>

            <section id="section-7">
              <h2 className="text-2xl font-display font-bold mb-4">7. Children's Privacy</h2>
              <p className="text-muted-foreground">LegitCards.com.ng does not knowingly collect personal information from individuals under the age of 13. If we learn that we have collected such information inadvertently, we will promptly delete it.</p>
            </section>

            {/* Cookie Policy */}
            <div className="bg-card border border-border rounded-2xl p-6 mt-10">
              <h2 className="text-2xl font-display font-bold mb-6">Cookie Policy</h2>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-2">1. What Are Cookies?</h3>
                  <p className="text-muted-foreground">Cookies are small text files placed on your device when you visit a website. They help websites function properly, improve user experience, and provide useful information to website owners.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">2. How LegitCards Uses Cookies</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    {['Ensure the website functions properly', 'Remember user preferences and login sessions', 'Improve website performance and user experience', 'Understand how visitors interact with our website', 'Provide personalized content and services', 'Support marketing and promotional activities'].map(item => (
                      <li key={item} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">3. Types of Cookies We Use</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Essential Cookies', desc: 'Necessary for the website to function. They enable core features such as account login, security, and transaction processing.' },
                      { name: 'Performance & Analytics Cookies', desc: 'Help us understand how visitors use our website by collecting data on pages visited, time spent, and errors encountered.' },
                      { name: 'Functional Cookies', desc: 'Allow the website to remember your preferences and settings for a more personalized experience.' },
                      { name: 'Marketing Cookies', desc: 'Used to deliver relevant promotions and advertisements, measuring the effectiveness of marketing campaigns.' },
                    ].map(({ name, desc }) => (
                      <div key={name} className="border border-border rounded-xl p-4">
                        <h4 className="font-semibold mb-1">{name}</h4>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">4. Managing Your Cookie Preferences</h3>
                  <p className="text-muted-foreground">Most web browsers allow you to view, delete, block, or disable cookies. Please note that disabling certain cookies may affect the functionality of the LegitCards website.</p>
                </section>
              </div>
            </div>

            <section id="section-8">
              <h2 className="text-2xl font-display font-bold mb-4">8. Policy Updates</h2>
              <p className="text-muted-foreground">We may update this Privacy Policy from time to time. All updates will be posted on this page, and continued use of our app after changes are made will signify your acceptance of the revised terms.</p>
            </section>

            <section id="section-9">
              <h2 className="text-2xl font-display font-bold mb-4">9. Contact Us</h2>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <p className="text-muted-foreground mb-3">If you have any questions or concerns regarding this Privacy Policy, please contact us:</p>
                <div className="space-y-1">
                  <p><strong>Email:</strong> <a href="mailto:support@legitcards.com.ng" className="text-primary hover:underline">support@legitcards.com.ng</a></p>
                  <p><strong>Website:</strong> <a href="https://legitcards.com.ng" className="text-primary hover:underline">legitcards.com.ng</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

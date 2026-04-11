import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from '@iconify/react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 pb-12">
      <main className="flex-1 container max-w-4xl px-4 md:px-6">
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
            <Icon icon="ph:lock-key-bold" className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          <div className="space-y-8 text-muted-foreground leading-relaxed pb-10">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
              <p>
                Welcome to MangaZ. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website. As a
                scanlation group, we respect your privacy and are committed to protecting it
                through our compliance with this policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Account Information:</strong> We collect your email and display name for account identification.
                </li>
                <li>
                  <strong className="text-foreground">Usage Data:</strong> We may collect IP addresses and browser types for security and optimization.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">3. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services,
                including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Managing your account and personalizing your reading experience.</li>
                <li>Tracking your bookmarks, history, and active subscriptions.</li>
                <li>Fulfilling coin purchases and premium content access.</li>
                <li>Ensuring the security and integrity of our platform.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">4. Cookies and Tracking</h2>
              <p>
                We use cookies to enhance your experience. These are small files stored on your
                device that help us remember your appearance preferences (Dark/Light mode) and 
                keep you logged in. You can disable cookies in your browser, but some features 
                may not function correctly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">5. Third-Party Services</h2>
              <p>
                We may use third-party services for payments (Stripe, PayPal, Cryptomus) 
                and analytics (Google Analytics). These providers have their own privacy 
                policies regarding how they handle your data for these transactions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">6. Data Security</h2>
              <p>
                We implement robust security measures, including Row Level Security (RLS) on our 
                database and secure encryption for all sensitive data transfers. Your password 
                is never stored in plain text.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">7. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at 
                any time via your User Settings. If you wish to permanently delete your account, 
                please contact our support team.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">8. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please reach out to our team 
                via the official Discord server or the support channels provided in the footer.
              </p>
            </section>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

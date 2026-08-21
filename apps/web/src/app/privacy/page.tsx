import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Align by Schbang',
  description: 'Align Privacy Policy outlining how creator metrics and campaign data are protected.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl bg-white p-8 md:p-12 rounded-3xl border border-border">
        <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-text-secondary mb-8">
          Last updated: January 2026 &bull; Schbang Digital Solutions
        </p>

        <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-primary mb-2">1. Information We Collect</h2>
            <p>
              When you use Align, we collect personal and professional creator metrics provided during registration and proposal submission, including creator handles, follower counts, engagement analytics, email addresses, and media kits.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2">2. Use of Creator Analytics</h2>
            <p>
              Your metrics and campaign proposals are shared exclusively with verified Schbang brand managers and the respective client brand teams to evaluate collaboration eligibility, budget allocation, and campaign contracts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2">3. Data Protection &amp; Security</h2>
            <p>
              We implement enterprise security standards, including encrypted data transmission (TLS/HTTPS), isolated database environments, and role-based access control. We never sell your personal data to third-party data brokers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2">4. Your Rights</h2>
            <p>
              Creators may request an export of their stored profile metrics, update their social handles, or delete their creator account at any time by contacting privacy@schbang.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

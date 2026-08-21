import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Align by Schbang',
  description: 'Terms and conditions governing the use of Align creator marketplace platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl bg-white p-8 md:p-12 rounded-3xl border border-border">
        <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-text-secondary mb-8">
          Last updated: January 2026 &bull; Schbang Digital Solutions
        </p>

        <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-primary mb-2">1. Platform Eligibility</h2>
            <p>
              By accessing Align, you represent that you own and operate the social media accounts submitted in your creator profile and that all reported engagement metrics and follower numbers are accurate and verifiable.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2">2. Campaign Brief Applications</h2>
            <p>
              Submitting a proposal to a brand brief does not guarantee selection. Schbang brand managers review applications on behalf of client brands and reserve the right to shortlist or reject proposals based on brand campaign alignment.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2">3. Content Deliverables &amp; Exclusivity</h2>
            <p>
              Approved campaigns are subject to formal digital agreements specifying creative deliverables, review cycles, usage rights, and payment milestones executed between Schbang and the creator.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-primary mb-2">4. Code of Conduct</h2>
            <p>
              Creators agree to adhere to ASCI (Advertising Standards Council of India) influencer disclosure guidelines for all sponsored content produced under Align collaborations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

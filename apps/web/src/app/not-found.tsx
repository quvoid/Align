import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Visual 404 Accent */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent/10 text-accent mb-6 shadow-lg shadow-accent/10">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <h1 className="text-6xl font-black text-primary tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-extrabold text-primary tracking-tight mb-3">
          Page Not Found
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          The brand brief or page you are looking for might have expired, been removed, or is temporarily unavailable.
        </p>

        {/* Quick Recovery Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link href="/brands" className="w-full sm:w-auto">
            <Button variant="accent" size="md" className="w-full sm:w-auto shadow-lg shadow-accent/25">
              <Search className="w-4 h-4 mr-2" />
              Explore Brand Briefs
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Popular Directory Links */}
        <div className="border-t border-border pt-6 text-xs text-text-secondary">
          <p className="font-semibold text-primary mb-3 uppercase tracking-wider text-[11px]">
            Popular Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <Link href="/brands" className="hover:text-accent transition-colors">
              FMCG &amp; Food Campaigns
            </Link>
            <span>&bull;</span>
            <Link href="/brands" className="hover:text-accent transition-colors">
              Fashion &amp; Streetwear Briefs
            </Link>
            <span>&bull;</span>
            <Link href="/auth/register" className="hover:text-accent transition-colors">
              Creator Onboarding
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

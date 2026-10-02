import Link from 'next/link';
import { Wordmark } from './wordmark';

export const Footer = () => {
  return (
    <footer className="mt-16 bg-surface border-t border-border">
      <div className="container mx-auto">
      <div className="px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4" aria-label="Align by Schbang — home">
              <Wordmark />
            </Link>
            <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
              Paid brand campaigns for Indian creators, managed by Schbang. Browse open briefs and send your first 3 pitches free.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-primary mb-4 text-sm">For creators</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/brands" className="hover:text-primary transition-colors">
                  Open brand briefs
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Creator pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  My pitches
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="hover:text-primary transition-colors">
                  My media kit
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-primary mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Align
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Agency Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Align. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0 text-xs">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <span>&bull;</span>
            <p className="font-medium">A <span className="text-primary font-semibold">Schbang</span> Technology Product</p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};

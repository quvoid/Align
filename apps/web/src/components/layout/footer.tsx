import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="mt-auto px-3 sm:px-4 pb-4 pt-10">
      <div className="max-w-6xl mx-auto rounded-5xl bg-surface shadow-clay">
      <div className="px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center">
                <span className="font-extrabold text-[28px] leading-none tracking-tight text-primary">Align</span>
              </Link>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-clay-lilac text-primary shadow-clay-sm">
                by Schbang
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
              Paid brand campaigns for Indian creators, managed by Schbang. Browse open briefs and send your first 3 pitches free.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4 text-sm">For creators</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/brands" className="hover:text-accent transition-colors">
                  Open brand briefs
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-accent transition-colors">
                  Creator pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-accent transition-colors">
                  My pitches
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="hover:text-accent transition-colors">
                  My media kit
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Align
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Agency Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-2 border-muted mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Align. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0 text-xs">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
            <span>&bull;</span>
            <p className="font-medium">A <span className="text-primary font-bold">Schbang</span> Technology Product</p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};

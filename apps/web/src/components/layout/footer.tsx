import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center">
                <span className="font-extrabold text-2xl tracking-tight text-primary">Align</span>
                <span className="text-accent text-3xl leading-none font-black">.</span>
              </Link>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-text-secondary border border-border">
                by Schbang
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
              Where creative frequency meets brand purpose. India&apos;s definitive creator collaboration platform powered by Schbang.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/brands" className="hover:text-accent transition-colors">
                  Explore Brand Briefs
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-accent transition-colors">
                  Join Creator Network
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-accent transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-accent transition-colors">
                  Admin Review Portal
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4 text-sm uppercase tracking-wider">Company</h4>
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
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-text-secondary">
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
    </footer>
  );
};

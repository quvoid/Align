import Link from 'next/link';
import { Wordmark } from './wordmark';

export const Footer = () => {
  return (
    <footer className="mt-16 bg-ink text-white border-t-2 border-ink">
      <div className="container mx-auto">
      <div className="px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-5" aria-label="Align by Schbang — home">
              <Wordmark inverted />
            </Link>
            <p className="text-white/80 text-[15px] max-w-sm mb-6 leading-relaxed">
              Paid brand campaigns for Indian creators, managed by Schbang. Browse open briefs and send your first 3 pitches free.
            </p>
          </div>
          
          <div>
            <h4 className="type-display text-[22px] text-action mb-4">For creators</h4>
            <ul className="space-y-2.5 text-[15px] font-semibold text-white/85">
              <li>
                <Link href="/brands" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  Open brand briefs
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  Creator pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  My pitches
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  My media kit
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="type-display text-[22px] text-action mb-4">Company</h4>
            <ul className="space-y-2.5 text-[15px] font-semibold text-white/85">
              <li>
                <Link href="/about" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  About Align
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  Agency Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-action hover:underline underline-offset-4 decoration-2">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-2 border-white/25 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-white/75">
          <p>&copy; {new Date().getFullYear()} Align. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0 text-xs">
            <Link href="/privacy" className="hover:text-action hover:underline underline-offset-4 decoration-2">Privacy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-action hover:underline underline-offset-4 decoration-2">Terms</Link>
            <span>&bull;</span>
            <p className="font-medium">A <span className="text-white font-extrabold">Schbang</span> Technology Product</p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};

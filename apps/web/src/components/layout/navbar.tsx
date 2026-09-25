"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useSignInModal } from '@/components/auth/sign-in-modal';
import { JOIN_CTA } from '@/lib/plans';

export const Navbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSignIn } = useSignInModal();

  const isAdminOrBrand = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'BRAND';

  // Display the name the account actually holds. A previous hard-coded rule
  // rewrote any name containing "harshil" to "Schbang Admin Lead", which with
  // real signups would silently rename a creator who happens to be called that.
  const displayName = session?.user?.name;

  return (
    // DESIGN.md Top Navigation Bar: full-width white bar, 64px, no shadow, no glass/blur
    <header className="sticky top-0 inset-x-0 z-50 h-16 flex items-center bg-surface border-b border-border">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-black text-xl tracking-tight text-primary">Align</span>
          <span className="text-accent text-2xl leading-none font-black">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-base font-medium text-text-secondary">
          <Link href="/brands" className="hover:text-primary transition-colors">
            Open briefs
          </Link>

          {!isAdminOrBrand && (
            <Link href="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          )}

          {isAdminOrBrand && (
            <Link href="/creators" className="hover:text-primary transition-colors">
              Creators
            </Link>
          )}

          {session?.user && (
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              {isAdminOrBrand ? 'Dashboard' : 'My pitches'}
            </Link>
          )}

          {isAdminOrBrand && (
            <Link href="/admin/competitor-intelligence" className="hover:text-primary transition-colors">
              Competitor Intel
            </Link>
          )}

          {session?.user?.role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2.5">
              <Link
                href={isAdminOrBrand ? "/admin" : "/dashboard/profile"}
                className="font-bold text-base text-text-primary hover:text-accent transition-colors truncate max-w-[160px]"
              >
                {displayName}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs font-semibold text-text-secondary hover:text-accent transition-colors px-2 py-1"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openSignIn()}
                className="text-base font-semibold text-text-secondary hover:text-primary transition-colors px-2"
              >
                Log In
              </button>
              <Link href="/pricing">
                <Button size="sm" variant="accent" className="text-base">
                  {JOIN_CTA}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full text-primary hover:bg-linen transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-surface border-b border-border p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-2xl text-primary hover:bg-linen transition-colors"
            >
              Open briefs
            </Link>

            {!isAdminOrBrand && (
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-2xl text-primary hover:bg-linen transition-colors"
              >
                Pricing
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-2xl text-primary hover:bg-linen transition-colors"
              >
                Creators
              </Link>
            )}

            {session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-2xl text-primary hover:bg-linen transition-colors"
              >
                {isAdminOrBrand ? 'Dashboard' : 'My pitches'}
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/admin/competitor-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-2xl text-primary hover:bg-linen transition-colors"
              >
                Competitor Intel
              </Link>
            )}

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-2xl text-primary hover:bg-linen transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="border-t border-border pt-3">
            {session ? (
              <div className="flex items-center justify-between px-2">
                <Link
                  href={isAdminOrBrand ? "/admin" : "/dashboard/profile"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-text-primary hover:text-accent transition-colors"
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="text-xs font-bold text-accent hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignIn();
                  }}
                >
                  Log In
                </Button>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="accent" size="sm" className="w-full">
                    {JOIN_CTA}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

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
    // A floating clay bar: inset from the edges, cream, lit from the top-left.
    <header className="sticky top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3">
      <div className="relative w-full max-w-6xl mx-auto h-16 pl-5 pr-2.5 flex items-center justify-between rounded-full bg-surface shadow-clay">
        {/* Brand Logo */}
        <Link href="/" className="flex items-baseline gap-1.5 group" aria-label="Align by Schbang — home">
          <span className="font-extrabold text-[26px] leading-none tracking-tight text-primary">Align</span>
          <span className="hidden sm:inline text-xs font-semibold text-text-secondary">by Schbang</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[15px] font-semibold text-text-secondary">
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
                className="clay-press flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-clay-butter shadow-clay-sm font-bold text-[15px] text-text-primary max-w-[200px]"
              >
                <span className="w-8 h-8 shrink-0 rounded-full bg-surface grid place-items-center text-xs font-extrabold shadow-clay-sm" aria-hidden="true">
                  {(displayName || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <span className="truncate">{displayName}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-semibold text-text-secondary hover:text-accent transition-colors px-2.5 py-1"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openSignIn()}
                className="text-[15px] font-semibold text-text-secondary hover:text-primary transition-colors px-2"
              >
                Log in
              </button>
              <Link href="/pricing">
                <Button size="md" variant="accent" className="rounded-full">
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
            className="clay-press w-11 h-11 grid place-items-center rounded-full bg-clay-butter text-primary shadow-clay-sm"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[5.25rem] inset-x-3 rounded-4xl bg-surface shadow-clay p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5 text-base font-semibold">
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-3xl text-primary hover:bg-muted transition-colors"
            >
              Open briefs
            </Link>

            {!isAdminOrBrand && (
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-3xl text-primary hover:bg-muted transition-colors"
              >
                Pricing
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-3xl text-primary hover:bg-muted transition-colors"
              >
                Creators
              </Link>
            )}

            {session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-3xl text-primary hover:bg-muted transition-colors"
              >
                {isAdminOrBrand ? 'Dashboard' : 'My pitches'}
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/admin/competitor-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-3xl text-primary hover:bg-muted transition-colors"
              >
                Competitor Intel
              </Link>
            )}

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-3xl text-primary hover:bg-muted transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="pt-1">
            {session ? (
              <div className="flex items-center justify-between px-2">
                <Link
                  href={isAdminOrBrand ? "/admin" : "/dashboard/profile"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 text-base font-bold text-text-primary hover:text-accent transition-colors"
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="px-2 text-sm font-bold text-accent hover:underline"
                >
                  Sign out
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
                  Log in
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

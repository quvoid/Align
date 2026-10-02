"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useSignInModal } from '@/components/auth/sign-in-modal';
import { JOIN_CTA } from '@/lib/plans';
import { cn } from '@/lib/utils';
import { Wordmark } from './wordmark';

export const Navbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSignIn } = useSignInModal();
  const pathname = usePathname();

  const isAdminOrBrand = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'BRAND';

  // Display the name the account actually holds. A previous hard-coded rule
  // rewrote any name containing "harshil" to "Schbang Admin Lead", which with
  // real signups would silently rename a creator who happens to be called that.
  const displayName = session?.user?.name;
  const initials = (displayName || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  // The section you're in reads in ink on a soft pill; the rest are grey.
  // /admin must not light up on /admin/competitor-intelligence.
  const isCurrent = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);
  const desktopLink = (href: string) =>
    cn(
      "px-3.5 py-2 rounded-full transition-colors",
      isCurrent(href) ? "bg-muted text-primary" : "text-text-secondary hover:text-primary"
    );
  const mobileLink = (href: string) =>
    cn(
      "flex items-center min-h-12 px-4 rounded-2xl",
      isCurrent(href) ? "bg-muted text-primary" : "text-text-secondary hover:text-primary"
    );

  return (
    // A white app bar with a hairline under it.
    <header className="sticky top-0 inset-x-0 z-50 bg-surface border-b border-border">
      <div className="relative container mx-auto h-16 px-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="shrink-0" aria-label="Align by Schbang — home">
          <Wordmark />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-[15px] font-medium">
          <Link href="/brands" className={desktopLink("/brands")}>
            Open briefs
          </Link>

          {!isAdminOrBrand && (
            <Link href="/pricing" className={desktopLink("/pricing")}>
              Pricing
            </Link>
          )}

          {isAdminOrBrand && (
            <Link href="/creators" className={desktopLink("/creators")}>
              Creators
            </Link>
          )}

          {session?.user && (
            <Link href="/dashboard" className={desktopLink("/dashboard")}>
              {isAdminOrBrand ? 'Dashboard' : 'My pitches'}
            </Link>
          )}

          {isAdminOrBrand && (
            <Link href="/admin/competitor-intelligence" className={desktopLink("/admin/competitor-intelligence")}>
              Competitor Intel
            </Link>
          )}

          {session?.user?.role === 'ADMIN' && (
            <Link href="/admin" className={desktopLink("/admin")}>
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
                className="press flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full bg-muted font-medium text-[15px] text-text-primary max-w-[220px]"
              >
                <span className="w-8 h-8 shrink-0 rounded-full bg-ink text-white grid place-items-center text-xs font-semibold" aria-hidden="true">
                  {initials}
                </span>
                <span className="truncate">{displayName}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors px-2.5 py-1"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openSignIn()}
                className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors px-2"
              >
                Log in
              </button>
              <Link href="/pricing">
                <Button size="sm" variant="accent">
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
            className="press w-11 h-11 grid place-items-center rounded-full bg-muted text-primary"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full inset-x-0 bg-surface border-b border-border p-3 space-y-3 shadow-lift animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1 text-base font-medium">
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLink("/brands")}
            >
              Open briefs
            </Link>

            {!isAdminOrBrand && (
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLink("/pricing")}
              >
                Pricing
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLink("/creators")}
              >
                Creators
              </Link>
            )}

            {session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLink("/dashboard")}
              >
                {isAdminOrBrand ? 'Dashboard' : 'My pitches'}
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/admin/competitor-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLink("/admin/competitor-intelligence")}
              >
                Competitor Intel
              </Link>
            )}

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLink("/admin")}
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
                  className="px-2 text-base font-semibold text-text-primary hover:text-accent transition-colors"
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="px-2 text-sm font-semibold text-accent hover:underline"
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

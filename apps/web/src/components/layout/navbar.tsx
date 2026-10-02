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

  // The section you're in is the ink tab; the rest are plain bold links.
  // /admin must not light up on /admin/competitor-intelligence.
  const isCurrent = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);
  const desktopLink = (href: string) =>
    cn(
      "px-3 py-2 rounded-md transition-colors",
      isCurrent(href) ? "bg-ink text-white" : "text-primary hover:bg-muted"
    );
  const mobileLink = (href: string) =>
    cn(
      "flex items-center min-h-12 px-4 border-b-2 border-ink last:border-b-0",
      isCurrent(href) ? "bg-ink text-white" : "text-primary hover:bg-muted"
    );

  return (
    // An app bar: white, full width, ruled off from the page with an ink line.
    <header className="sticky top-0 inset-x-0 z-50 bg-surface border-b-2 border-ink">
      <div className="relative container mx-auto h-16 px-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="shrink-0" aria-label="Align by Schbang — home">
          <Wordmark />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-[15px] font-bold">
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
                className="brut-press flex items-center gap-2 pl-1 pr-3 py-1 rounded-md bg-surface brut-sm font-extrabold text-[15px] text-text-primary max-w-[220px]"
              >
                <span className="w-8 h-8 shrink-0 rounded bg-fill-butter border-2 border-ink grid place-items-center text-xs font-extrabold" aria-hidden="true">
                  {initials}
                </span>
                <span className="truncate">{displayName}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-bold text-primary underline decoration-2 underline-offset-4 hover:decoration-action px-2 py-1"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openSignIn()}
                className="text-[15px] font-bold text-primary underline decoration-2 underline-offset-4 hover:decoration-action px-2"
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
            className="brut-press w-11 h-11 grid place-items-center rounded-md bg-surface text-primary brut-sm"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full inset-x-0 bg-surface border-b-2 border-ink animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col text-base font-bold border-b-2 border-ink">
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

          <div className="p-4">
            {session ? (
              <div className="flex items-center justify-between">
                <Link
                  href={isAdminOrBrand ? "/admin" : "/dashboard/profile"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-extrabold text-text-primary"
                >
                  <span className="w-8 h-8 shrink-0 rounded bg-fill-butter border-2 border-ink grid place-items-center text-xs" aria-hidden="true">{initials}</span>
                  {displayName}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="px-2 py-2 text-sm font-bold text-primary underline decoration-2 underline-offset-4"
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

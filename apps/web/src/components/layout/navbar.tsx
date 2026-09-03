"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminOrBrand = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'BRAND';

  const sanitizedUserName = session?.user?.name?.toLowerCase().includes("harshil") || session?.user?.email === "admin@schbang.com"
    ? "Schbang Admin Lead"
    : session?.user?.name;

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-3 sm:px-6">
      <div className="pointer-events-auto w-full max-w-5xl rounded-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] px-5 sm:px-7 py-2.5 flex items-center justify-between transition-all duration-300">
        {/* Brand Logo - Ultra Clean */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-black text-xl tracking-tight text-primary">Align</span>
          <span className="text-accent text-2xl leading-none font-black">.</span>
        </Link>
        
        {/* Desktop Navigation - Clean Text Links (No Icons, No Badges) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-secondary">
          <Link href="/brands" className="hover:text-primary transition-colors">
            Brands
          </Link>

          {isAdminOrBrand && (
            <Link href="/creators" className="hover:text-primary transition-colors">
              Creators
            </Link>
          )}

          {session?.user && (
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
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
              <div className="flex items-center gap-2 bg-gray-100/80 px-3 py-1.5 rounded-full border border-gray-200/60 text-xs">
                <span className="font-bold text-text-primary max-w-[130px] truncate">
                  {sanitizedUserName}
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black text-white">
                  {session.user?.role || "CREATOR"}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="text-xs font-semibold text-text-secondary hover:text-red-600 transition-colors px-2 py-1"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors px-2">
                Log In
              </Link>
              <Link href="/auth/register">
                <Button size="sm" variant="primary" className="rounded-full px-5 py-1.5 text-xs font-bold shadow-xs">
                  Join Align
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full text-primary hover:bg-gray-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Pill */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-14 inset-x-4 max-w-md mx-auto rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-primary hover:bg-gray-50 transition-colors"
            >
              Brands
            </Link>

            {isAdminOrBrand && (
              <Link
                href="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-primary hover:bg-gray-50 transition-colors"
              >
                Creators
              </Link>
            )}

            {session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-primary hover:bg-gray-50 transition-colors"
              >
                Dashboard
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/admin/competitor-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-primary hover:bg-gray-50 transition-colors"
              >
                Competitor Intel
              </Link>
            )}

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-primary hover:bg-gray-50 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="border-t border-gray-100 pt-3">
            {session ? (
              <div className="flex items-center justify-between px-2">
                <div className="text-xs font-bold text-text-primary">
                  {sanitizedUserName} <span className="text-text-secondary font-normal">({session.user?.role || "CREATOR"})</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/auth/signin' });
                  }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full rounded-full text-xs">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full rounded-full text-xs">
                    Join Align
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

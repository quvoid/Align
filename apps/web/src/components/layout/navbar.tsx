"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, Building2, LayoutDashboard, ShieldCheck, LogIn, UserPlus, LogOut, Zap } from 'lucide-react';

export const Navbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminOrBrand = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'BRAND';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/85 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center">
            <span className="font-extrabold text-2xl tracking-tight text-primary">Align</span>
            <span className="text-accent text-3xl leading-none font-black">.</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-text-secondary border border-border group-hover:border-accent/40 transition-colors">
            by Schbang
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
          <Link href="/brands" className="hover:text-primary transition-colors">
            Explore Brands
          </Link>

          {/* Creators only see their dashboard & brands; Admins & Brand Managers see the Talent Hub */}
          {isAdminOrBrand && (
            <Link href="/creators" className="hover:text-primary transition-colors flex items-center gap-1.5 font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Find Creators
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary text-white uppercase tracking-wider">
                Brand Hub
              </span>
            </Link>
          )}

          {session?.user && (
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Creator Dashboard
            </Link>
          )}

          {isAdminOrBrand && (
            <Link href="/admin/competitor-intelligence" className="hover:text-primary transition-colors flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-accent" />
              Competitor Intel
            </Link>
          )}

          {session?.user?.role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Desktop Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-primary font-bold hidden sm:block bg-gray-100 px-3 py-1.5 rounded-full border border-border">
                  {session.user?.name?.toLowerCase().includes("harshil") || session.user?.email === "admin@schbang.com"
                    ? "Schbang Admin Lead"
                    : session.user?.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                  {session.user?.role || "CREATOR"}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="accent" size="sm" className="shadow-sm shadow-accent/20">
                  Join Align
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-primary hover:bg-gray-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <nav className="space-y-3">
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-xl text-sm font-semibold text-primary hover:bg-gray-50"
            >
              <Building2 className="w-4 h-4 text-accent" />
              Explore Brand Briefs
            </Link>

            {isAdminOrBrand && (
              <Link
                href="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl text-sm font-semibold text-primary hover:bg-gray-50"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Find Creators Directory
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white uppercase">
                  Brand Hub
                </span>
              </Link>
            )}

            {session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-xl text-sm font-semibold text-primary hover:bg-gray-50"
              >
                <LayoutDashboard className="w-4 h-4 text-accent" />
                Creator Dashboard
              </Link>
            )}

            {isAdminOrBrand && (
              <Link
                href="/admin/competitor-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-xl text-sm font-semibold text-primary hover:bg-gray-50"
              >
                <Zap className="w-4 h-4 text-accent" />
                Competitor Intelligence
              </Link>
            )}

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-xl text-sm font-semibold text-primary hover:bg-gray-50"
              >
                <ShieldCheck className="w-4 h-4 text-accent" />
                Admin Command Center
              </Link>
            )}
          </nav>

          <div className="border-t border-border pt-4">
            {session ? (
              <div className="space-y-2">
                <div className="text-xs font-bold text-text-secondary px-2">
                  Signed in as <span className="text-primary">{session.user?.name?.toLowerCase().includes("harshil") || session.user?.email === "admin@schbang.com" ? "Schbang Admin Lead" : session.user?.name}</span> ({session.user?.role || "CREATOR"})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/auth/signin' });
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="accent" size="sm" className="w-full">
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Join
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

"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center">
            <span className="font-extrabold text-2xl tracking-tight text-primary">Align</span>
            <span className="text-accent text-3xl leading-none font-black">.</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-text-secondary border border-border group-hover:border-accent/40 transition-colors">
            by Schbang
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
          <Link href="/brands" className="hover:text-primary transition-colors">Explore Brands</Link>
          {session?.user && (
            <Link href="/dashboard" className="hover:text-primary transition-colors">Creator Dashboard</Link>
          )}
          {(session?.user as any)?.role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-primary font-medium hidden sm:block">{session.user?.name}</span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign Out</Button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="accent" size="sm">Join Align</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

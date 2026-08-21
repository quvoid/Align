"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignInPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginWithEmail = async (targetEmail: string, targetPass: string, redirectUrl: string) => {
    setLoading(true);
    try {
      await signIn('credentials', {
        email: targetEmail,
        password: targetPass,
        callbackUrl: redirectUrl,
        redirect: true
      });
    } catch {
      toast({
        title: "Sign in error",
        description: "An error occurred during login.",
        type: "error"
      });
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim() || 'admin@schbang.com';
    const redirectUrl = targetEmail === 'admin@schbang.com' ? '/admin' : '/dashboard';
    loginWithEmail(targetEmail, password || 'password123', redirectUrl);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="max-w-md w-full shadow-xl border-border">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="font-extrabold text-2xl tracking-tight text-primary">Align</span>
            <span className="text-accent text-3xl leading-none font-black">.</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-text-secondary border border-border">
              by Schbang
            </span>
          </div>
          <h2 className="text-2xl font-bold text-primary">Sign In</h2>
          <p className="text-text-secondary text-xs">Access the creator dashboard or admin review portal</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Quick Demo Access Buttons */}
          <div className="p-3.5 bg-accent/5 rounded-xl border border-accent/20 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-accent text-center">⚡ Instant 1-Click Access</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button" 
                variant="primary" 
                size="sm" 
                className="text-xs"
                onClick={() => loginWithEmail('admin@schbang.com', 'admin123', '/admin')}
                isLoading={loading}
              >
                🛡️ Login as Admin
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs border-accent text-accent hover:bg-accent/10"
                onClick={() => loginWithEmail('creator@schbang.com', 'creator123', '/dashboard')}
                isLoading={loading}
              >
                ✨ Login as Creator
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-text-secondary font-medium">Or enter credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email address" 
              type="email" 
              placeholder="admin@schbang.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-text-secondary">
            Tip: Use <strong className="text-primary font-semibold">admin@schbang.com</strong> for Admin permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

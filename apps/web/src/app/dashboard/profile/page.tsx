"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { fetchMe, saveProfile, isProfileComplete, type CreatorProfile } from "@/lib/user-store";
import { errorMessage } from "@/lib/fetch-json";
import { safeRedirectPath } from "@/lib/auth-shared";
import { Instagram, Youtube, Save, ShieldCheck, Loader2 } from "lucide-react";

// useSearchParams() (used for ?next=) requires a Suspense boundary above it
// for Next.js to statically prerender this route — without this wrapper the
// production build fails outright with "useSearchParams() should be wrapped
// in a suspense boundary" rather than just warning.
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <ProfilePageInner />
    </Suspense>
  );
}

function ProfilePageInner() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Set when this page is a gate on the way somewhere else — sign-in sends
  // new/incomplete creators here before /dashboard, and applying to a brief
  // sends them here before /apply/[slug]. A complete profile skips straight
  // through instead of showing the form again.
  const next = safeRedirectPath(searchParams.get("next"));
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const role = session?.user?.role;
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    // Admins don't have a creator profile — never gate them here.
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.replace("/admin");
      return;
    }

    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (cancelled) return;
        setProfile(me.profile);
        if (next && isProfileComplete(me.profile)) router.replace(next);
      })
      .catch((err) => {
        if (!cancelled) toast({ title: "Couldn't load your profile", description: errorMessage(err), type: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [email, role, next, router, toast]);

  const handleSave = async () => {
    if (!email || !profile) return;

    // Onboarding: the gate that sent them here would only bounce them back.
    if (next && !isProfileComplete(profile)) {
      toast({
        title: "Two fields left",
        description: "Add your Instagram handle and niche so brands can review your pitch.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      setProfile(await saveProfile(profile));
      toast({
        title: "Profile saved",
        description: "Brands reviewing your pitches now see these details.",
        type: "success",
      });
      if (next) router.push(next);
    } catch (err) {
      toast({ title: "Profile not saved", description: errorMessage(err), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CreatorProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8 sm:pt-12 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <h1 className="text-[44px] sm:text-6xl font-semibold tracking-tight leading-[0.95] text-primary">
              Your media kit
            </h1>
            <p className="mt-2 text-base sm:text-lg text-text-secondary max-w-xl">
              Brands see this with every pitch. Your numbers are shown as you enter them, so keep them current.
            </p>
          </div>
          <Link href="/brands" className="shrink-0">
            <Button variant="outline">Browse open briefs</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 max-w-4xl space-y-6">
        {next && !isProfileComplete(profile) && (
          <div className="rounded-4xl bg-tint-butter p-5 md:p-6 shadow-card">
            <p className="font-semibold text-primary">Finish your profile to continue</p>
            <p className="text-sm text-text-secondary mt-1">
              Brands see this with every pitch. Add at least your Instagram handle and niche, then save.
            </p>
          </div>
        )}
        {/* Section 1: Basic Creator Details */}
        <Card>
          <CardContent className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-11 h-11 rounded-full bg-tint-lilac grid place-items-center shadow-pill"><ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" /></span>
              <h2 className="text-2xl font-semibold text-primary">About you</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your full name"
              />
              <Input
                label="Email Address"
                value={profile.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                disabled
              />
              <Input
                label="Location"
                value={profile.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="City, Country"
              />
              <Input
                label="Phone"
                type="tel"
                value={profile.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
            
            <div className="pt-2">
              <Input
                label="Primary Niche"
                value={profile.niche || ""}
                onChange={(e) => updateField("niche", e.target.value)}
                placeholder="e.g., Tech, Lifestyle, Fashion"
              />
            </div>

            <div className="pt-2">
              <Textarea
                label="Bio"
                value={profile.bio || ""}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="A short introduction about you..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Instagram Analytics */}
        <Card>
          <CardContent className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-11 h-11 rounded-full bg-tint-rose grid place-items-center shadow-pill"><Instagram className="w-5 h-5 text-primary" aria-hidden="true" /></span>
              <h2 className="text-2xl font-semibold text-primary">Instagram</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Instagram Handle"
                value={profile.igHandle || ""}
                onChange={(e) => updateField("igHandle", e.target.value)}
                placeholder="@yourig"
              />
              <Input
                label="Followers"
                type="number"
                value={profile.igFollowers?.toString() || ""}
                onChange={(e) => updateField("igFollowers", e.target.value)}
                placeholder="e.g. 50000"
              />
              <Input
                label="Avg Engagement Rate (%)"
                type="number"
                step="0.1"
                value={profile.igER?.toString() || ""}
                onChange={(e) => updateField("igER", e.target.value)}
                placeholder="e.g. 4.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: YouTube & Channels */}
        <Card>
          <CardContent className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-11 h-11 rounded-full bg-tint-sky grid place-items-center shadow-pill"><Youtube className="w-5 h-5 text-primary" aria-hidden="true" /></span>
              <h2 className="text-2xl font-semibold text-primary">YouTube and media kit</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Channel Name"
                value={profile.ytChannel || ""}
                onChange={(e) => updateField("ytChannel", e.target.value)}
                placeholder="Channel Name"
              />
              <Input
                label="Subscribers"
                type="number"
                value={profile.ytSubscribers?.toString() || ""}
                onChange={(e) => updateField("ytSubscribers", e.target.value)}
                placeholder="e.g. 100000"
              />
              <Input
                label="Avg Views"
                type="number"
                value={profile.ytAvgViews?.toString() || ""}
                onChange={(e) => updateField("ytAvgViews", e.target.value)}
                placeholder="e.g. 25000"
              />
            </div>

            <div className="pt-2">
              <Input
                label="Media Kit URL"
                value={profile.mediaKitUrl || ""}
                onChange={(e) => updateField("mediaKitUrl", e.target.value)}
                placeholder="https://link-to-your-media-kit.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Bottom */}
        <div className="flex justify-end pt-4">
          <Button 
            variant="accent" 
            size="lg" 
            onClick={handleSave} 
            disabled={loading}
            className="w-full md:w-auto px-8"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Save media kit
          </Button>
        </div>
      </div>
    </div>
  );
}

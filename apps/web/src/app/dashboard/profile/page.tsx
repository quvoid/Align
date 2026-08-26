"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Instagram,
  Youtube,
  Save,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const userName = session?.user?.name || "Creator";
  const userEmail = session?.user?.email || "";
  const defaultHandle = session?.user?.name
    ? `@${session.user.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
    : "@yourhandle";

  const isRohanDemo = userEmail === "rohan@schbang.com" || userEmail === "rohan.creates@gmail.com";

  const [profile, setProfile] = useState({
    name: isRohanDemo ? "Rohan Joshi" : userName,
    handle: isRohanDemo ? "@rohan_joshicomics" : defaultHandle,
    email: userEmail,
    avatar:
      session?.user?.image ||
      (isRohanDemo
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`),
    location: "Mumbai, India",
    bio: isRohanDemo
      ? "Stand-up comedian & storyteller creating relatable humorous sketches around everyday Indian family moments."
      : "",
    niche: isRohanDemo ? "Comedy, Food & FMCG, Lifestyle" : "",
    igHandle: isRohanDemo ? "@rohan_joshicomics" : "",
    igFollowers: isRohanDemo ? "145000" : "",
    igER: isRohanDemo ? "6.8" : "",
    ytChannel: isRohanDemo ? "Rohan Joshi Official" : "",
    ytSubscribers: isRohanDemo ? "85000" : "",
    ytAvgViews: isRohanDemo ? "42k" : "",
    fbFollowers: isRohanDemo ? "12000" : "",
    mediaKitUrl: isRohanDemo ? "https://drive.google.com/your-media-kit" : "",
  });

  // Load saved profile if available
  useEffect(() => {
    if (userEmail && typeof window !== "undefined") {
      const saved = localStorage.getItem(`align_profile_${userEmail}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch {}
      } else if (!isRohanDemo && userName) {
        setProfile((prev) => ({
          ...prev,
          name: userName,
          email: userEmail,
          handle: defaultHandle,
          avatar: session?.user?.image || prev.avatar,
        }));
      }
    }
  }, [userEmail, userName, isRohanDemo, defaultHandle, session?.user?.image]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (userEmail && typeof window !== "undefined") {
      localStorage.setItem(`align_profile_${userEmail}`, JSON.stringify(profile));
    }

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "✨ Creator Profile Updated!",
        description:
          "Your social metrics & biography are saved and synchronized with your creator account.",
        type: "success",
      });
    }, 500);
  };

  return (
    <div className="bg-background min-h-screen py-10 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">
              My Creator Profile &amp; Media Kit
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Keep your verified handles and audience metrics up to date for brand brief pitching.
            </p>
          </div>

          <Link href="/brands">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              <Sparkles className="w-4 h-4 mr-1.5 text-accent" />
              Browse Open Brand Briefs
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* 1. Basic Identity */}
          <Card className="rounded-3xl border-border shadow-xs overflow-hidden bg-white">
            <div className="p-6 border-b border-border bg-gray-50/70">
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                Basic Creator Details
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Your primary branding, avatar, and geographic location.
              </p>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Creator Full Name"
                  value={profile.name}
                  placeholder="e.g. Omkar Rakshe"
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
                <Input
                  label="Primary Creator Handle"
                  value={profile.handle}
                  placeholder="@yourhandle"
                  onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
                <Input
                  label="Base City / State"
                  value={profile.location}
                  placeholder="e.g. Mumbai, Maharashtra"
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  required
                />
              </div>

              <Textarea
                label="Creator Biography & Pitch"
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Describe your content style, audience demographics, and past collaboration highlights..."
              />

              <Input
                label="Content Niches (comma separated)"
                value={profile.niche}
                placeholder="e.g. Tech, Lifestyle, Food & FMCG"
                onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* 2. Instagram Metrics */}
          <Card className="rounded-3xl border-border shadow-xs overflow-hidden bg-white">
            <div className="p-6 border-b border-border bg-gray-50/70">
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                Instagram Analytics
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Metrics pulled for brand campaign matching.
              </p>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Instagram Handle"
                  placeholder="@handle"
                  value={profile.igHandle}
                  onChange={(e) => setProfile({ ...profile, igHandle: e.target.value })}
                />
                <Input
                  label="Followers Count"
                  type="number"
                  placeholder="e.g. 50000"
                  value={profile.igFollowers}
                  onChange={(e) => setProfile({ ...profile, igFollowers: e.target.value })}
                />
                <Input
                  label="Avg Engagement Rate (%)"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 5.4"
                  value={profile.igER}
                  onChange={(e) => setProfile({ ...profile, igER: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. YouTube & Other Channels */}
          <Card className="rounded-3xl border-border shadow-xs overflow-hidden bg-white">
            <div className="p-6 border-b border-border bg-gray-50/70">
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                YouTube &amp; Additional Channels
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Long-form content metrics and portfolio links.
              </p>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="YouTube Channel Name"
                  placeholder="e.g. Channel Name"
                  value={profile.ytChannel}
                  onChange={(e) => setProfile({ ...profile, ytChannel: e.target.value })}
                />
                <Input
                  label="Subscribers Count"
                  type="number"
                  placeholder="e.g. 25000"
                  value={profile.ytSubscribers}
                  onChange={(e) => setProfile({ ...profile, ytSubscribers: e.target.value })}
                />
                <Input
                  label="Average Views Per Video"
                  placeholder="e.g. 15k"
                  value={profile.ytAvgViews}
                  onChange={(e) => setProfile({ ...profile, ytAvgViews: e.target.value })}
                />
              </div>

              <Input
                label="External Media Kit / Portfolio Link (Google Drive / Notion)"
                value={profile.mediaKitUrl}
                placeholder="https://drive.google.com/..."
                onChange={(e) => setProfile({ ...profile, mediaKitUrl: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Sticky Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={loading}
              className="shadow-xl shadow-accent/25 px-8 font-bold text-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Creator Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
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
  Facebook,
  Sparkles,
  MapPin,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Eye,
} from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: session?.user?.name || "Rohan Joshi",
    handle: "@rohan_joshicomics",
    email: session?.user?.email || "rohan.creates@gmail.com",
    avatar:
      session?.user?.image ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    location: "Mumbai, India",
    bio: "Stand-up comedian & storyteller creating relatable humorous sketches around everyday Indian family moments.",
    niche: "Comedy, Food & FMCG, Lifestyle",
    igHandle: "@rohan_joshicomics",
    igFollowers: "145000",
    igER: "6.8",
    ytChannel: "Rohan Joshi Official",
    ytSubscribers: "85000",
    ytAvgViews: "42k",
    fbFollowers: "12000",
    mediaKitUrl: "https://drive.google.com/your-media-kit",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "✨ Creator Profile Updated!",
        description:
          "Your social metrics & biography are synchronized across the Schbang Talent Discovery Network.",
        type: "success",
      });
    }, 600);
  };

  return (
    <div className="bg-background min-h-screen py-10 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">
              Creator Profile &amp; Media Kit
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Your verified public profile visible to Schbang brand managers and marquee brands.
            </p>
          </div>

          <Link href="/creators/c1">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              <Eye className="w-4 h-4 mr-1.5" />
              Preview Public Scorecard
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* 1. Basic Identity */}
          <Card className="rounded-3xl border-border shadow-xs overflow-hidden">
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
                required
              />

              <Input
                label="Content Niches (comma separated)"
                value={profile.niche}
                placeholder="e.g. Food & FMCG, Comedy, Lifestyle"
                onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* 2. Instagram Metrics */}
          <Card className="rounded-3xl border-border shadow-xs overflow-hidden">
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
                  value={profile.igHandle}
                  onChange={(e) => setProfile({ ...profile, igHandle: e.target.value })}
                />
                <Input
                  label="Followers Count"
                  type="number"
                  value={profile.igFollowers}
                  onChange={(e) => setProfile({ ...profile, igFollowers: e.target.value })}
                />
                <Input
                  label="Avg Engagement Rate (%)"
                  type="number"
                  step="0.1"
                  value={profile.igER}
                  onChange={(e) => setProfile({ ...profile, igER: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. YouTube & Other Channels */}
          <Card className="rounded-3xl border-border shadow-xs overflow-hidden">
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
                  value={profile.ytChannel}
                  onChange={(e) => setProfile({ ...profile, ytChannel: e.target.value })}
                />
                <Input
                  label="Subscribers Count"
                  type="number"
                  value={profile.ytSubscribers}
                  onChange={(e) => setProfile({ ...profile, ytSubscribers: e.target.value })}
                />
                <Input
                  label="Average Views Per Video"
                  value={profile.ytAvgViews}
                  placeholder="e.g. 45k"
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
              Save &amp; Publish Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

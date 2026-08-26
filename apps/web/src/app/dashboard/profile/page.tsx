"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { getUserData, updateProfile, type CreatorProfile } from "@/lib/user-store";
import { Instagram, Youtube, Save, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      const data = getUserData(
        session.user.email,
        session.user.name || undefined,
        session.user.image || undefined
      );
      setProfile(data.profile);
    }
  }, [session]);

  const handleSave = () => {
    if (!session?.user?.email || !profile) return;
    
    setLoading(true);
    updateProfile(session.user.email, profile);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile Saved",
        description: "Your creator profile has been updated successfully.",
        type: "success",
      });
    }, 500);
  };

  const updateField = (field: keyof CreatorProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-white py-12 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-accent" />
                My Creator Profile & Media Kit
              </h1>
              <p className="text-white/70 text-base">
                Manage your public creator identity and verified analytics.
              </p>
            </div>
            <Link href="/brands">
              <Button variant="accent" className="font-bold">
                Browse Open Brand Briefs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Section 1: Basic Creator Details */}
        <Card className="rounded-3xl border-border shadow-xs">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-primary">Basic Creator Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your full name"
              />
              <Input
                label="Creator Handle"
                value={profile.handle || ""}
                onChange={(e) => updateField("handle", e.target.value)}
                placeholder="@yourhandle"
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
        <Card className="rounded-3xl border-border shadow-xs">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Instagram className="w-6 h-6 text-pink-600" />
              <h2 className="text-xl font-bold text-primary">Instagram Analytics</h2>
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
        <Card className="rounded-3xl border-border shadow-xs">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Youtube className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-primary">YouTube & Channels</h2>
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

            <div className="pt-4 border-t border-border">
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
            className="w-full md:w-auto text-base font-bold px-8"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Save Creator Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

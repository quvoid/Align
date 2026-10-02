"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import type { BrandItem } from "@/lib/mock-data";
import { fetchBrief, fetchMe, submitPitch, isProfileComplete } from "@/lib/user-store";
import { ApiError, errorMessage } from "@/lib/fetch-json";
import { useSession } from "next-auth/react";
import { useSignInModal } from "@/components/auth/sign-in-modal";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Send,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "You", icon: User },
  { id: 2, label: "Instagram", icon: Instagram },
  { id: 3, label: "YouTube", icon: Youtube },
  { id: 4, label: "Others", icon: Facebook },
  { id: 5, label: "Pitch", icon: Send },
  { id: 6, label: "Review", icon: CheckCircle },
];

const DELIVERABLE_OPTIONS = [
  "Instagram Reel",
  "Instagram Story",
  "Instagram Post",
  "YouTube Video",
  "YouTube Short",
  "Facebook Post",
  "Blog Post",
  "X/Twitter Post",
  "Podcast Mention",
];

export default function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const { openSignIn } = useSignInModal();

  const slug = resolvedParams.slug;
  const email = session?.user?.email;
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // undefined while loading, null when the brief is paused or doesn't exist.
  const [brand, setBrand] = useState<BrandItem | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    fetchBrief(slug)
      .then((b) => !cancelled && setBrand(b))
      .catch(() => !cancelled && setBrand(null));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    document.body.style.overflow = "unset";
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    niche: "",
    bio: "",
    website: "",
    igHandle: "",
    igFollowers: "",
    igEngagementRate: "",
    igAvgLikes: "",
    igAvgComments: "",
    ytChannel: "",
    ytSubscribers: "",
    ytAvgViews: "",
    ytEngagementRate: "",
    fbPage: "",
    fbFollowers: "",
    fbEngagementRate: "",
    xHandle: "",
    xFollowers: "",
    xEngagementRate: "",
    proposal: "",
    expectedRate: "",
    deliverables: [] as string[],
  });

  // Pitching needs a free pitch left or an active plan, and a profile with
  // at least a handle and niche — that's what a brand actually sees when
  // reviewing a pitch. Send everyone else to pricing or the profile form and
  // bring them back here. The server enforces both again on submit.
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (cancelled) return;
        if (!me.canPitch) {
          router.replace(`/pricing?brief=${encodeURIComponent(slug)}`);
          return;
        }
        if (!isProfileComplete(me.profile)) {
          router.replace(`/dashboard/profile?next=${encodeURIComponent(`/apply/${slug}`)}`);
          return;
        }
        const profile = me.profile;
        setForm((prev) => ({
          ...prev,
          name: profile.name || prev.name,
          email: profile.email || prev.email,
          phone: profile.phone || prev.phone,
          location: profile.location || prev.location,
          niche: profile.niche || prev.niche,
          bio: profile.bio || prev.bio,
          website: profile.website || prev.website,
          igHandle: profile.igHandle || prev.igHandle,
          igFollowers: profile.igFollowers || prev.igFollowers,
          igEngagementRate: profile.igER || prev.igEngagementRate,
          ytChannel: profile.ytChannel || prev.ytChannel,
          ytSubscribers: profile.ytSubscribers || prev.ytSubscribers,
          ytAvgViews: profile.ytAvgViews || prev.ytAvgViews,
          fbFollowers: profile.fbFollowers || prev.fbFollowers,
        }));
      })
      .catch(() => {
        // Submit reports anything real; the form still works without prefill.
      });
    return () => {
      cancelled = true;
    };
  }, [email, slug, router]);

  if (brand === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Loading brief" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-12">
        <span className="w-16 h-16 mb-4 rounded-full bg-clay-rose grid place-items-center shadow-clay-sm">
          <AlertCircle className="w-8 h-8 text-primary" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-extrabold text-primary mb-2">This brief has closed</h1>
        <p className="text-text-secondary mb-6">It may have been paused, or the link is wrong.</p>
        <Link href="/brands">
          <Button variant="accent">Browse open briefs</Button>
        </Link>
      </div>
    );
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDeliverable = (item: string) => {
    setForm((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(item)
        ? prev.deliverables.filter((d) => d !== item)
        : [...prev.deliverables, item],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return form.name && form.email;
      case 2:
      case 3:
      case 4:
        return true; 
      case 5:
        return form.proposal.length >= 50 && form.deliverables.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      openSignIn({ reason: "Sign in to submit this pitch. Your form answers stay filled in." });
      return;
    }

    setSubmitting(true);
    try {
      await submitPitch({
        briefSlug: brand.slug,
        proposal: form.proposal,
        expectedRate: form.expectedRate,
        deliverables: form.deliverables,
        metrics: {
          instagramHandle: form.igHandle,
          instagramFollowers: form.igFollowers,
          instagramER: form.igEngagementRate ? `${form.igEngagementRate}%` : undefined,
          instagramAvgLikes: form.igAvgLikes,
          instagramAvgComments: form.igAvgComments,
          youtubeChannel: form.ytChannel,
          youtubeSubscribers: form.ytSubscribers,
          youtubeAvgViews: form.ytAvgViews,
          youtubeER: form.ytEngagementRate ? `${form.ytEngagementRate}%` : undefined,
          facebookPage: form.fbPage,
          facebookFollowers: form.fbFollowers,
          facebookER: form.fbEngagementRate ? `${form.fbEngagementRate}%` : undefined,
          xHandle: form.xHandle,
          xFollowers: form.xFollowers,
          xER: form.xEngagementRate ? `${form.xEngagementRate}%` : undefined,
        },
        applicant: {
          phone: form.phone,
          location: form.location,
          niche: form.niche,
          website: form.website,
        },
      });

      toast({
        title: `Pitch sent to ${brand.name}`,
        description: "The Schbang team reviews it next. Track its status on your dashboard.",
        type: "success",
      });
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        router.push(`/pricing?brief=${encodeURIComponent(brand.slug)}`);
        return;
      }
      if (err instanceof ApiError && err.status === 400 && /profile/i.test(err.message)) {
        router.push(`/dashboard/profile?next=${encodeURIComponent(`/apply/${brand.slug}`)}`);
        return;
      }
      toast({ title: "Pitch not sent", description: errorMessage(err), type: "error" });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="container mx-auto px-4 pt-8 sm:pt-12 max-w-2xl">
        <Link href={`/brands/${brand.slug}`} className="clay-press inline-flex items-center gap-1.5 pl-2.5 pr-3.5 pt-1.5 pb-1 rounded-full bg-surface text-sm font-semibold text-text-secondary shadow-clay-sm hover:text-primary">
          <ArrowLeft className="w-4 h-4 -mt-0.5" aria-hidden="true" /> {brand.name} brief
        </Link>
        <h1 className="mt-5 text-[40px] sm:text-5xl font-extrabold tracking-tight leading-[0.95] text-primary">
          Pitch {brand.name}
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Your idea and your numbers go to the Schbang team, who review every pitch for the brand.
        </p>

        {/* Steps as clay beads: filled = done, butter = here. */}
        <ol className="mt-6 rounded-4xl bg-surface px-3 py-4 shadow-clay grid grid-cols-6 gap-1" aria-label={`Step ${step} of ${STEPS.length}`}>
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isComplete = s.id < step;
            return (
              <li key={s.id} className="flex flex-col items-center gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => s.id < step && setStep(s.id)}
                  disabled={s.id >= step}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`${s.label}${isComplete ? " (done, go back)" : ""}`}
                  className={`clay-press w-10 h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center disabled:cursor-default ${
                    isActive
                      ? "bg-clay-butter text-primary shadow-clay-sm scale-110"
                      : isComplete
                        ? "bg-accent text-white shadow-clay-btn"
                        : "bg-background text-text-secondary shadow-clay-well"
                  }`}
                >
                  {isComplete ? <CheckCircle className="w-5 h-5" aria-hidden="true" /> : <Icon className="w-5 h-5" aria-hidden="true" />}
                </button>
                <span className={`text-[11px] sm:text-xs font-bold leading-tight ${isActive ? "text-primary" : "text-text-secondary"}`}>{s.label}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="container mx-auto px-4 pt-6 max-w-2xl">
        <Card>
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary mb-1">Personal Information</h2>
                  <p className="text-text-secondary text-sm">
                    Tell us about yourself so brands can learn more about you.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                  <Input
                    label="Location"
                    placeholder="Mumbai, India"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </div>
                <Input
                  label="Content Niche"
                  placeholder="e.g. Fashion, Lifestyle, Tech Reviews"
                  value={form.niche}
                  onChange={(e) => updateField("niche", e.target.value)}
                />
                <Textarea
                  label="Short Bio"
                  placeholder="A brief introduction about yourself and your content..."
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  rows={3}
                />
                <Input
                  label="Website / Portfolio"
                  placeholder="https://yourwebsite.com"
                  value={form.website}
                  onChange={(e) => updateField("website", e.target.value)}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-11 h-11 shrink-0 rounded-full bg-clay-rose grid place-items-center shadow-clay-sm">
                    <Instagram className="w-5 h-5 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-extrabold text-primary mb-1">Instagram Metrics</h2>
                    <p className="text-text-secondary text-sm">
                      Share your Instagram performance data
                    </p>
                  </div>
                </div>
                <Input
                  label="Instagram Handle"
                  placeholder="@yourhandle"
                  value={form.igHandle}
                  onChange={(e) => updateField("igHandle", e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Followers"
                    type="number"
                    placeholder="e.g. 50000"
                    value={form.igFollowers}
                    onChange={(e) => updateField("igFollowers", e.target.value)}
                  />
                  <Input
                    label="Engagement Rate (%)"
                    type="number"
                    placeholder="e.g. 4.5"
                    value={form.igEngagementRate}
                    onChange={(e) => updateField("igEngagementRate", e.target.value)}
                  />
                  <Input
                    label="Average Likes per Post"
                    type="number"
                    placeholder="e.g. 2000"
                    value={form.igAvgLikes}
                    onChange={(e) => updateField("igAvgLikes", e.target.value)}
                  />
                  <Input
                    label="Average Comments per Post"
                    type="number"
                    placeholder="e.g. 150"
                    value={form.igAvgComments}
                    onChange={(e) => updateField("igAvgComments", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-11 h-11 shrink-0 rounded-full bg-clay-sky grid place-items-center shadow-clay-sm">
                    <Youtube className="w-5 h-5 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-extrabold text-primary mb-1">YouTube Metrics</h2>
                    <p className="text-text-secondary text-sm">
                      Share your YouTube channel performance
                    </p>
                  </div>
                </div>
                <Input
                  label="Channel Name / URL"
                  placeholder="Your YouTube channel"
                  value={form.ytChannel}
                  onChange={(e) => updateField("ytChannel", e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Subscribers"
                    type="number"
                    placeholder="e.g. 100000"
                    value={form.ytSubscribers}
                    onChange={(e) => updateField("ytSubscribers", e.target.value)}
                  />
                  <Input
                    label="Average Views per Video"
                    type="number"
                    placeholder="e.g. 25000"
                    value={form.ytAvgViews}
                    onChange={(e) => updateField("ytAvgViews", e.target.value)}
                  />
                </div>
                <Input
                  label="Engagement Rate (%)"
                  type="number"
                  placeholder="e.g. 6.2"
                  value={form.ytEngagementRate}
                  onChange={(e) => updateField("ytEngagementRate", e.target.value)}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary mb-1">Other Platforms</h2>
                  <p className="text-text-secondary text-sm">
                    Add your Facebook and X/Twitter metrics (optional)
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 shrink-0 rounded-full bg-clay-sky grid place-items-center shadow-clay-sm">
                      <Facebook className="w-4 h-4 text-primary" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-extrabold text-primary">Facebook</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Page Name / URL"
                      placeholder="Your Facebook page"
                      value={form.fbPage}
                      onChange={(e) => updateField("fbPage", e.target.value)}
                    />
                    <Input
                      label="Followers"
                      type="number"
                      placeholder="e.g. 30000"
                      value={form.fbFollowers}
                      onChange={(e) => updateField("fbFollowers", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Engagement Rate (%)"
                    type="number"
                    placeholder="e.g. 3.1"
                    value={form.fbEngagementRate}
                    onChange={(e) => updateField("fbEngagementRate", e.target.value)}
                  />
                </div>

                <hr className="border-t-2 border-muted" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 shrink-0 rounded-full bg-clay-cloud grid place-items-center shadow-clay-sm">
                      <Twitter className="w-4 h-4 text-primary" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-extrabold text-primary">X (Twitter)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Handle"
                      placeholder="@yourhandle"
                      value={form.xHandle}
                      onChange={(e) => updateField("xHandle", e.target.value)}
                    />
                    <Input
                      label="Followers"
                      type="number"
                      placeholder="e.g. 15000"
                      value={form.xFollowers}
                      onChange={(e) => updateField("xFollowers", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Engagement Rate (%)"
                    type="number"
                    placeholder="e.g. 2.8"
                    value={form.xEngagementRate}
                    onChange={(e) => updateField("xEngagementRate", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary mb-1">Your Proposal</h2>
                  <p className="text-text-secondary text-sm">
                    Tell the brand why you&apos;re the perfect fit for this collaboration.
                  </p>
                </div>
                <Textarea
                  label="Collaboration Pitch *"
                  placeholder="Explain why you're a great fit for this brand, your content style, past campaign experience, and what unique value you bring..."
                  value={form.proposal}
                  onChange={(e) => updateField("proposal", e.target.value)}
                  rows={6}
                  helperText={`${form.proposal.length}/50 characters minimum`}
                  error={
                    form.proposal.length > 0 && form.proposal.length < 50
                      ? "Minimum 50 characters required"
                      : undefined
                  }
                />
                <Input
                  label="Expected Rate (INR)"
                  type="number"
                  placeholder="e.g. 25000"
                  value={form.expectedRate}
                  onChange={(e) => updateField("expectedRate", e.target.value)}
                  helperText="Your expected fee for this collaboration"
                />
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">
                    Deliverables you can provide *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {DELIVERABLE_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleDeliverable(item)}
                        aria-pressed={form.deliverables.includes(item)}
                        className={`clay-press px-3 pt-2.5 pb-2 rounded-2xl text-sm font-bold ${
                          form.deliverables.includes(item)
                            ? "bg-accent text-white shadow-clay-btn"
                            : "bg-background text-primary shadow-clay-sm"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {form.deliverables.length === 0 && (
                    <p className="text-xs text-text-secondary mt-2">
                      Select at least one deliverable
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary mb-1">Review Your Application</h2>
                  <p className="text-text-secondary text-sm">
                    Double-check everything before submitting.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl bg-background p-4 shadow-clay-well">
                    <h3 className="font-extrabold text-base text-primary mb-2">
                      Personal Info
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-text-secondary">Name:</span>{" "}
                        <span className="font-medium">{form.name}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary">Email:</span>{" "}
                        <span className="font-medium">{form.email}</span>
                      </div>
                      {form.phone && (
                        <div>
                          <span className="text-text-secondary">Phone:</span>{" "}
                          <span className="font-medium">{form.phone}</span>
                        </div>
                      )}
                      {form.location && (
                        <div>
                          <span className="text-text-secondary">Location:</span>{" "}
                          <span className="font-medium">{form.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {form.igHandle && (
                    <div className="rounded-3xl bg-background p-4 shadow-clay-well">
                      <h3 className="font-extrabold text-base text-primary mb-2">
                        Instagram
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-text-secondary">Handle:</span>{" "}
                          <span className="font-medium">{form.igHandle}</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Followers:</span>{" "}
                          <span className="font-medium">
                            {Number(form.igFollowers).toLocaleString()}
                          </span>
                        </div>
                        {form.igEngagementRate && (
                          <div>
                            <span className="text-text-secondary">Engagement:</span>{" "}
                            <span className="font-medium">{form.igEngagementRate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {form.ytChannel && (
                    <div className="rounded-3xl bg-background p-4 shadow-clay-well">
                      <h3 className="font-extrabold text-base text-primary mb-2">
                        YouTube
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-text-secondary">Channel:</span>{" "}
                          <span className="font-medium">{form.ytChannel}</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Subscribers:</span>{" "}
                          <span className="font-medium">
                            {Number(form.ytSubscribers).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-accent/5 rounded-xl p-4">
                    <h3 className="font-semibold text-sm text-accent uppercase tracking-wider mb-3">
                      Proposal
                    </h3>
                    <p className="text-sm mb-3">{form.proposal}</p>
                    {form.expectedRate && (
                      <p className="text-sm">
                        <span className="text-text-secondary">Expected Rate:</span>{" "}
                        <span className="font-medium">
                          ₹{Number(form.expectedRate).toLocaleString()}
                        </span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.deliverables.map((d) => (
                        <span
                          key={d}
                          className="px-2.5 pt-1 pb-0.5 rounded-full bg-clay-butter text-xs font-bold text-primary shadow-clay-sm"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t-2 border-muted">
              <Button
                variant="ghost"
                onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? "Cancel" : "Back"}
              </Button>

              <span className="hidden sm:inline text-sm font-semibold text-text-secondary">
                Step {step} of {STEPS.length}
              </span>

              {step < 6 ? (
                <Button
                  variant="accent"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="accent" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {submitting ? "Sending pitch…" : `Send pitch to ${brand.name}`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

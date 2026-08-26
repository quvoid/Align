"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { INITIAL_BRANDS, ApplicationItem } from "@/lib/mock-data";
import { getUserData, addApplication } from "@/lib/user-store";
import { useSession } from "next-auth/react";
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
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Instagram", icon: Instagram },
  { id: 3, label: "YouTube", icon: Youtube },
  { id: 4, label: "Other Platforms", icon: Facebook },
  { id: 5, label: "Proposal", icon: Send },
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
  const [step, setStep] = useState(1);

  const brand = INITIAL_BRANDS.find((b) => b.slug === resolvedParams.slug);

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

  useEffect(() => {
    if (session?.user?.email) {
      const data = getUserData(session.user.email);
      const profile = data.profile;
      
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
        igFollowers: profile.igFollowers?.toString() || prev.igFollowers,
        igEngagementRate: profile.igER?.toString() || prev.igEngagementRate,
        ytChannel: profile.ytChannel || prev.ytChannel,
        ytSubscribers: profile.ytSubscribers?.toString() || prev.ytSubscribers,
        ytAvgViews: profile.ytAvgViews?.toString() || prev.ytAvgViews,
        fbFollowers: profile.fbFollowers?.toString() || prev.fbFollowers,
      }));
    }
  }, [session]);

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Brand Brief Not Found</h1>
        <p className="text-text-secondary mb-6">The campaign you are looking for does not exist.</p>
        <Link href="/brands">
          <Button variant="primary">Return to Brands</Button>
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
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your application.",
        type: "error",
      });
      return;
    }

    try {
      const newApplication: ApplicationItem = {
        id: `app_${Date.now().toString()}`,
        creatorName: form.name,
        creatorEmail: session.user.email,
        brandId: brand.id,
        brandName: brand.name,
        status: "PENDING",
        date: new Date().toISOString().slice(0, 10),
        proposal: form.proposal,
        expectedRate: Number(form.expectedRate) || 0,
        deliverables: form.deliverables,
        metrics: {
          instagramHandle: form.igHandle || undefined,
          instagramFollowers: form.igFollowers ? Number(form.igFollowers) : undefined,
          instagramER: form.igEngagementRate ? `${form.igEngagementRate}%` : undefined,
          youtubeChannel: form.ytChannel || undefined,
          youtubeSubscribers: form.ytSubscribers ? Number(form.ytSubscribers) : undefined,
          facebookFollowers: form.fbFollowers ? Number(form.fbFollowers) : undefined,
        },
      };

      addApplication(session.user.email, newApplication);

      toast({
        title: "Application Submitted!",
        description: "Your collaboration proposal has been sent. We'll review it and get back to you soon.",
        type: "success",
      });
      
      window.location.href = "/dashboard";
    } catch (e) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-14 h-14 rounded-xl border-2 border-white/20 object-cover bg-white"
            />
            <div>
              <h1 className="text-2xl font-bold">
                Align with {brand.name}
              </h1>
              <p className="text-white/70 text-sm">
                Submit your verified metrics and proposal to the Schbang brand team
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-1">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isComplete = s.id < step;
              return (
                <button
                  key={s.id}
                  onClick={() => s.id < step && setStep(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-accent text-white"
                      : isComplete
                      ? "bg-green-50 text-green-700"
                      : "text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Personal Information</h2>
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
                    placeholder="+91 98765 43210"
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Instagram Metrics</h2>
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
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">YouTube Metrics</h2>
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
                  <h2 className="text-xl font-bold mb-1">Other Platforms</h2>
                  <p className="text-text-secondary text-sm">
                    Add your Facebook and X/Twitter metrics (optional)
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Facebook className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold">Facebook</h3>
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

                <hr className="border-border" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold">X (Twitter)</h3>
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
                  <h2 className="text-xl font-bold mb-1">Your Proposal</h2>
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
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Deliverables You Can Provide *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {DELIVERABLE_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleDeliverable(item)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          form.deliverables.includes(item)
                            ? "bg-accent text-white border-accent"
                            : "bg-white text-text-secondary border-border hover:border-accent/50"
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
                  <h2 className="text-xl font-bold mb-1">Review Your Application</h2>
                  <p className="text-text-secondary text-sm">
                    Double-check everything before submitting.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">
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
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                      <h3 className="font-semibold text-sm text-purple-700 uppercase tracking-wider mb-3">
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
                    <div className="bg-red-50 rounded-xl p-4">
                      <h3 className="font-semibold text-sm text-red-700 uppercase tracking-wider mb-3">
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
                          className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-md"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? "Cancel" : "Back"}
              </Button>

              <span className="text-sm text-text-secondary">
                Step {step} of {STEPS.length}
              </span>

              {step < 6 ? (
                <Button
                  variant="primary"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="accent" onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

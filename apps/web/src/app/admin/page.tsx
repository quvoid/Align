"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { BrandItem, ApplicationItem } from "@/lib/mock-data";
import type { InterestItem } from "@/lib/db-records";
import {
  createBrief,
  fetchAdminDashboard,
  reviewApplication,
  setBriefActive,
  type NewBrief,
} from "@/lib/admin-client";
import { errorMessage } from "@/lib/fetch-json";
import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE, STATUS_LABEL } from "@/lib/status";
import { fillFor } from "@/lib/fills";
import { addCompetitorToBrand } from "@/lib/instagram-engine";
import { CheckCircle2, Plus, Search, Filter, Instagram, Youtube, Facebook, ExternalLink, Check, X, Heart, Users, Send, Loader2 } from "lucide-react";

type ReviewStatus = Exclude<ApplicationItem["status"], "WITHDRAWN">;

const EMPTY_BRIEF: NewBrief & { competitors: string[] } = {
  name: "",
  industry: "Fashion & Apparel",
  budgetTier: "Mid-Tier",
  description: "",
  logo: "",
  coverImage: "",
  requirements: "",
  campaignTypes: "Instagram Reel, YouTube Short",
  contactEmail: "",
  website: "",
  competitors: ["", "", "", ""], // up to 4 competitor IG handles
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "brands" | "applications" | "interests">("overview");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");

  // Brands State
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [brandIndustryFilter, setBrandIndustryFilter] = useState("ALL");
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // New Brand Form State
  const [newBrand, setNewBrand] = useState(EMPTY_BRIEF);

  // Applications State
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [appFilter, setAppFilter] = useState<string>("ALL");
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  // Creators who liked a brief
  const [interests, setInterests] = useState<InterestItem[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminDashboard();
      setBrands(data.briefs);
      setApplications(data.applications);
      setInterests(data.interests);
      setSelectedApp((prev) => (prev ? data.applications.find((a) => a.id === prev.id) ?? null : null));
      setLoadState("ready");
    } catch (err) {
      setLoadError(errorMessage(err));
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The note box follows whichever pitch is open in the inspector.
  useEffect(() => {
    setNoteDraft(selectedApp?.adminNotes ?? "");
  }, [selectedApp?.id, selectedApp?.adminNotes]);

  // Handle Add Brand
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name || !newBrand.description) {
      toast({ title: "Please fill required fields", type: "error" });
      return;
    }

    const { competitors, ...brief } = newBrand;
    setPublishing(true);
    let created: BrandItem;
    try {
      created = await createBrief(brief);
    } catch (err) {
      toast({ title: "Brief not published", description: errorMessage(err), type: "error" });
      setPublishing(false);
      return;
    }
    setPublishing(false);
    setBrands((prev) => [created, ...prev]);

    // Register competitors for the new brand
    const competitorHandles = competitors.filter((h) => h.trim() !== "");
    for (const handle of competitorHandles) {
      addCompetitorToBrand(created.slug, handle);
    }

    setIsAddBrandOpen(false);
    setNewBrand(EMPTY_BRIEF);

    const compCount = competitorHandles.length;
    toast({
      title: `${created.name} brief published`,
      description: `It is live on /brands/${created.slug}${compCount > 0 ? ` with ${compCount} competitor${compCount > 1 ? "s" : ""} tracked.` : "."}`,
      type: "success",
    });
  };

  // Toggle Brand Status
  const toggleBrandStatus = async (brand: BrandItem) => {
    try {
      const updated = await setBriefActive(brand.id, !brand.isActive);
      setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast({
        title: updated.isActive ? `${updated.name} brief re-opened` : `${updated.name} brief paused`,
        description: updated.isActive ? "Creators can see and pitch to it again." : "It no longer shows on the public site.",
        type: "success",
      });
    } catch (err) {
      toast({ title: "Brief status not changed", description: errorMessage(err), type: "error" });
    }
  };

  const applyReview = async (appId: string, patch: { status?: ReviewStatus; adminNotes?: string }) => {
    setSavingReview(true);
    try {
      const updated = await reviewApplication(appId, patch);
      setApplications((prev) => prev.map((a) => (a.id === appId ? updated : a)));
      setSelectedApp((prev) => (prev && prev.id === appId ? updated : prev));
      return updated;
    } catch (err) {
      toast({ title: "Change not saved", description: errorMessage(err), type: "error" });
      return null;
    } finally {
      setSavingReview(false);
    }
  };

  // Update Application Status
  const handleUpdateAppStatus = async (appId: string, status: ReviewStatus) => {
    const updated = await applyReview(appId, { status });
    if (updated) {
      toast({
        title: `Pitch marked ${status.replace("_", " ").toLowerCase()}`,
        description: `${updated.creatorName} sees this on their dashboard now.`,
        type: "success",
      });
    }
  };

  const handleSaveNote = async () => {
    if (!selectedApp) return;
    const updated = await applyReview(selectedApp.id, { adminNotes: noteDraft });
    if (updated) {
      toast({
        title: "Note saved",
        description: `${updated.creatorName} sees it with this pitch on their dashboard.`,
        type: "success",
      });
    }
  };

  // Filtered Brands
  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
      b.description.toLowerCase().includes(brandSearch.toLowerCase());
    const matchesIndustry =
      brandIndustryFilter === "ALL" || b.industry.includes(brandIndustryFilter);
    return matchesSearch && matchesIndustry;
  });

  // Filtered Applications
  const filteredApps = applications.filter((a) => {
    if (appFilter === "ALL") return true;
    return a.status === appFilter;
  });

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const shortlistedCount = applications.filter((a) => a.status === "SHORTLISTED").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const withdrawnCount = applications.filter((a) => a.status === "WITHDRAWN").length;
  const activeBrands = brands.filter((b) => b.isActive);
  const industryCount = new Set(activeBrands.map((b) => b.industry)).size;

  if (loadState !== "ready") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        {loadState === "loading" ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Loading admin data" />
        ) : (
          <>
            <p className="text-sm text-text-secondary max-w-sm">Couldn&apos;t load the admin panel: {loadError}</p>
            <Button
              variant="outline"
              onClick={() => {
                setLoadState("loading");
                load();
              }}
            >
              Try again
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <h1 className="text-[44px] sm:text-6xl type-display leading-[0.95] text-primary">Admin</h1>
            <p className="mt-2 text-base sm:text-lg text-text-secondary">
              Briefs, the pitch queue and who&apos;s interested.
            </p>
          </div>
          <Button variant="accent" onClick={() => setIsAddBrandOpen(true)}>
            <Plus className="w-5 h-5 mr-1.5" aria-hidden="true" />
            New brief
          </Button>
        </div>

        {/* Tabs: one outlined track, the open tab is the ink block. */}
        <nav className="mt-7 flex gap-1.5 overflow-x-auto rounded-lg bg-surface p-1.5 brut [scrollbar-width:none]" aria-label="Admin sections">
          <button onClick={() => setActiveTab("overview")} aria-current={activeTab === "overview" ? "page" : undefined}
            className={`brut-press shrink-0 flex items-center gap-2 min-h-11 px-4 rounded-md text-[15px] font-extrabold ${
                  activeTab === "overview" ? "bg-ink text-white" : "text-primary hover:bg-muted"
                }`}>
            Overview
          </button>
          <button onClick={() => setActiveTab("applications")} aria-current={activeTab === "applications" ? "page" : undefined}
            className={`brut-press shrink-0 flex items-center gap-2 min-h-11 px-4 rounded-md text-[15px] font-extrabold ${
                  activeTab === "applications" ? "bg-ink text-white" : "text-primary hover:bg-muted"
                }`}>
            Pitches
            {pendingCount > 0 && (
              <span className="min-w-6 h-6 px-1.5 grid place-items-center rounded border-2 border-ink bg-fill-butter text-primary font-mono text-[11px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab("brands")} aria-current={activeTab === "brands" ? "page" : undefined}
            className={`brut-press shrink-0 flex items-center gap-2 min-h-11 px-4 rounded-md text-[15px] font-extrabold ${
                  activeTab === "brands" ? "bg-ink text-white" : "text-primary hover:bg-muted"
                }`}>
            Briefs
            <span className="min-w-6 h-6 px-1.5 grid place-items-center rounded border-2 border-ink bg-fill-lilac text-primary font-mono text-[11px] font-bold">{brands.length}</span>
          </button>
          <button onClick={() => setActiveTab("interests")} aria-current={activeTab === "interests" ? "page" : undefined}
            className={`brut-press shrink-0 flex items-center gap-2 min-h-11 px-4 rounded-md text-[15px] font-extrabold ${
                  activeTab === "interests" ? "bg-ink text-white" : "text-primary hover:bg-muted"
                }`}>
            Interest
            <span className="min-w-6 h-6 px-1.5 grid place-items-center rounded border-2 border-ink bg-fill-rose text-primary font-mono text-[11px] font-bold">{interests.length}</span>
          </button>
          <Link href="/admin/competitor-intelligence" className="shrink-0 flex items-center min-h-11 px-4 rounded-md text-[15px] font-extrabold text-text-secondary hover:text-primary hover:bg-muted">
            Competitor intel
          </Link>
        </nav>
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Open briefs", value: activeBrands.length, note: `across ${industryCount} industr${industryCount === 1 ? "y" : "ies"}`, fill: "bg-fill-lilac" },
                { label: "Waiting on you", value: pendingCount, note: "pending a decision", fill: "bg-fill-butter" },
                { label: "Shortlisted", value: shortlistedCount, note: "ready for contract", fill: "bg-fill-sky" },
                { label: "Approved", value: approvedCount, note: "in production", fill: "bg-fill-mint" },
              ].map((k) => (
                <div key={k.label} className={`rounded-lg px-5 pt-4 pb-4 brut ${k.fill}`}>
                  <dt className="text-sm font-extrabold text-primary">{k.label}</dt>
                  <dd className="type-display mt-2 text-[56px] text-primary leading-[0.85]">{k.value}</dd>
                  <p className="mt-2 text-sm font-semibold text-primary/80">{k.note}</p>
                </div>
              ))}
            </dl>

            <section className="rounded-4xl bg-surface p-5 sm:p-6 brut">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-[30px] type-display text-primary">Latest pitches</h2>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("applications")}>
                  All pitches
                </Button>
              </div>
              {applications.every((a) => a.status === "WITHDRAWN") && (
                <p className="rounded-3xl bg-background px-5 py-4 text-[15px] text-text-secondary brut-well">
                  No pitches yet. They appear here as soon as a creator sends one.
                </p>
              )}
              <ul className="space-y-3">
                {applications.filter((a) => a.status !== "WITHDRAWN").slice(0, 4).map((app) => (
                  <li key={app.id} className="rounded-3xl bg-background p-4 brut-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-primary">{app.creatorName}</span>
                        <span className="text-sm text-text-secondary">→ {app.brandName}</span>
                        <Badge variant={STATUS_BADGE[app.status]}>{STATUS_LABEL[app.status]}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-1">{app.proposal}</p>
                      <p className="text-sm font-semibold text-primary">
                        {app.metrics.instagramFollowers ? `${app.metrics.instagramFollowers.toLocaleString("en-IN")} IG followers · ` : ""}
                        {app.expectedRate ? `₹${app.expectedRate.toLocaleString("en-IN")}` : "Fee not set"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedApp(app); setActiveTab("applications"); }}>
                        Review
                      </Button>
                      {app.status === "PENDING" || app.status === "UNDER_REVIEW" ? (
                        <Button size="sm" variant="accent" onClick={() => handleUpdateAppStatus(app.id, "SHORTLISTED")}>
                          Shortlist
                        </Button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* TAB 2: BRANDS MANAGEMENT */}
        {activeTab === "brands" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" aria-hidden="true" />
                <Input
                  placeholder="Search briefs"
                  aria-label="Search briefs"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="pl-12"
                />
              </div>

              <div className="flex items-center gap-3">
                <Select
                  options={[
                    { value: "ALL", label: "All industries" },
                    { value: "Food", label: "Food & FMCG" },
                    { value: "Lifestyle", label: "Lifestyle" },
                    { value: "Beauty", label: "Beauty & Skincare" },
                    { value: "Finance", label: "Finance" },
                    { value: "Fashion", label: "Fashion" },
                  ]}
                  value={brandIndustryFilter}
                  onChange={(e) => setBrandIndustryFilter(e.target.value)}
                />
                <Button variant="accent" onClick={() => setIsAddBrandOpen(true)} className="shrink-0">
                  <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  New brief
                </Button>
              </div>
            </div>

            {/* Briefs grid: the same pastel fill each brief wears on the public site. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <article key={brand.id} className={`rounded-4xl p-5 brut flex flex-col ${brand.isActive ? fillFor(brand.slug) : "bg-fill-cloud"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[28px] font-extrabold tracking-tight leading-none text-primary truncate">{brand.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-text-secondary">{brand.industry} · {brand.budgetTier}</p>
                    </div>
                    <span className={`shrink-0 px-3 py-0.75 rounded-full text-xs font-extrabold brut-sm ${brand.isActive ? "bg-fill-mint text-primary" : "bg-surface text-text-secondary"}`}>
                      {brand.isActive ? "Open" : "Paused"}
                    </span>
                  </div>

                  <p className="mt-3 text-[15px] leading-relaxed text-primary/85 line-clamp-3 flex-1">{brand.description}</p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {brand.campaignTypes.slice(0, 3).map((t) => (
                      <li key={t} className="px-2.5 py-0.75 rounded-full bg-white/60 brut-well text-xs font-semibold text-primary">{t}</li>
                    ))}
                  </ul>

                  <p className="mt-3 text-sm font-semibold text-text-secondary">{brand.likesCount} creators interested</p>

                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleBrandStatus(brand)} className="flex-1">
                      {brand.isActive ? "Pause brief" : "Re-open brief"}
                    </Button>
                    <a href={`/brands/${brand.slug}`} target="_blank" rel="noreferrer" aria-label={`Open the public ${brand.name} brief`}>
                      <Button size="sm" variant="outline" className="px-3" tabIndex={-1}>
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PITCH QUEUE */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="-mx-1 px-1 py-1 flex gap-2 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Filter pitches by status">
              {[
                { key: "ALL", label: `All (${applications.length})` },
                { key: "PENDING", label: `Pending (${pendingCount})` },
                { key: "UNDER_REVIEW", label: "In review" },
                { key: "SHORTLISTED", label: `Shortlisted (${shortlistedCount})` },
                { key: "APPROVED", label: `Approved (${approvedCount})` },
                { key: "REJECTED", label: "Not selected" },
                { key: "WITHDRAWN", label: `Withdrawn (${withdrawnCount})` },
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setAppFilter(pill.key)}
                  aria-pressed={appFilter === pill.key}
                  className={`brut-press shrink-0 min-h-11 px-4 rounded-full text-sm font-extrabold ${
                    appFilter === pill.key ? "bg-ink text-white brut-sm" : "bg-surface text-primary brut-sm"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
              <ul className="space-y-4">
                {filteredApps.length === 0 ? (
                  <li className="rounded-4xl bg-surface p-10 text-center text-[15px] text-text-secondary brut">
                    No pitches with this status.
                  </li>
                ) : (
                  filteredApps.map((app) => {
                    const selected = selectedApp?.id === app.id;
                    return (
                      <li key={app.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          aria-pressed={selected}
                          className={`brut-press w-full text-left rounded-4xl p-5 brut ${
                            selected ? "bg-fill-butter shadow-[6px_6px_0_0_#111]" : "bg-surface"
                          } ${app.status === "WITHDRAWN" ? "opacity-70" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-xl font-extrabold text-primary leading-tight">
                                {app.creatorName} <span className="text-text-secondary font-bold">→ {app.brandName}</span>
                              </h3>
                              <p className="text-sm text-text-secondary mt-0.5">
                                {app.creatorEmail} · sent {new Date(app.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </p>
                            </div>
                            <Badge variant={STATUS_BADGE[app.status]} className="shrink-0">{STATUS_LABEL[app.status]}</Badge>
                          </div>

                          <p className="mt-3 text-[15px] text-primary/85 leading-relaxed line-clamp-2">{app.proposal}</p>

                          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold">
                            {app.metrics.instagramFollowers ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.75 rounded-full bg-fill-rose brut-sm text-primary">
                                <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                                {app.metrics.instagramFollowers.toLocaleString("en-IN")}
                                {app.metrics.instagramER ? ` · ${app.metrics.instagramER}` : ""}
                              </span>
                            ) : null}
                            {app.metrics.youtubeSubscribers ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.75 rounded-full bg-fill-sky brut-sm text-primary">
                                <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
                                {app.metrics.youtubeSubscribers.toLocaleString("en-IN")}
                              </span>
                            ) : null}
                            <span className="ml-auto font-mono text-base font-bold text-primary">
                              {app.expectedRate ? `₹${app.expectedRate.toLocaleString("en-IN")}` : "No fee set"}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>

              {/* Inspector */}
              <div className="lg:sticky lg:top-28">
                {selectedApp ? (
                  <section className="rounded-4xl bg-surface p-6 brut space-y-6" aria-label={`Pitch from ${selectedApp.creatorName}`}>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-[30px] type-display text-primary leading-tight">{selectedApp.creatorName}</h2>
                        <Badge variant={STATUS_BADGE[selectedApp.status]} className="shrink-0">{STATUS_LABEL[selectedApp.status]}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary">{selectedApp.creatorEmail}</p>
                      {(selectedApp.applicant?.phone || selectedApp.applicant?.location) && (
                        <p className="text-sm text-text-secondary">
                          {[selectedApp.applicant?.phone, selectedApp.applicant?.location].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {selectedApp.creatorId && (
                        <Link href={`/creators/${selectedApp.creatorId}`} className="inline-flex items-center gap-1 mt-1.5 text-sm font-bold text-accent hover:underline underline-offset-4">
                          Open creator profile <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      )}
                    </div>

                    <div className={`rounded-3xl px-4 py-3 brut-sm ${fillFor(selectedApp.brandSlug || selectedApp.brandName)}`}>
                      <p className="text-xs font-semibold text-text-secondary">Brief</p>
                      <p className="text-lg font-extrabold text-primary">{selectedApp.brandName}</p>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-primary mb-2">Numbers they sent</h3>
                      <dl className="space-y-2 text-sm">
                        {selectedApp.metrics.instagramHandle && (
                          <div className="flex justify-between gap-3 rounded-2xl bg-background px-3.5 py-2.5 brut-well">
                            <dt className="text-text-secondary">Instagram {selectedApp.metrics.instagramHandle}</dt>
                            <dd className="font-extrabold text-primary tabular-nums">{selectedApp.metrics.instagramFollowers?.toLocaleString("en-IN")}</dd>
                          </div>
                        )}
                        {selectedApp.metrics.youtubeChannel && (
                          <div className="flex justify-between gap-3 rounded-2xl bg-background px-3.5 py-2.5 brut-well">
                            <dt className="text-text-secondary">YouTube {selectedApp.metrics.youtubeChannel}</dt>
                            <dd className="font-extrabold text-primary tabular-nums">{selectedApp.metrics.youtubeSubscribers?.toLocaleString("en-IN")}</dd>
                          </div>
                        )}
                        {selectedApp.metrics.facebookFollowers ? (
                          <div className="flex justify-between gap-3 rounded-2xl bg-background px-3.5 py-2.5 brut-well">
                            <dt className="text-text-secondary">Facebook</dt>
                            <dd className="font-extrabold text-primary tabular-nums">{selectedApp.metrics.facebookFollowers.toLocaleString("en-IN")}</dd>
                          </div>
                        ) : null}
                      </dl>
                      <p className="mt-2 text-xs text-text-secondary">Self-reported by the creator.</p>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-primary mb-2">Their idea</h3>
                      <p className="rounded-3xl bg-background p-4 text-[15px] leading-relaxed text-primary brut-well">{selectedApp.proposal}</p>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-primary mb-2">
                        Deliverables · {selectedApp.expectedRate ? `₹${selectedApp.expectedRate.toLocaleString("en-IN")}` : "no fee set"}
                      </h3>
                      <ul className="flex flex-wrap gap-1.5">
                        {selectedApp.deliverables.map((d) => (
                          <li key={d} className="px-3 py-0.75 rounded-full bg-fill-butter text-sm font-bold text-primary brut-sm">{d}</li>
                        ))}
                      </ul>
                    </div>

                    {selectedApp.status === "WITHDRAWN" ? (
                      <p className="rounded-3xl bg-fill-cloud px-4 py-3 text-sm text-primary brut-sm">
                        The creator withdrew this pitch, so there is nothing to decide.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-base font-extrabold text-primary">Decision</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="accent" disabled={savingReview} onClick={() => handleUpdateAppStatus(selectedApp.id, "SHORTLISTED")}>
                            <Check className="w-4 h-4 mr-1" aria-hidden="true" /> Shortlist
                          </Button>
                          <Button size="sm" variant="primary" disabled={savingReview} onClick={() => handleUpdateAppStatus(selectedApp.id, "APPROVED")}>
                            <CheckCircle2 className="w-4 h-4 mr-1" aria-hidden="true" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" disabled={savingReview} onClick={() => handleUpdateAppStatus(selectedApp.id, "UNDER_REVIEW")}>
                            Mark in review
                          </Button>
                          <Button size="sm" variant="outline" className="text-error" disabled={savingReview} onClick={() => handleUpdateAppStatus(selectedApp.id, "REJECTED")}>
                            <X className="w-4 h-4 mr-1" aria-hidden="true" /> Not selected
                          </Button>
                        </div>

                        <div className="pt-2 space-y-2">
                          <Textarea
                            label="Note to the creator"
                            placeholder="Shown on their dashboard with this pitch — what to change or what happens next."
                            rows={3}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled={savingReview || noteDraft === (selectedApp.adminNotes ?? "")}
                            onClick={handleSaveNote}
                          >
                            Save note
                          </Button>
                        </div>
                      </div>
                    )}
                  </section>
                ) : (
                  <p className="rounded-4xl bg-background p-8 text-center text-[15px] text-text-secondary brut-well">
                    Pick a pitch to read it, check the numbers and decide.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CREATOR INTEREST */}
        {activeTab === "interests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-[36px] type-display text-primary">Who&apos;s interested</h2>
                <p className="mt-1 text-[15px] text-text-secondary max-w-xl">
                  Creators who liked a brief. They haven&apos;t pitched it yet — a quick email often gets them to.
                </p>
              </div>
              <Link href="/creators" className="shrink-0">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  All creators
                </Button>
              </Link>
            </div>

            {interests.length === 0 && (
              <p className="rounded-4xl bg-background p-8 text-center text-[15px] text-text-secondary brut-well">
                No likes yet. When a creator likes a brief on /brands, they show up here.
              </p>
            )}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interests.map(({ id, brand: targetBrand, creator, likedAt }) => (
                <li key={id} className="rounded-4xl bg-surface p-5 brut flex flex-col">
                  <div className={`rounded-3xl px-4 py-3 brut-sm flex items-center justify-between gap-3 ${fillFor(targetBrand.slug)}`}>
                    <div className="min-w-0">
                      <p className="text-lg font-extrabold text-primary leading-tight truncate">{targetBrand.name}</p>
                      <p className="text-xs font-semibold text-text-secondary">
                        {targetBrand.budgetTier} · liked {new Date(likedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <span className="shrink-0 w-9 h-9 rounded-full bg-surface grid place-items-center brut-sm">
                      <Heart className="w-4 h-4 fill-[#E8457A] text-[#E8457A]" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <img src={creator.avatar} alt="" className="w-12 h-12 rounded-full object-cover bg-fill-butter brut-sm" />
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-primary truncate">{creator.name}</h3>
                      <p className="text-sm font-semibold text-text-secondary truncate">{creator.handle}{creator.location ? ` · ${creator.location}` : ""}</p>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-2xl bg-background px-2 py-1.75 brut-well">
                      <dt className="text-xs font-semibold text-text-secondary">Followers</dt>
                      <dd className="font-extrabold text-primary tabular-nums">
                        {creator.igFollowers != null ? creator.igFollowers.toLocaleString("en-IN") : "—"}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-background px-2 py-1.75 brut-well">
                      <dt className="text-xs font-semibold text-text-secondary">Engagement</dt>
                      <dd className="font-extrabold text-primary tabular-nums">
                        {creator.igEngagementRate != null ? `${creator.igEngagementRate}%` : "—"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center gap-2">
                    <Link href={`/creators/${creator.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Profile</Button>
                    </Link>
                    <a
                      href={`mailto:${creator.email}?subject=${encodeURIComponent(`${targetBrand.name} brief on Align`)}`}
                      className="flex-1"
                    >
                      <Button variant="accent" size="sm" className="w-full" tabIndex={-1}>
                        <Send className="w-4 h-4 mr-1.5" aria-hidden="true" />
                        Email creator
                      </Button>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal: Add New Brand */}
      <Modal
        isOpen={isAddBrandOpen}
        onClose={() => setIsAddBrandOpen(false)}
        title="New brief"
        description="It goes live on /brands as soon as you publish it."
        size="lg"
      >
        <form onSubmit={handleCreateBrand} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Brand Name *"
              placeholder="e.g. Puma India"
              value={newBrand.name}
              onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
              required
            />
            <Select
              label="Industry *"
              options={[
                { value: "Fashion & Apparel", label: "Fashion & Apparel" },
                { value: "Food & FMCG", label: "Food & FMCG" },
                { value: "Beauty & Skincare", label: "Beauty & Skincare" },
                { value: "Technology & Gadgets", label: "Technology & Gadgets" },
                { value: "Finance & FinTech", label: "Finance & FinTech" },
                { value: "Lifestyle & DIY", label: "Lifestyle & DIY" },
              ]}
              value={newBrand.industry}
              onChange={(e) => setNewBrand({ ...newBrand, industry: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Budget Tier *"
              options={[
                { value: "Nano", label: "Nano (<10k followers)" },
                { value: "Micro", label: "Micro (10k - 100k)" },
                { value: "Mid-Tier", label: "Mid-Tier (100k - 500k)" },
                { value: "Macro", label: "Macro (500k - 1M)" },
                { value: "Mega", label: "Mega (1M+)" },
              ]}
              value={newBrand.budgetTier}
              onChange={(e) => setNewBrand({ ...newBrand, budgetTier: e.target.value as BrandItem["budgetTier"] })}
            />
            <Input
              label="Contact Manager Email"
              placeholder="brandmanager@schbang.com"
              type="email"
              value={newBrand.contactEmail}
              onChange={(e) => setNewBrand({ ...newBrand, contactEmail: e.target.value })}
            />
          </div>

          <Textarea
            label="Campaign Brief & Description *"
            placeholder="Explain what the brand is looking for in this campaign..."
            rows={3}
            value={newBrand.description}
            onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
            required
          />

          <Input
            label="Creator Requirements"
            placeholder="e.g. Min 50k followers, >4% ER, Mumbai based"
            value={newBrand.requirements}
            onChange={(e) => setNewBrand({ ...newBrand, requirements: e.target.value })}
          />

          <Input
            label="Campaign Deliverables (comma separated)"
            placeholder="Instagram Reel, YouTube Short, Story with link"
            value={newBrand.campaignTypes}
            onChange={(e) => setNewBrand({ ...newBrand, campaignTypes: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Logo Image URL (Optional)"
              placeholder="https://..."
              value={newBrand.logo}
              onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
            />
            <Input
              label="Cover Banner URL (Optional)"
              placeholder="https://..."
              value={newBrand.coverImage}
              onChange={(e) => setNewBrand({ ...newBrand, coverImage: e.target.value })}
            />
          </div>

          {/* Competitor Tracking Section */}
          <div className="pt-4 border-t-2 border-muted space-y-3">
            <div>
              <label className="text-xs font-bold text-primary block mb-1">
                Track Competitors (Optional — up to 4)
              </label>
              <p className="text-[11px] text-text-secondary mb-3">
                Add competitor Instagram handles to track their creator collaborations, boost detection, and paid partnership data.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {newBrand.competitors.map((comp, idx) => (
                <Input
                  key={idx}
                  placeholder={`Competitor ${idx + 1} IG handle (e.g. @parleg_official)`}
                  value={comp}
                  onChange={(e) => {
                    const updated = [...newBrand.competitors];
                    updated[idx] = e.target.value;
                    setNewBrand({ ...newBrand, competitors: updated });
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddBrandOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={publishing}>
              {publishing ? "Publishing…" : "Publish brief"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

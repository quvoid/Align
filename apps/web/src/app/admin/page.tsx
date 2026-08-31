"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { INITIAL_BRANDS, INITIAL_APPLICATIONS, INITIAL_CREATORS, BrandItem, ApplicationItem, CreatorItem } from "@/lib/mock-data";
import {
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Instagram,
  Youtube,
  Facebook,
  ExternalLink,
  Check,
  X,
  TrendingUp,
  Heart,
  Users,
  Send,
  Star,
  Briefcase,
} from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "brands" | "applications" | "interests">("overview");

  // Brands State
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [brandSearch, setBrandSearch] = useState("");
  const [brandIndustryFilter, setBrandIndustryFilter] = useState("ALL");
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);

  // New Brand Form State
  const [newBrand, setNewBrand] = useState({
    name: "",
    industry: "Fashion",
    budgetTier: "Mid-Tier" as BrandItem["budgetTier"],
    description: "",
    logo: "",
    coverImage: "",
    requirements: "",
    campaignTypes: "Instagram Reel, YouTube Short",
    contactEmail: "",
    website: "",
  });

  // Applications State
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [appFilter, setAppFilter] = useState<string>("ALL");
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  // Handle Add Brand
  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name || !newBrand.description) {
      toast({ title: "Please fill required fields", type: "error" });
      return;
    }

    const slug = newBrand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created: BrandItem = {
      id: `brand-${Date.now()}`,
      name: newBrand.name,
      slug,
      industry: newBrand.industry,
      budgetTier: newBrand.budgetTier,
      description: newBrand.description,
      logo: newBrand.logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop",
      coverImage: newBrand.coverImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop",
      campaignTypes: newBrand.campaignTypes.split(",").map((s) => s.trim()),
      requirements: newBrand.requirements || "Creator collaboration brief",
      isActive: true,
      contactEmail: newBrand.contactEmail,
      website: newBrand.website,
      likesCount: 0,
    };

    setBrands((prev) => [created, ...prev]);
    setIsAddBrandOpen(false);
    setNewBrand({
      name: "",
      industry: "Fashion",
      budgetTier: "Mid-Tier",
      description: "",
      logo: "",
      coverImage: "",
      requirements: "",
      campaignTypes: "Instagram Reel, YouTube Short",
      contactEmail: "",
      website: "",
    });

    toast({
      title: "Brand Added Successfully!",
      description: `${created.name} is now active on the Align brand directory.`,
      type: "success",
    });
  };

  // Toggle Brand Status
  const toggleBrandStatus = (id: string) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    toast({ title: "Brand status updated", type: "success" });
  };

  // Update Application Status
  const handleUpdateAppStatus = (appId: string, status: ApplicationItem["status"]) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status } : null));
    }
    toast({
      title: `Application ${status.replace("_", " ")}`,
      description: `Creator proposal has been marked as ${status}.`,
      type: "success",
    });
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Admin Top Header */}
      <div className="bg-primary text-white py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Align Admin Portal</h1>
              <p className="text-white/70 text-sm mt-1">
                Manage brand portfolios, review creator metrics & coordinate partnership ads
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="accent"
                className="shadow-lg shadow-accent/25"
                onClick={() => setIsAddBrandOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Brand Brief
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-white/15">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "overview"
                  ? "border-accent text-accent"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              📊 Overview & KPIs
            </button>
            <button
              onClick={() => setActiveTab("brands")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "brands"
                  ? "border-accent text-accent"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              🏢 Brands Directory ({brands.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "applications"
                  ? "border-accent text-accent"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              📋 Review Applications
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-accent text-white font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("interests")}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "interests"
                  ? "border-accent text-accent"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              ❤️ Creator Likes Queue
              <span className="px-2 py-0.5 rounded-full text-xs bg-red-500 text-white font-bold">
                {INITIAL_CREATORS.reduce((acc, c) => acc + c.likedBrandIds.length, 0)}
              </span>
            </button>
            <Link
              href="/admin/competitor-intelligence"
              className="px-4 py-2.5 text-sm font-semibold border-b-2 border-transparent text-white/70 hover:text-white flex items-center gap-1.5 transition-all"
            >
              ⚡ Competitor Intelligence
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Active Brands
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-primary">
                    {brands.filter((b) => b.isActive).length}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Across 6 industries</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Pending Reviews
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-amber-600">{pendingCount}</div>
                  <p className="text-xs text-text-secondary mt-1">Requires manager review</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Shortlisted Deals
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-accent">{shortlistedCount}</div>
                  <p className="text-xs text-text-secondary mt-1">Ready for contract release</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Approved Deals
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-green-600">{approvedCount}</div>
                  <p className="text-xs text-text-secondary mt-1">In active production</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Incoming Submissions Preview */}
            <Card className="border-border shadow-sm">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-primary">Recent Creator Proposals</h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Latest submissions received across Schbang brand briefs
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("applications")}>
                  View All Submissions &rarr;
                </Button>
              </div>
              <div className="divide-y divide-border">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{app.creatorName}</span>
                        <span className="text-xs text-text-secondary">({app.creatorEmail})</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 font-medium text-primary">
                          {app.brandName}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1">{app.proposal}</p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span>IG: {app.metrics.instagramHandle || "N/A"} ({app.metrics.instagramFollowers?.toLocaleString()} followers)</span>
                        <span>•</span>
                        <span>Fee: ₹{app.expectedRate.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApp(app);
                          setActiveTab("applications");
                        }}
                      >
                        Inspect Metrics
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleUpdateAppStatus(app.id, "SHORTLISTED")}
                      >
                        Shortlist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: BRANDS MANAGEMENT */}
        {activeTab === "brands" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <Input
                  placeholder="Search brands by name or description..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-3">
                <Select
                  options={[
                    { value: "ALL", label: "All Industries" },
                    { value: "Food", label: "Food & FMCG" },
                    { value: "Lifestyle", label: "Lifestyle" },
                    { value: "Beauty", label: "Beauty & Skincare" },
                    { value: "Finance", label: "Finance" },
                    { value: "Fashion", label: "Fashion" },
                  ]}
                  value={brandIndustryFilter}
                  onChange={(e) => setBrandIndustryFilter(e.target.value)}
                />
                <Button variant="accent" onClick={() => setIsAddBrandOpen(true)}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Brand
                </Button>
              </div>
            </div>

            {/* Brands Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <Card key={brand.id} className="border-border hover:shadow-md transition-all flex flex-col">
                  <div className="h-32 relative bg-gray-100 overflow-hidden">
                    <img
                      src={brand.coverImage}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          brand.isActive
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {brand.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-10 h-10 rounded-xl border border-border object-cover bg-white"
                      />
                      <div>
                        <h3 className="font-bold text-base text-primary">{brand.name}</h3>
                        <span className="text-xs text-text-secondary">{brand.industry}</span>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed flex-1">
                      {brand.description}
                    </p>

                    <div className="text-xs space-y-1.5 border-t border-border pt-3 mb-4 text-text-secondary">
                      <div>
                        <strong className="text-primary font-medium">Budget Tier:</strong>{" "}
                        {brand.budgetTier}
                      </div>
                      <div>
                        <strong className="text-primary font-medium">Deliverables:</strong>{" "}
                        {brand.campaignTypes.join(", ")}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleBrandStatus(brand.id)}
                        className="flex-1 text-xs"
                      >
                        {brand.isActive ? "Pause Brief" : "Activate Brief"}
                      </Button>
                      <a href={`/brands/${brand.slug}`} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="ghost" className="px-2.5">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS REVIEW PORTAL */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            {/* Filter Pill Buttons */}
            <div className="flex flex-wrap gap-2 items-center justify-between border-b border-border pb-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "ALL", label: "All Proposals" },
                  { key: "PENDING", label: `Pending Review (${pendingCount})` },
                  { key: "SHORTLISTED", label: `Shortlisted (${shortlistedCount})` },
                  { key: "APPROVED", label: `Approved (${approvedCount})` },
                  { key: "REJECTED", label: "Rejected" },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setAppFilter(pill.key)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      appFilter === pill.key
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-text-secondary border border-border hover:bg-gray-50"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredApps.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-border text-text-secondary">
                    No applications found matching this status.
                  </div>
                ) : (
                  filteredApps.map((app) => (
                    <Card
                      key={app.id}
                      className={`cursor-pointer transition-all border ${
                        selectedApp?.id === app.id
                          ? "border-accent ring-2 ring-accent/20 shadow-md"
                          : "border-border hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-primary">{app.creatorName}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
                                {app.brandName}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary">{app.creatorEmail} • Submitted {app.date}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                app.status === "APPROVED"
                                  ? "bg-green-100 text-green-700"
                                  : app.status === "SHORTLISTED"
                                  ? "bg-purple-100 text-purple-700"
                                  : app.status === "REJECTED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {app.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-text-primary line-clamp-2 mb-4 leading-relaxed">
                          &ldquo;{app.proposal}&rdquo;
                        </p>

                        {/* Metrics Badges */}
                        <div className="flex flex-wrap gap-3 pt-3 border-t border-border text-xs text-text-secondary">
                          {app.metrics.instagramHandle && (
                            <span className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-md font-medium">
                              <Instagram className="w-3.5 h-3.5" />
                              {app.metrics.instagramFollowers?.toLocaleString()} (ER: {app.metrics.instagramER})
                            </span>
                          )}
                          {app.metrics.youtubeSubscribers && (
                            <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-2 py-1 rounded-md font-medium">
                              <Youtube className="w-3.5 h-3.5" />
                              {app.metrics.youtubeSubscribers.toLocaleString()} subs
                            </span>
                          )}
                          <span className="font-bold text-primary ml-auto">
                            ₹{app.expectedRate.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Right Col: Inspection & Action Drawer */}
              <div className="lg:col-span-1">
                {selectedApp ? (
                  <Card className="sticky top-20 border-border shadow-lg">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-accent">
                            Proposal Inspector
                          </span>
                          <span className="text-xs text-text-secondary">{selectedApp.date}</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-primary">{selectedApp.creatorName}</h2>
                        <p className="text-xs text-text-secondary">{selectedApp.creatorEmail}</p>
                      </div>

                      {/* Brand Applied */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-border">
                        <div className="text-xs text-text-secondary font-medium">Target Brand Brief</div>
                        <div className="text-sm font-bold text-primary">{selectedApp.brandName}</div>
                      </div>

                      {/* Verified Metrics */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                          Submitted Metrics
                        </h3>
                        <div className="space-y-1.5 text-xs">
                          {selectedApp.metrics.instagramHandle && (
                            <div className="flex justify-between p-2 bg-purple-50 rounded-lg text-purple-900">
                              <span>Instagram ({selectedApp.metrics.instagramHandle})</span>
                              <span className="font-bold">{selectedApp.metrics.instagramFollowers?.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedApp.metrics.youtubeChannel && (
                            <div className="flex justify-between p-2 bg-red-50 rounded-lg text-red-900">
                              <span>YouTube ({selectedApp.metrics.youtubeChannel})</span>
                              <span className="font-bold">{selectedApp.metrics.youtubeSubscribers?.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedApp.metrics.facebookFollowers && (
                            <div className="flex justify-between p-2 bg-blue-50 rounded-lg text-blue-900">
                              <span>Facebook Followers</span>
                              <span className="font-bold">{selectedApp.metrics.facebookFollowers.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pitch & Proposal */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                          Collaboration Pitch
                        </h3>
                        <p className="text-xs text-text-primary leading-relaxed bg-gray-50 p-3 rounded-xl border border-border">
                          {selectedApp.proposal}
                        </p>
                      </div>

                      {/* Deliverables & Fee */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                          Deliverables & Proposed Fee
                        </h3>
                        <div className="text-sm font-bold text-primary mb-2">
                          ₹{selectedApp.expectedRate.toLocaleString()} INR
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedApp.deliverables.map((d, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-[11px] text-text-secondary font-medium">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Admin Decision Actions */}
                      <div className="pt-4 border-t border-border space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                          Decision Workflow
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="accent"
                            onClick={() => handleUpdateAppStatus(selectedApp.id, "SHORTLISTED")}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUpdateAppStatus(selectedApp.id, "APPROVED")}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateAppStatus(selectedApp.id, "UNDER_REVIEW")}
                          >
                            Under Review
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-error hover:bg-red-50"
                            onClick={() => handleUpdateAppStatus(selectedApp.id, "REJECTED")}
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="p-8 text-center bg-gray-50 border border-dashed border-border rounded-2xl text-xs text-text-secondary">
                    Select an application to inspect creator analytics and make a review decision.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CREATOR LIKES QUEUE (HOT LEADS) */}
        {activeTab === "interests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-border">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  Creator Likes &amp; Expressed Interest Queue
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Creators who bookmarked or expressed interest in active brand briefs. Reach out directly with fast-track collaboration offers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/creators">
                  <Button variant="outline" size="sm" className="text-xs font-bold">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Open Creator Roster
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interested Creators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_CREATORS.flatMap((creator) =>
                creator.likedBrandIds.map((brandId) => {
                  const targetBrand = brands.find((b) => b.id === brandId);
                  if (!targetBrand) return null;

                  return (
                    <Card key={`${creator.id}-${brandId}`} className="border-border hover:shadow-lg transition-all flex flex-col justify-between">
                      <CardContent className="p-6">
                        {/* Target Brand Header Banner */}
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-red-50/70 border border-red-100 mb-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={targetBrand.logo}
                              alt={targetBrand.name}
                              className="w-7 h-7 rounded-lg object-cover bg-white border border-border"
                            />
                            <div>
                              <div className="text-xs font-bold text-primary">
                                Interested in {targetBrand.name}
                              </div>
                              <span className="text-[10px] text-red-600 font-semibold">
                                {targetBrand.budgetTier} Tier Brief
                              </span>
                            </div>
                          </div>
                          <span className="p-1.5 rounded-full bg-red-100 text-red-600">
                            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                          </span>
                        </div>

                        {/* Creator Info */}
                        <div className="flex items-start gap-3.5 mb-4">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-border"
                          />
                          <div>
                            <h3 className="font-extrabold text-sm text-primary">
                              {creator.name}
                            </h3>
                            <p className="text-xs font-semibold text-accent">
                              {creator.handle}
                            </p>
                            <span className="text-[11px] text-text-secondary">
                              {creator.location}
                            </span>
                          </div>
                        </div>

                        {/* Social Metrics */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 border border-border text-center text-xs mb-4">
                          <div>
                            <span className="text-text-secondary text-[10px] font-medium block">Followers</span>
                            <span className="font-black text-primary">
                              {(creator.igFollowers / 1000).toFixed(0)}k
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary text-[10px] font-medium block">Engagement Rate</span>
                            <span className="font-black text-green-600">
                              {creator.igEngagementRate}% ER
                            </span>
                          </div>
                        </div>

                        {/* Past Experience */}
                        <div className="space-y-1.5 border-t border-border pt-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                            Past Brand Collabs:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {creator.brandCollaborations.slice(0, 2).map((collab, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white border border-border text-[10px] font-bold text-primary"
                              >
                                {collab.brandName}
                              </span>
                            ))}
                            {creator.brandCollaborations.length > 2 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-text-secondary">
                                +{creator.brandCollaborations.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      {/* Card Action */}
                      <div className="p-4 bg-gray-50 border-t border-border flex items-center gap-2">
                        <Link href={`/creators/${creator.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                            Scorecard
                          </Button>
                        </Link>
                        <Button
                          variant="accent"
                          size="sm"
                          className="flex-1 text-xs font-bold shadow-md shadow-accent/20"
                          onClick={() => {
                            toast({
                              title: `⚡ Deal Invite Dispatched!`,
                              description: `Fast-track pitch invite for ${targetBrand.name} sent to ${creator.name} (${creator.email}).`,
                              type: "success",
                            });
                          }}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Send Deal
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add New Brand */}
      <Modal
        isOpen={isAddBrandOpen}
        onClose={() => setIsAddBrandOpen(false)}
        title="Add New Brand Brief"
        description="Publish an active brand campaign for creators to apply."
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

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsAddBrandOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Publish Brand Brief
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

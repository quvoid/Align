"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PLANS, formatPrice, isMembershipActive, type Membership } from "@/lib/plans";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getUserData, removeApplication, isProfileComplete } from "@/lib/user-store";
import { ApplicationItem } from "@/lib/mock-data";
import { Sparkles, FileText, Clock, CheckCircle2, XCircle, Eye, ArrowRight, Award, Layers, Building2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [membership, setMembership] = useState<Membership | undefined>();
  const [profileDone, setProfileDone] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.email) {
      const userData = getUserData(session.user.email);
      setApplications(userData.applications);
      setMembership(userData.membership);
      setProfileDone(isProfileComplete(userData.profile));
    }
  }, [session]);

  const handleWithdraw = (appId: string) => {
    if (session?.user?.email) {
      removeApplication(session.user.email, appId);
      setApplications(getUserData(session.user.email).applications);
      toast({
        title: "Withdrawn",
        description: "Application withdrawn successfully.",
        type: "info",
      });
      setSelectedApp(null);
    }
  };

  const getStatusBadgeVariant = (
    status: ApplicationItem["status"]
  ): "pending" | "approved" | "rejected" | "under_review" | "shortlisted" => {
    switch (status) {
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "SHORTLISTED":
        return "shortlisted";
      case "UNDER_REVIEW":
        return "under_review";
      case "PENDING":
      default:
        return "pending";
    }
  };

  const getStatusIcon = (status: ApplicationItem["status"]) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case "REJECTED":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      case "SHORTLISTED":
        return <Sparkles className="h-3.5 w-3.5 mr-1" />;
      case "UNDER_REVIEW":
      case "PENDING":
      default:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
    }
  };

  // User-scoped KPIs
  const totalSubmissions = applications.length;
  const shortlistedApproved = applications.filter(
    (a) => a.status === "APPROVED" || a.status === "SHORTLISTED"
  ).length;
  const underReview = applications.filter(
    (a) => a.status === "UNDER_REVIEW" || a.status === "PENDING"
  ).length;
  const rating = "4.9 / 5.0";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div className="bg-primary text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Welcome back, {session?.user?.name || "Creator"}
            </h1>
            <p className="text-white/70 max-w-2xl text-sm leading-relaxed">
              Your pitches, agreements and their review status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/profile">
              <Button variant="outline" className="text-xs font-bold bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                <FileText className="mr-1.5 h-4 w-4" />
                Edit media kit
              </Button>
            </Link>
            <Link href="/brands">
              <Button variant="accent" className="text-xs font-bold">
                <Building2 className="mr-1.5 h-4 w-4" />
                Find a brief to pitch
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* First-run checklist: the three things a new creator has to do */}
        {(() => {
          const active = isMembershipActive(membership);
          const steps = [
            {
              done: active,
              label: active ? `${PLANS[membership!.plan].name} plan active` : "Choose a plan",
              hint: active
                ? membership!.renewsAt
                  ? `Renews ${new Date(membership!.renewsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${formatPrice(PLANS[membership!.plan])}`
                  : "Every brief, no renewals"
                : `${formatPrice(PLANS.all_access)} or ${formatPrice(PLANS.monthly)}`,
              href: active ? undefined : "/pricing",
              cta: "See plans",
            },
            {
              done: profileDone,
              label: profileDone ? "Media kit complete" : "Complete your media kit",
              hint: profileDone ? "Brands see your handles and reach" : "Handles, reach and niche — 2 minutes",
              href: profileDone ? undefined : "/dashboard/profile",
              cta: "Fill it in",
            },
            {
              done: applications.length > 0,
              label: applications.length > 0 ? `${applications.length} pitch${applications.length === 1 ? "" : "es"} sent` : "Send your first pitch",
              hint: applications.length > 0 ? "Track status below" : "Pick a brief that fits your niche",
              href: applications.length > 0 ? undefined : "/brands",
              cta: "Browse briefs",
            },
          ];
          const remaining = steps.filter((s) => !s.done).length;
          if (remaining === 0) return null;
          return (
            <section aria-labelledby="getting-started" className="rounded-3xl border border-border bg-white p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 id="getting-started" className="text-base font-bold text-primary">
                  {remaining === 3 ? "Three steps to your first brand deal" : `${remaining} step${remaining === 1 ? "" : "s"} left`}
                </h2>
                <span className="text-xs text-text-secondary tabular-nums">{3 - remaining}/3 done</span>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {steps.map((s, i) => (
                  <li
                    key={s.label}
                    className={`rounded-2xl border p-4 flex flex-col gap-1 ${s.done ? "border-border bg-gray-50" : "border-primary/20 bg-white"}`}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <span
                        className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center tabular-nums ${
                          s.done ? "bg-primary text-white" : "border border-primary/40 text-primary"
                        }`}
                        aria-hidden="true"
                      >
                        {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </span>
                      {s.label}
                    </div>
                    <p className="text-xs text-text-secondary pl-7">{s.hint}</p>
                    {s.href && (
                      <Link href={s.href} className="pl-7 mt-1 text-xs font-semibold text-accent hover:underline">
                        {s.cta} →
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          );
        })()}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-3xl border-border shadow-xs bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Total Pitches</span>
                <FileText className="w-4 h-4 text-accent" />
              </div>
              <div className="text-3xl font-black text-primary">{totalSubmissions}</div>
              <p className="text-[11px] text-text-secondary mt-1">Submitted campaign briefs</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-xs bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Shortlisted / Approved</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-black text-green-600">{shortlistedApproved}</div>
              <p className="text-[11px] text-text-secondary mt-1">Ready for contract phase</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-xs bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Under Review</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600">{underReview}</div>
              <p className="text-[11px] text-text-secondary mt-1">Agency evaluating metrics</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-xs bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Creator Rating</span>
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-black text-primary">{rating}</div>
              <p className="text-[11px] text-text-secondary mt-1">100% on-time delivery</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-primary">Your pitches</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Where each pitch stands with the brand team.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/5 text-primary border border-border">
              {applications.length} {applications.length === 1 ? "Pitch" : "Pitches"}
            </span>
          </div>

          {applications.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-2 border-border bg-white shadow-xs">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-border">
                  <Layers className="h-8 w-8 text-text-secondary opacity-40" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">No pitches yet</h3>
                <p className="text-xs text-text-secondary max-w-sm mb-6">
                  Pick a brief that fits your niche. Britannia, Enamor, Swiggy and more are open now.
                </p>
                <Link href="/brands">
                  <Button variant="accent" >
                    Find a brief to pitch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary uppercase tracking-wider bg-gray-50/80 border-b border-border">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-bold">Brand Campaign</th>
                      <th scope="col" className="px-6 py-4 font-bold">Deliverables</th>
                      <th scope="col" className="px-6 py-4 font-bold">Expected Fee</th>
                      <th scope="col" className="px-6 py-4 font-bold">Status</th>
                      <th scope="col" className="px-6 py-4 font-bold">Applied On</th>
                      <th scope="col" className="px-6 py-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-primary text-sm">{app.brandName}</div>
                          <span className="text-[11px] text-text-secondary">Schbang Campaign Brief</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(app.deliverables) ? (
                              app.deliverables.map((d, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-text-secondary"
                                >
                                  {d}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-text-secondary">{String(app.deliverables)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">
                          ₹{typeof app.expectedRate === "number" ? app.expectedRate.toLocaleString() : app.expectedRate || "TBD"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={getStatusBadgeVariant(app.status)} className="inline-flex items-center">
                            {getStatusIcon(app.status)}
                            {app.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs text-text-secondary font-medium">
                          {app.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApp(app)}
                            className="text-xs font-bold"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Inspect Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details: ${selectedApp.brandName}`}
          description={`Submitted on ${selectedApp.date}`}
          size="lg"
        >
          <div className="space-y-6 mt-4">
            {/* Status Strip */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                  Current Status
                </span>
                <Badge variant={getStatusBadgeVariant(selectedApp.status)} className="mt-1 text-xs inline-flex items-center">
                  {getStatusIcon(selectedApp.status)}
                  {selectedApp.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                  Proposed Fee
                </span>
                <span className="text-base font-black text-primary">
                  ₹{typeof selectedApp.expectedRate === "number" ? selectedApp.expectedRate.toLocaleString() : selectedApp.expectedRate || "TBD"}
                </span>
              </div>
            </div>

            {/* Proposal Pitch */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                Your Creative Proposal
              </h4>
              <p className="p-4 rounded-2xl bg-gray-50 border border-border text-xs text-primary leading-relaxed whitespace-pre-wrap">
                {selectedApp.proposal}
              </p>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                Deliverables Included
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(selectedApp.deliverables) ? (
                  selectedApp.deliverables.map((d, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 border border-border text-xs font-semibold text-primary"
                    >
                      ✓ {d}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-primary">{String(selectedApp.deliverables)}</span>
                )}
              </div>
            </div>

            {/* Agency Notes if any */}
            {selectedApp.adminNotes && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs">
                <span className="font-bold text-blue-950 block mb-1">
                  Note from the Schbang campaign lead
                </span>
                <p className="text-blue-900">{selectedApp.adminNotes}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 text-xs font-semibold"
                onClick={() => handleWithdraw(selectedApp.id)}
              >
                Withdraw Proposal
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedApp(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PLANS, formatPrice, isMembershipActive, type Membership } from "@/lib/plans";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { fetchMe, withdrawPitch, isProfileComplete } from "@/lib/user-store";
import { errorMessage } from "@/lib/fetch-json";
import { WITHDRAWABLE_STATUSES } from "@/lib/db-records";
import { ApplicationItem } from "@/lib/mock-data";
import { STATUS_BADGE, STATUS_LABEL, STATUS_STEP, STATUS_STEPS } from "@/lib/status";
import { FileText, CheckCircle2, Eye, ArrowRight, Layers, Building2, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [freePitchesLeft, setFreePitchesLeft] = useState(0);
  const [profileDone, setProfileDone] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  const load = React.useCallback(async () => {
    try {
      const me = await fetchMe();
      setApplications(me.applications);
      setMembership(me.membership);
      setFreePitchesLeft(me.freePitchesLeft);
      setProfileDone(isProfileComplete(me.profile));
      setLoaded(true);
    } catch (err) {
      toast({ title: "Couldn't load your dashboard", description: errorMessage(err), type: "error" });
    }
  }, [toast]);

  useEffect(() => {
    if (session?.user?.email) load();
  }, [session?.user?.email, load]);

  const handleWithdraw = async (app: ApplicationItem) => {
    setWithdrawing(true);
    try {
      await withdrawPitch(app.id);
      toast({
        title: "Pitch withdrawn",
        description: `Your pitch to ${app.brandName} was withdrawn.`,
        type: "info",
      });
      setSelectedApp(null);
      await load();
    } catch (err) {
      toast({ title: "Couldn't withdraw the pitch", description: errorMessage(err), type: "error" });
    } finally {
      setWithdrawing(false);
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
  const isMember = isMembershipActive(membership);
  const firstName = (session?.user?.name || "").split(" ")[0] || "there";
  const fee = (n: number) => (n ? `₹${n.toLocaleString("en-IN")}` : "Fee not set");

  const steps = (() => {
    const active = isMember;
    return [
      {
        done: active,
        label: active ? `${PLANS[membership!.plan].name} plan active` : "Choose a plan",
        hint: active
          ? membership!.renewsAt
            ? `Renews ${new Date(membership!.renewsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${formatPrice(PLANS[membership!.plan])}`
            : "Every brief, no renewals"
          : `${freePitchesLeft} free pitches left, then ${formatPrice(PLANS.all_access)} or ${formatPrice(PLANS.monthly)}`,
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
        hint: applications.length > 0 ? "Track them below" : "Pick a brief that fits your niche",
        href: applications.length > 0 ? undefined : "/brands",
        cta: "Browse briefs",
      },
    ];
  })();
  const remaining = steps.filter((s) => !s.done).length;

  const stats = [
    { label: "Pitches sent", value: String(totalSubmissions), fill: "bg-fill-lilac" },
    { label: "Shortlisted or approved", value: String(shortlistedApproved), fill: "bg-fill-mint" },
    { label: "Waiting on Schbang", value: String(underReview), fill: "bg-fill-sky" },
    { label: isMember ? `${PLANS[membership!.plan].name} plan` : "Free pitches left", value: isMember ? "∞" : String(freePitchesLeft), fill: "bg-fill-butter" },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="container mx-auto px-4 pt-8 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h1 className="text-[44px] sm:text-6xl type-display leading-[0.95] text-primary">
              Hi, {firstName}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-text-secondary">Your pitches and where each one stands.</p>
          </div>
          <div className="grid grid-cols-1 sm:flex sm:flex-row-reverse sm:items-center gap-3">
            <Link href="/brands">
              <Button variant="accent" className="w-full sm:w-auto">
                <Building2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Find a brief to pitch
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                Edit media kit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {!loaded ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Loading your pitches" />
        </div>
      ) : (
      <div className="container mx-auto px-4 pt-8 space-y-10">
        {remaining > 0 && (
          <section aria-labelledby="getting-started" className="rounded-4xl bg-surface p-5 sm:p-6 brut">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2 id="getting-started" className="text-xl font-extrabold text-primary">
                {remaining === 3 ? "Three steps to your first brand deal" : `${remaining} step${remaining === 1 ? "" : "s"} left`}
              </h2>
              <span className="text-sm font-semibold text-text-secondary tabular-nums">{3 - remaining}/3 done</span>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {steps.map((s, i) => (
                <li key={s.label} className={`rounded-3xl p-4 flex gap-3 ${s.done ? "bg-fill-mint brut-sm" : "bg-background brut-well"}`}>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full grid place-items-center text-sm font-extrabold ${
                      s.done ? "bg-accent text-white brut-btn" : "bg-fill-butter text-primary brut-sm"
                    }`}
                    aria-hidden="true"
                  >
                    {s.done ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-primary leading-snug">{s.label}</p>
                    <p className="text-sm text-text-secondary leading-snug mt-0.5">{s.hint}</p>
                    {s.href && (
                      <Link href={s.href} className="inline-flex items-center gap-1 mt-2 text-sm font-bold text-accent hover:underline underline-offset-4">
                        {s.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((st) => (
            <div key={st.label} className={`rounded-4xl px-5 pt-5 pb-4 brut ${st.fill}`}>
              <dt className="text-sm font-semibold text-text-secondary leading-snug">{st.label}</dt>
              <dd className="type-display mt-2 text-[52px] text-primary leading-[0.85]">{st.value}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="your-pitches">
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h2 id="your-pitches" className="text-[36px] type-display text-primary">Your pitches</h2>
            <span className="text-sm font-semibold text-text-secondary">
              {applications.length} {applications.length === 1 ? "pitch" : "pitches"}
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-4xl bg-surface p-10 text-center brut">
              <span className="w-16 h-16 mx-auto mb-4 rounded-md bg-fill-lilac grid place-items-center border-2 border-ink">
                <Layers className="h-7 w-7 text-primary" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-extrabold text-primary mb-1">No pitches yet</h3>
              <p className="text-[15px] text-text-secondary max-w-sm mx-auto mb-6">
                Pick a brief that fits your niche — every pitch is read by the Schbang team.
              </p>
              <Link href="/brands" className="inline-block">
                <Button variant="primary">
                  Find a brief to pitch
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {applications.map((app) => (
                <li key={app.id} className="rounded-4xl bg-surface p-5 sm:p-6 brut flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-2xl font-extrabold tracking-tight text-primary leading-tight">{app.brandName}</h3>
                      <p className="text-sm font-semibold text-text-secondary mt-0.5">
                        {fee(app.expectedRate)} · sent {new Date(app.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <Badge variant={STATUS_BADGE[app.status]} className="text-sm">{STATUS_LABEL[app.status]}</Badge>
                  </div>

                  <ol className="mt-5 grid grid-cols-4 gap-1 text-center" aria-label={`Progress: ${STATUS_LABEL[app.status]}`}>
                    {STATUS_STEPS.map((step, i) => {
                      const filled = i < STATUS_STEP[app.status];
                      const current = i === STATUS_STEP[app.status] - 1;
                      return (
                        <li key={step} className={`text-xs font-bold ${current ? "text-primary" : "text-text-secondary"}`}>
                          <span
                            className={`block mx-auto mb-1.5 rounded-full ${
                              current
                                ? `w-7 h-7 brut-sm ${app.status === "REJECTED" ? "bg-fill-rose" : "bg-fill-butter"}`
                                : filled
                                  ? "w-6 h-6 mt-0.5 bg-accent brut-btn"
                                  : "w-6 h-6 mt-0.5 bg-background brut-well"
                            }`}
                            aria-hidden="true"
                          />
                          {step}
                        </li>
                      );
                    })}
                  </ol>

                  {app.adminNotes && (
                    <div className="mt-5 rounded-3xl rounded-bl-md bg-fill-lilac px-4 py-3 brut-sm">
                      <p className="text-xs font-bold text-text-secondary">Note from the Schbang team</p>
                      <p className="text-[15px] text-primary leading-snug mt-0.5">{app.adminNotes}</p>
                    </div>
                  )}

                  <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                    <ul className="flex flex-wrap gap-1.5 min-w-0">
                      {app.deliverables.slice(0, 2).map((d) => (
                        <li key={d} className="px-2.5 py-0.75 rounded-full bg-background text-xs font-semibold text-primary brut-well">{d}</li>
                      ))}
                      {app.deliverables.length > 2 && (
                        <li className="px-2 py-0.75 text-xs font-semibold text-text-secondary">+{app.deliverables.length - 2}</li>
                      )}
                    </ul>
                    <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)} className="shrink-0">
                      <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      Details
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      )}

      {/* Pitch details */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Your pitch to ${selectedApp.brandName}`}
          description={`Sent ${new Date(selectedApp.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="rounded-3xl bg-background p-4 brut-well flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-text-secondary block">Status</span>
                <Badge variant={STATUS_BADGE[selectedApp.status]} className="mt-1 text-sm">{STATUS_LABEL[selectedApp.status]}</Badge>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-text-secondary block">Your fee</span>
                <span className="font-mono text-lg font-bold text-primary">{fee(selectedApp.expectedRate)}</span>
              </div>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-primary mb-2">Your idea</h4>
              <p className="rounded-3xl bg-background p-4 brut-well text-[15px] text-primary leading-relaxed whitespace-pre-wrap">
                {selectedApp.proposal}
              </p>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-primary mb-2">Deliverables</h4>
              <ul className="flex flex-wrap gap-2">
                {selectedApp.deliverables.map((d) => (
                  <li key={d} className="px-2.5 py-1 rounded bg-muted border-2 border-ink text-sm font-bold text-primary">{d}</li>
                ))}
              </ul>
            </div>

            {selectedApp.adminNotes && (
              <div className="rounded-3xl rounded-bl-md bg-fill-lilac px-4 py-3 brut-sm">
                <p className="text-xs font-bold text-text-secondary">Note from the Schbang team</p>
                <p className="text-[15px] text-primary leading-snug mt-0.5">{selectedApp.adminNotes}</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              {WITHDRAWABLE_STATUSES.includes(selectedApp.status) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error"
                  onClick={() => handleWithdraw(selectedApp)}
                  disabled={withdrawing}
                >
                  {withdrawing ? "Withdrawing…" : "Withdraw pitch"}
                </Button>
              ) : (
                <span />
              )}
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

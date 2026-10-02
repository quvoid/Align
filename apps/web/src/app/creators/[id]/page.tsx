"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { BrandItem, CreatorItem } from "@/lib/mock-data";
import { fetchCreator } from "@/lib/admin-client";
import { fetchBriefs } from "@/lib/user-store";
import { ApiError, errorMessage } from "@/lib/fetch-json";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle2, ChevronRight, ExternalLink, Instagram, Loader2, Lock, MapPin, Send, ShieldCheck, Youtube } from "lucide-react";

export default function CreatorProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const { data: session } = useSession();
  // undefined while loading, null when there's no such creator.
  const [creator, setCreator] = useState<CreatorItem | null | undefined>(undefined);
  const [briefs, setBriefs] = useState<BrandItem[]>([]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("");
  const [offeredFee, setOfferedFee] = useState("45000");
  const [customMessage, setCustomMessage] = useState("");

  const role = session?.user?.role;
  const creatorId = resolvedParams.id;
  useEffect(() => {
    if (!role || role === "CREATOR") return;
    let cancelled = false;
    fetchCreator(creatorId)
      .then((c) => !cancelled && setCreator(c))
      .catch((err) => {
        if (cancelled) return;
        setCreator(null);
        if (!(err instanceof ApiError && err.status === 404)) {
          toast({ title: "Couldn't load this creator", description: errorMessage(err), type: "error" });
        }
      });
    fetchBriefs()
      .then((list) => {
        if (cancelled) return;
        setBriefs(list);
        setSelectedBrandSlug((prev) => prev || list[0]?.slug || "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [role, creatorId, toast]);

  // If a creator tries to access another creator's scorecard, show permission barrier
  if (session?.user?.role === "CREATOR") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center rounded-5xl bg-surface p-8 shadow-card">
          <span className="w-16 h-16 mx-auto rounded-full bg-tint-lilac grid place-items-center shadow-pill">
            <Lock className="w-7 h-7 text-primary" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-primary">For the Schbang team</h1>
          <p className="mt-2 text-[15px] text-text-secondary">Creator profiles are visible to the Schbang team reviewing pitches.</p>
          <div className="mt-6 grid gap-3">
            <Link href="/brands"><Button variant="accent" className="w-full">Browse open briefs</Button></Link>
            <Link href="/dashboard"><Button variant="outline" className="w-full">Go to my pitches</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  if (creator === undefined) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Loading creator" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-semibold text-primary mb-2">Creator not found</h1>
        <p className="text-text-secondary mb-6">This account doesn&apos;t exist or isn&apos;t a creator.</p>
        <Link href="/creators">
          <Button variant="accent">All creators</Button>
        </Link>
      </div>
    );
  }

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const brief = briefs.find((b) => b.slug === selectedBrandSlug);
    const briefName = brief?.name ?? "a Schbang brand";
    const fee = Number(offeredFee) ? `₹${Number(offeredFee).toLocaleString("en-IN")}` : "to be agreed";
    const body = [
      `Hi ${creator.name},`,
      "",
      customMessage || `We'd like to feature you in the ${briefName} campaign on Align by Schbang.`,
      "",
      `Brief: ${briefName}${brief ? ` (${window.location.origin}/brands/${brief.slug})` : ""}`,
      `Proposed fee: ${fee}`,
    ].join("\n");
    window.location.href = `mailto:${creator.email}?subject=${encodeURIComponent(
      `${briefName} campaign offer — Align by Schbang`
    )}&body=${encodeURIComponent(body)}`;
    setIsInviteModalOpen(false);
    toast({
      title: `Offer email drafted to ${creator.name}`,
      description: `Finish and send it from your email app (${creator.email}).`,
      type: "success",
    });
  };

  const kpis = [
    { label: "Pitches on Align", value: String(creator.pitchCount ?? 0), fill: "bg-tint-lilac" },
    { label: "Approved", value: String(creator.brandCollaborations.length), fill: "bg-tint-mint" },
    { label: "Instagram engagement", value: creator.igEngagementRate ? `${creator.igEngagementRate}%` : "—", fill: "bg-tint-rose" },
    { label: "Briefs liked", value: String(creator.likedBrandIds.length), fill: "bg-tint-butter" },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="container mx-auto px-4 pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
          <Link href="/creators" className="press inline-flex items-center gap-1.5 pl-2.5 pr-3.5 pt-1.5 pb-1 rounded-full bg-surface shadow-pill hover:text-primary">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Creators
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-primary truncate">{creator.name}</span>
        </nav>

        <section className="mt-5 rounded-5xl bg-surface p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 min-w-0">
            <div className="relative shrink-0">
              <img src={creator.avatar} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-tint-butter shadow-card" />
              {creator.verified && (
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent text-white grid place-items-center shadow-btn">
                  <CheckCircle2 className="w-4 h-4" aria-label="Verified by Schbang" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-none text-primary">{creator.name}</h1>
                <span className="px-3 py-0.75 rounded-full bg-tint-lilac text-sm font-semibold text-primary shadow-pill">{creator.tier}</span>
              </div>
              <p className="mt-1.5 text-base font-semibold text-text-secondary">{creator.handle}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                {creator.location && (
                  <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" aria-hidden="true" />{creator.location}</span>
                )}
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  {creator.verified ? "Verified by Schbang" : "Not verified yet · numbers are self-reported"}
                </span>
              </p>
            </div>
          </div>
          <Button variant="accent" size="lg" onClick={() => setIsInviteModalOpen(true)} className="shrink-0">
            <Send className="w-5 h-5 mr-2" aria-hidden="true" />
            Draft an offer
          </Button>
        </section>

        <dl className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {kpis.map((k) => (
            <div key={k.label} className={`rounded-4xl px-5 pt-5 pb-4 shadow-card ${k.fill}`}>
              <dt className="text-sm font-semibold text-text-secondary">{k.label}</dt>
              <dd className="mt-1 text-4xl font-semibold text-primary tabular-nums leading-none">{k.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-4xl bg-surface p-6 sm:p-8 shadow-card">
              <h2 className="text-2xl font-semibold text-primary">About</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-primary/85">{creator.bio || "No bio yet."}</p>
              {creator.niche.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {creator.niche.map((n) => (
                    <li key={n} className="px-3 pt-1.5 pb-1 rounded-full bg-tint-butter text-sm font-semibold text-primary shadow-pill">{n}</li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-4xl bg-surface p-6 sm:p-8 shadow-card">
              <h2 className="text-2xl font-semibold text-primary">Approved on Align</h2>
              {creator.brandCollaborations.length === 0 ? (
                <p className="mt-3 rounded-3xl bg-background px-5 py-4 text-[15px] text-text-secondary shadow-field">
                  No approved pitches yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {creator.brandCollaborations.map((collab) => (
                    <li key={`${collab.brandName}-${collab.completedAt}`} className="rounded-3xl bg-background px-5 py-4 shadow-pill flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold text-primary leading-tight">{collab.brandName}</p>
                        <p className="text-sm text-text-secondary">{collab.deliverableType}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-text-secondary">
                        {new Date(collab.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="rounded-4xl bg-surface p-6 shadow-card space-y-3">
            <h2 className="text-2xl font-semibold text-primary mb-1">Reach</h2>
            <div className="flex items-center justify-between gap-3 rounded-3xl bg-tint-rose px-4 py-3 shadow-pill">
              <span className="flex items-center gap-2 font-semibold text-primary"><Instagram className="w-5 h-5" aria-hidden="true" />Instagram</span>
              <span className="text-right">
                <span className="block font-semibold text-primary tabular-nums">{creator.igFollowers ? creator.igFollowers.toLocaleString("en-IN") : "—"}</span>
                <span className="block text-xs font-semibold text-text-secondary">{creator.igEngagementRate ? `${creator.igEngagementRate}% engagement` : "followers"}</span>
              </span>
            </div>
            {creator.ytSubscribers ? (
              <div className="flex items-center justify-between gap-3 rounded-3xl bg-tint-sky px-4 py-3 shadow-pill">
                <span className="flex items-center gap-2 font-semibold text-primary"><Youtube className="w-5 h-5" aria-hidden="true" />YouTube</span>
                <span className="text-right">
                  <span className="block font-semibold text-primary tabular-nums">{creator.ytSubscribers.toLocaleString("en-IN")}</span>
                  <span className="block text-xs font-semibold text-text-secondary">{creator.ytAvgViews ? `${creator.ytAvgViews} avg views` : "subscribers"}</span>
                </span>
              </div>
            ) : null}
            {creator.mediaKitUrl && (
              <a
                href={creator.mediaKitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex items-center justify-between rounded-3xl bg-background px-4 py-3 font-semibold text-primary shadow-pill"
              >
                Media kit <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
            <a href={`mailto:${creator.email}`} className="block text-sm font-semibold text-accent hover:underline underline-offset-4 pt-1">
              {creator.email}
            </a>
          </aside>
        </div>
      </div>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={`Offer for ${creator.name}`}
        description="Opens your email app with the offer written out. Nothing is sent from Align."
        size="lg"
      >
        <form onSubmit={handleSendOffer} className="space-y-4">
          <Select
            label="Brief"
            value={selectedBrandSlug}
            onChange={(e) => setSelectedBrandSlug(e.target.value)}
            options={briefs.map((b) => ({ value: b.slug, label: `${b.name} · ${b.industry}` }))}
          />
          <Input
            label="Proposed fee (₹)"
            type="number"
            inputMode="numeric"
            value={offeredFee}
            onChange={(e) => setOfferedFee(e.target.value)}
            required
          />
          <Textarea
            label="Message"
            rows={4}
            placeholder={`Hi ${creator.name.split(" ")[0]}, we'd like to feature you in our next campaign…`}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button variant="accent" type="submit">
              <Send className="w-4 h-4 mr-2" aria-hidden="true" />
              Draft offer email
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { CreatorItem } from "@/lib/mock-data";
import { fetchCreators } from "@/lib/admin-client";
import { errorMessage } from "@/lib/fetch-json";
import { useSession } from "next-auth/react";
import { Search, Users, Instagram, Youtube, CheckCircle2, Send, MapPin, Lock, Loader2 } from "lucide-react";

export default function CreatorDiscoveryPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [brandFilter, setBrandFilter] = useState("ALL");

  // Every creator account from the database. Middleware already keeps
  // creators out; the API re-checks the admin role.
  const role = session?.user?.role;
  useEffect(() => {
    if (!role || role === "CREATOR") return;
    let cancelled = false;
    fetchCreators()
      .then((list) => !cancelled && setCreators(list))
      .catch((err) => {
        if (!cancelled) toast({ title: "Couldn't load creators", description: errorMessage(err), type: "error" });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [role, toast]);

  // If user is logged in as a normal CREATOR, block talent directory access
  if (session?.user?.role === "CREATOR") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center rounded-5xl bg-surface p-8 shadow-card">
          <span className="w-16 h-16 mx-auto rounded-full bg-tint-lilac grid place-items-center shadow-pill">
            <Lock className="w-7 h-7 text-primary" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-primary">For the Schbang team</h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            The creator directory is where Schbang finds creators for briefs. As a creator, you&apos;ll find everything you need on the briefs page.
          </p>
          <div className="mt-6 grid gap-3">
            <Link href="/brands"><Button variant="accent" className="w-full">Browse open briefs</Button></Link>
            <Link href="/dashboard"><Button variant="outline" className="w-full">Go to my pitches</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter creators
  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      creator.handle.toLowerCase().includes(search.toLowerCase()) ||
      creator.bio.toLowerCase().includes(search.toLowerCase()) ||
      creator.niche.some((n) => n.toLowerCase().includes(search.toLowerCase()));

    const matchesNiche =
      nicheFilter === "ALL" ||
      creator.niche.some((n) => n.toLowerCase().includes(nicheFilter.toLowerCase()));

    const matchesTier = tierFilter === "ALL" || creator.tier === tierFilter;

    const matchesBrand =
      brandFilter === "ALL" ||
      creator.brandCollaborations.some((c) =>
        c.brandName.toLowerCase().includes(brandFilter.toLowerCase())
      );

    return matchesSearch && matchesNiche && matchesTier && matchesBrand;
  });

  const filtersActive = search || nicheFilter !== "ALL" || tierFilter !== "ALL" || brandFilter !== "ALL";
  const resetFilters = () => {
    setSearch("");
    setNicheFilter("ALL");
    setTierFilter("ALL");
    setBrandFilter("ALL");
  };
  const selectClass =
    "h-12 w-full px-4 rounded-2xl bg-background text-[15px] font-semibold text-primary shadow-pill cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-accent)]";

  return (
    <div className="min-h-screen pb-24">
      <section className="container mx-auto px-4 pt-8 sm:pt-12">
        <h1 className="text-[44px] sm:text-6xl font-semibold tracking-tight leading-[0.95] text-primary">Creators</h1>
        <p className="mt-2 text-base sm:text-lg text-text-secondary max-w-2xl">
          Everyone who has joined Align. Numbers are self-reported unless the profile shows the verified badge.
        </p>

        <div className="mt-7 rounded-4xl bg-surface p-3 sm:p-4 shadow-card grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_repeat(3,190px)] gap-3">
          <label className="relative block">
            <span className="sr-only">Search creators</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search name, handle or niche"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-background text-[15px] text-primary shadow-field placeholder:text-text-secondary focus:outline-none focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-accent)]"
            />
          </label>
          <label className="block">
            <span className="sr-only">Niche</span>
            <select value={nicheFilter} onChange={(e) => setNicheFilter(e.target.value)} className={selectClass}>
              <option value="ALL">All niches</option>
              <option value="Food">Food &amp; FMCG</option>
              <option value="Comedy">Comedy</option>
              <option value="Beauty">Beauty &amp; Skincare</option>
              <option value="Tech">Tech</option>
              <option value="Fashion">Fashion</option>
              <option value="Finance">Finance</option>
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Follower tier</span>
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className={selectClass}>
              <option value="ALL">All tiers</option>
              <option value="Nano">Nano</option>
              <option value="Micro">Micro</option>
              <option value="Mid-Tier">Mid-tier</option>
              <option value="Macro">Macro</option>
              <option value="Mega">Mega</option>
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Approved for brand</span>
            <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className={selectClass}>
              <option value="ALL">Any brand</option>
              <option value="Britannia">Approved for Britannia</option>
              <option value="Enamor">Approved for Enamor</option>
              <option value="Swiggy">Approved for Swiggy</option>
              <option value="Fevicol">Approved for Fevicol</option>
              <option value="Kotak811">Approved for Kotak811</option>
              <option value="Myntra">Approved for Myntra</option>
            </select>
          </label>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-10">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <p className="text-base font-semibold text-text-secondary">
            <strong className="text-primary text-xl font-semibold">{filteredCreators.length}</strong>{" "}
            {filteredCreators.length === 1 ? "creator" : "creators"}
          </p>
          {filtersActive && (
            <button onClick={resetFilters} className="text-sm font-semibold text-accent hover:underline underline-offset-4">
              Clear filters
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Loading creators" />
          </div>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <li key={creator.id} className="rounded-4xl bg-surface p-5 shadow-card flex flex-col">
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img src={creator.avatar} alt="" className="w-14 h-14 rounded-full object-cover bg-tint-butter shadow-pill" />
                  {creator.verified && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent text-white grid place-items-center shadow-btn" title="Verified by Schbang">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-label="Verified by Schbang" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-primary leading-tight truncate">{creator.name}</h3>
                  <p className="text-sm font-semibold text-text-secondary truncate">{creator.handle}</p>
                  {creator.location && (
                    <p className="flex items-center gap-1 text-sm text-text-secondary mt-0.5">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="truncate">{creator.location}</span>
                    </p>
                  )}
                </div>
                <span className="shrink-0 px-3 py-0.75 rounded-full bg-tint-lilac text-xs font-semibold text-primary shadow-pill">{creator.tier}</span>
              </div>

              {creator.bio && <p className="mt-3 text-[15px] text-primary/85 leading-relaxed line-clamp-2">{creator.bio}</p>}

              {creator.niche.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {creator.niche.map((n) => (
                    <li key={n} className="px-2.5 py-0.75 rounded-full bg-background text-xs font-semibold text-primary shadow-field">{n}</li>
                  ))}
                </ul>
              )}

              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-tint-rose px-2 py-1.75 shadow-pill">
                  <dt className="flex items-center justify-center gap-1 text-xs font-semibold text-text-secondary"><Instagram className="w-3 h-3" aria-hidden="true" />Followers</dt>
                  <dd className="font-semibold text-primary tabular-nums">{creator.igFollowers ? creator.igFollowers.toLocaleString("en-IN") : "—"}</dd>
                </div>
                <div className="rounded-2xl bg-tint-mint px-2 py-1.75 shadow-pill">
                  <dt className="text-xs font-semibold text-text-secondary">Engagement</dt>
                  <dd className="font-semibold text-primary tabular-nums">{creator.igEngagementRate ? `${creator.igEngagementRate}%` : "—"}</dd>
                </div>
                <div className="rounded-2xl bg-tint-sky px-2 py-1.75 shadow-pill">
                  <dt className="flex items-center justify-center gap-1 text-xs font-semibold text-text-secondary"><Youtube className="w-3 h-3" aria-hidden="true" />Subs</dt>
                  <dd className="font-semibold text-primary tabular-nums">{creator.ytSubscribers ? creator.ytSubscribers.toLocaleString("en-IN") : "—"}</dd>
                </div>
              </dl>

              <p className="mt-4 text-sm font-semibold text-text-secondary">
                {creator.pitchCount ?? 0} pitch{(creator.pitchCount ?? 0) === 1 ? "" : "es"} · {creator.brandCollaborations.length} approved
                {creator.brandCollaborations.length > 0 && ` (${creator.brandCollaborations.map((c) => c.brandName).join(", ")})`}
              </p>

              <div className="mt-auto pt-4 flex items-center gap-2">
                <Link href={`/creators/${creator.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">View profile</Button>
                </Link>
                <a href={`mailto:${creator.email}`} className="flex-1">
                  <Button variant="accent" size="sm" className="w-full" tabIndex={-1}>
                    <Send className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    Email creator
                  </Button>
                </a>
              </div>
            </li>
          ))}
        </ul>

        {!loading && filteredCreators.length === 0 && (
          <div className="text-center py-12 px-8 max-w-md mx-auto rounded-4xl bg-surface shadow-card">
            <span className="w-14 h-14 mx-auto mb-4 rounded-full bg-tint-lilac grid place-items-center shadow-pill">
              <Users className="w-6 h-6 text-primary" aria-hidden="true" />
            </span>
            <h3 className="text-xl font-semibold text-primary mb-1">No creators match</h3>
            <p className="text-[15px] text-text-secondary mb-6">Try another search, or clear the filters.</p>
            <Button variant="outline" onClick={resetFilters}>Clear filters</Button>
          </div>
        )}
      </section>
    </div>
  );
}

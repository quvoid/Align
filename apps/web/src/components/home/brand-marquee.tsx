/**
 * Brands that have run briefs through Schbang.
 *
 * Every logo is rendered monochrome via `brightness(0) invert(1)`, which turns
 * any single-colour mark on a transparent ground into white. That is the one
 * thing it can do: a wordmark sitting *on* a filled shape flattens into a blob,
 * so those files (Britannia, McCain, Mochi) are pre-extracted to white-on-
 * transparent in `public/logos` and the filter is a no-op on them.
 *
 * Where a sub-brand has no accessible mark of its own, the parent's is used
 * and noted here so nobody thinks it was an oversight.
 */
const BRANDS = [
  { name: "Louis Philippe", src: "/logos/louis-philippe.svg" },
  { name: "Godrej Enterprises Group", src: "/logos/godrej-enterprises-group.svg" },
  { name: "McCain", src: "/logos/mccain-retail.png" },
  { name: "Vivo", src: "/logos/vivo.svg" },
  { name: "Enamor", src: "/logos/enamor.png" },
  { name: "Visa", src: "/logos/visa.svg" },
  /* Monaco: Parle Products' mark stands in. */
  { name: "Parle", src: "/logos/parle-monaco.svg" },
  /* Godrej Security Solutions: Godrej & Boyce's mark stands in. */
  { name: "Godrej & Boyce", src: "/logos/godrej-security.svg" },
  /* Hajmola: Dabur's mark stands in. */
  { name: "Dabur", src: "/logos/dabur-hajmola.svg" },
  { name: "Castrol", src: "/logos/castrol.svg" },
  { name: "Britannia", src: "/logos/britannia.png" },
  /* Adani Realty: the Adani group mark stands in. */
  { name: "Adani", src: "/logos/adani-realty.svg" },
  { name: "Interio by Godrej", src: "/logos/interio-by-godrej.png" },
  { name: "Envy", src: "/logos/envy.png" },
  { name: "Odisha Tourism", src: "/logos/odisha-tourism.png" },
  { name: "Mochi", src: "/logos/mochi.png" },
  { name: "Simpolo", src: "/logos/simpolo.webp" },
] as const;

function Strip({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-14 md:gap-20 pr-14 md:pr-20"
    >
      {BRANDS.map((b) => (
        <li key={b.name} className="shrink-0">
          <img
            src={b.src}
            alt={hidden ? "" : b.name}
            decoding="async"
            className="h-6 md:h-7 w-auto max-w-[140px] object-contain brightness-0 invert opacity-60 transition-opacity duration-300 hover:opacity-100"
          />
        </li>
      ))}
    </ul>
  );
}

export function BrandMarquee() {
  return (
    <div aria-label="Brands we work with" role="region">
      <p className="text-center text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-white/45 mb-7">
        Brands we work with
      </p>
      {/* Edges fade so logos enter and leave rather than get clipped. */}
      <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max animate-marquee motion-reduce:animate-none">
          <Strip />
          <Strip hidden />
        </div>
      </div>
    </div>
  );
}

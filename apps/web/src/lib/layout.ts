/**
 * The page shell.
 *
 * Every full-width section measures its content against this, so the left edge
 * is identical all the way down the page. It lives here rather than inline
 * because the hero's grid is owned by a separate client component, and two
 * copies of the same literal had already drifted 12px apart.
 *
 * Sections wanting a narrower reading column (FAQ, CTA) override `max-w-*` but
 * keep these gutters, so their padding still matches everything above.
 */
export const PAGE_SHELL = "mx-auto w-full max-w-[1560px] px-4 lg:px-10";

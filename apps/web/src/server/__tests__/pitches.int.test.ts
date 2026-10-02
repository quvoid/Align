// @vitest-environment node
/**
 * Domain rules for pitches, run against a real Postgres. Skipped unless
 * TEST_DATABASE_URL points at a throwaway database with the schema pushed
 * (CI does this; locally: `prisma db push` to any empty database, then
 * `TEST_DATABASE_URL=... pnpm --filter @branddeals/web test`).
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("pitch rules (Postgres)", () => {
  // Loaded after DATABASE_URL is pointed at the test database, because the
  // Prisma client reads it when the module is first imported.
  let prisma: typeof import("@branddeals/database").prisma;
  let createPitch: typeof import("../applications").createPitch;
  let withdrawPitch: typeof import("../applications").withdrawPitch;
  let reviewApplication: typeof import("../applications").reviewApplication;
  let PitchInputSchema: typeof import("@/lib/db-records").PitchInputSchema;
  let HttpError: typeof import("../http").HttpError;
  const run = `t${Date.now().toString(36)}`;

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    ({ prisma } = await import("@branddeals/database"));
    ({ createPitch, withdrawPitch, reviewApplication } = await import("../applications"));
    ({ PitchInputSchema } = await import("@/lib/db-records"));
    ({ HttpError } = await import("../http"));
  });

  afterAll(async () => {
    if (!prisma) return;
    await prisma.user.deleteMany({ where: { email: { startsWith: `${run}-` } } });
    await prisma.brand.deleteMany({ where: { slug: { startsWith: `${run}-` } } });
    await prisma.$disconnect();
  });

  async function creatorWithBriefs(tag: string, briefs: number) {
    const row = await prisma.user.create({
      data: {
        email: `${run}-${tag}@test.dev`,
        name: "Test Creator",
        role: "CREATOR",
        creatorProfile: { create: { igHandle: `${run}${tag}`, niche: ["Food"] } },
      },
    });
    const brands = await Promise.all(
      Array.from({ length: briefs }, (_, i) =>
        prisma.brand.create({
          data: {
            name: `Brand ${i}`,
            slug: `${run}-${tag}-${i}`,
            logo: "https://example.com/logo.png",
            description: "Test brief",
            industry: "FOOD",
            campaignTypes: ["INSTAGRAM_REEL"],
            budgetTier: "MACRO",
            requirements: {},
          },
        })
      )
    );
    const user = { id: row.id, email: row.email, name: row.name, avatar: null, role: "CREATOR" as const };
    return { user, brands };
  }

  const pitch = (slug: string) =>
    PitchInputSchema.parse({ briefSlug: slug, proposal: "A sixty-second Reel idea for this brief. ".repeat(2), deliverables: ["Reel"] });

  const statusOf = (r: PromiseSettledResult<unknown>) =>
    r.status === "fulfilled" ? 201 : r.reason instanceof HttpError ? r.reason.status : 500;

  it("holds the free allowance when pitches arrive at the same moment", async () => {
    const { user, brands } = await creatorWithBriefs("burst", 6);
    const results = await Promise.allSettled(brands.map((b) => createPitch(user, pitch(b.slug))));
    expect(results.map(statusOf).sort()).toEqual([201, 201, 201, 402, 402, 402]);
    expect(await prisma.application.count({ where: { creatorId: user.id } })).toBe(3);
  });

  it("keeps one pitch per brief when the same brief is sent twice at once", async () => {
    const { user, brands } = await creatorWithBriefs("dupe", 1);
    const results = await Promise.allSettled([createPitch(user, pitch(brands[0]!.slug)), createPitch(user, pitch(brands[0]!.slug))]);
    expect(results.map(statusOf).sort()).toEqual([201, 409]);
  });

  it("lets a member pitch past the free allowance", async () => {
    const { user, brands } = await creatorWithBriefs("member", 4);
    await prisma.membership.create({ data: { userId: user.id, plan: "ALL_ACCESS", status: "ACTIVE", source: "GRANT" } });
    for (const b of brands) await createPitch(user, pitch(b.slug));
    expect(await prisma.application.count({ where: { creatorId: user.id } })).toBe(4);
  });

  it("re-pitching after a withdrawal reuses the row, and admins can't review a withdrawn pitch", async () => {
    const { user, brands } = await creatorWithBriefs("redo", 1);
    const first = await createPitch(user, pitch(brands[0]!.slug));
    await withdrawPitch(user, first.id);
    await expect(
      reviewApplication({ ...user, role: "ADMIN" }, first.id, { status: "SHORTLISTED" })
    ).rejects.toMatchObject({ status: 409 });
    const again = await createPitch(user, pitch(brands[0]!.slug));
    expect(again.id).toBe(first.id);
    expect(again.status).toBe("PENDING");
  });
});

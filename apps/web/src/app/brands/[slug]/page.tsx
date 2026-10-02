import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getActiveBrief, listActiveBriefs } from "@/server/briefs";
import { BriefDetail } from "./brief-detail";

// Static, refreshed every minute and immediately when an admin publishes or
// pauses a brief (revalidateBriefPages). This is where paid traffic lands.
export const revalidate = 60;

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getActiveBrief(slug);

  if (!brand) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-8 pt-10 pb-12 text-center">
        <h1 className="text-2xl font-semibold text-primary mb-2">Brief not found</h1>
        <p className="text-text-secondary text-sm mb-6">This brief has closed or the link is wrong.</p>
        <Link href="/brands">
          <Button variant="accent">Browse open briefs</Button>
        </Link>
      </div>
    );
  }

  // Related briefs for internal SEO linking.
  const related = (await listActiveBriefs()).filter((b) => b.slug !== brand.slug).slice(0, 3);

  return <BriefDetail brand={brand} related={related} />;
}

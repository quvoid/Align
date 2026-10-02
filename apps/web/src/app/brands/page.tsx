import { listActiveBriefs } from "@/server/briefs";
import { BrandsBrowser } from "./brands-browser";

// Static, refreshed every minute and immediately when an admin publishes or
// pauses a brief (revalidateBriefPages).
export const revalidate = 60;

export default async function BrandsPage() {
  return <BrandsBrowser initialBrands={await listActiveBriefs()} />;
}

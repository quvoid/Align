import { respond } from "@/server/http";
import { requireAdmin } from "@/server/session";
import { getCreator } from "@/server/creators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    await requireAdmin();
    const { id } = await params;
    return { creator: await getCreator(id) };
  });
}

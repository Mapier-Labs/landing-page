import { renderDazziSharePage } from "../../../lib/sharedLinks";

export async function GET(_req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return renderDazziSharePage(eventId);
}

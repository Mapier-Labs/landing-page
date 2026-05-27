import { fetchDazziShareData } from "@/lib/og/dazzi/fetchDazziShareData";
import { renderDazziOgImage } from "@/lib/og/dazzi/DazziTicketCard";
import { mockDazziOgPreview, mockDazziOgPreviewEmpty } from "@/lib/og/dazzi/mockDazziOgPreview";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const origin = new URL(req.url).origin;
  const data =
    id === "preview"
      ? mockDazziOgPreview()
      : id === "preview-empty"
        ? mockDazziOgPreviewEmpty()
        : await fetchDazziShareData(id);
  return renderDazziOgImage(data, origin);
}

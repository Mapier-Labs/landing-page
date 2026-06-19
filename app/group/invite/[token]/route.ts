import { renderGroupInvitePage } from "../../../../lib/sharedLinks";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return renderGroupInvitePage(token);
}

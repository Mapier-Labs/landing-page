import { renderReferralInvitePage } from "../../../lib/sharedLinks";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return renderReferralInvitePage(code);
}

import { renderProfileSharePage } from "../../../lib/sharedLinks";

export async function GET(_req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return renderProfileSharePage(username);
}

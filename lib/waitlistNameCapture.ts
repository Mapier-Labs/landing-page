export interface SupabaseErrorLike {
  code?: string;
  message: string;
}

interface WaitlistClient {
  rpc(
    fn: "save_waitlist_phone_name",
    args: { p_phone: string; p_first_name: string; p_last_name: string | null }
  ): PromiseLike<{ data: boolean | null; error: SupabaseErrorLike | null }>;
}

export type SaveWaitlistPhoneNameResult = { ok: true } | { ok: false; error: SupabaseErrorLike };

export async function saveWaitlistPhoneName(
  client: WaitlistClient,
  phone: string,
  firstName: string,
  lastName: string
): Promise<SaveWaitlistPhoneNameResult> {
  const saved = await client.rpc("save_waitlist_phone_name", {
    p_phone: phone,
    p_first_name: firstName,
    p_last_name: lastName.length > 0 ? lastName : null,
  });
  if (saved.error) return { ok: false, error: saved.error };
  return { ok: true };
}

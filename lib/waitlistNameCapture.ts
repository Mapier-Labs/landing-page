interface SupabaseErrorLike {
  code?: string;
  message: string;
}

type UpdateResult = {
  data: Array<{ id: string }> | null;
  error: SupabaseErrorLike | null;
};

interface WaitlistClient {
  from(table: "waitlist"): {
    update(values: { name: string }): {
      eq(
        column: "phone",
        value: string
      ): {
        select(columns?: string): PromiseLike<UpdateResult>;
      };
    };
    insert(values: { phone: string; name: string }): PromiseLike<{
      error: SupabaseErrorLike | null;
    }>;
  };
}

export type SaveWaitlistPhoneNameResult =
  | { ok: true; matchedExisting: boolean }
  | { ok: false; error: SupabaseErrorLike };

function composeFullName(first: string, last: string): string {
  return last.length > 0 ? `${first} ${last}` : first;
}

async function updateNameByPhone(
  client: WaitlistClient,
  phone: string,
  fullName: string
): Promise<UpdateResult> {
  return client.from("waitlist").update({ name: fullName }).eq("phone", phone).select("id");
}

export async function saveWaitlistPhoneName(
  client: WaitlistClient,
  phone: string,
  firstName: string,
  lastName: string
): Promise<SaveWaitlistPhoneNameResult> {
  const fullName = composeFullName(firstName, lastName);

  const updated = await updateNameByPhone(client, phone, fullName);
  if (updated.error) {
    return { ok: false, error: updated.error };
  }
  if (updated.data && updated.data.length > 0) {
    return { ok: true, matchedExisting: true };
  }

  const inserted = await client.from("waitlist").insert({ phone, name: fullName });
  if (!inserted.error) {
    return { ok: true, matchedExisting: false };
  }

  if (inserted.error.code === "23505") {
    const retried = await updateNameByPhone(client, phone, fullName);
    if (retried.error) {
      return { ok: false, error: retried.error };
    }
    if (retried.data && retried.data.length > 0) {
      return { ok: true, matchedExisting: true };
    }
  }

  return { ok: false, error: inserted.error };
}

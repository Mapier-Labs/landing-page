import assert from "node:assert/strict";
import test from "node:test";
import { saveWaitlistPhoneName } from "./waitlistNameCapture.ts";

type SupabaseError = { code: string; message: string };
type QueryResult<T> = Promise<{ data: T | null; error: SupabaseError | null }>;

interface FakeClientOptions {
  updateResults: Array<{ data: Array<{ id: string }> | null; error: SupabaseError | null }>;
  insertError?: SupabaseError | null;
}

function makeFakeClient({ updateResults, insertError = null }: FakeClientOptions) {
  const calls: Array<{ op: string; values?: unknown; column?: string; value?: string }> = [];

  const client = {
    from(table: string) {
      assert.equal(table, "waitlist");
      return {
        update(values: unknown) {
          calls.push({ op: "update", values });
          return {
            eq(column: string, value: string) {
              calls.push({ op: "eq", column, value });
              return {
                select(): QueryResult<Array<{ id: string }>> {
                  const result = updateResults.shift() ?? { data: [], error: null };
                  return Promise.resolve(result);
                },
              };
            },
          };
        },
        insert(values: unknown) {
          calls.push({ op: "insert", values });
          return Promise.resolve({ data: null, error: insertError });
        },
      };
    },
  };

  return { client, calls };
}

test("updates the existing phone row with the submitted full name", async () => {
  const { client, calls } = makeFakeClient({
    updateResults: [{ data: [{ id: "row-1" }], error: null }],
  });

  const result = await saveWaitlistPhoneName(client, "+15551234567", "Ada", "Lovelace");

  assert.deepEqual(result, { ok: true, matchedExisting: true });
  assert.deepEqual(calls, [
    { op: "update", values: { name: "Ada Lovelace" } },
    { op: "eq", column: "phone", value: "+15551234567" },
  ]);
});

test("retries the update when fallback insert hits a duplicate phone race", async () => {
  const { client, calls } = makeFakeClient({
    updateResults: [
      { data: [], error: null },
      { data: [{ id: "row-2" }], error: null },
    ],
    insertError: { code: "23505", message: "duplicate key value violates unique constraint" },
  });

  const result = await saveWaitlistPhoneName(client, "+15557654321", "Grace", "Hopper");

  assert.deepEqual(result, { ok: true, matchedExisting: true });
  assert.deepEqual(calls, [
    { op: "update", values: { name: "Grace Hopper" } },
    { op: "eq", column: "phone", value: "+15557654321" },
    { op: "insert", values: { phone: "+15557654321", name: "Grace Hopper" } },
    { op: "update", values: { name: "Grace Hopper" } },
    { op: "eq", column: "phone", value: "+15557654321" },
  ]);
});

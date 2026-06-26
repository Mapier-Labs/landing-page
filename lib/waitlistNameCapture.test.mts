import assert from "node:assert/strict";
import test from "node:test";
import { saveWaitlistPhoneName } from "./waitlistNameCapture.ts";

test("calls the backend-owned waitlist name RPC with full name fields", async () => {
  const calls: unknown[] = [];
  const client = {
    async rpc(name: string, args: unknown) {
      calls.push({ name, args });
      return { data: true, error: null };
    },
  };

  const result = await saveWaitlistPhoneName(client, "+15551234567", "Ada", "Lovelace");

  assert.deepEqual(result, { ok: true });
  assert.deepEqual(calls, [
    {
      name: "save_waitlist_phone_name",
      args: {
        p_phone: "+15551234567",
        p_first_name: "Ada",
        p_last_name: "Lovelace",
      },
    },
  ]);
});

test("passes null last name to the waitlist name RPC when omitted", async () => {
  let rpcArgs: unknown;
  const client = {
    async rpc(_name: string, args: unknown) {
      rpcArgs = args;
      return { data: true, error: null };
    },
  };

  const result = await saveWaitlistPhoneName(client, "+15557654321", "Grace", "");

  assert.deepEqual(result, { ok: true });
  assert.deepEqual(rpcArgs, {
    p_phone: "+15557654321",
    p_first_name: "Grace",
    p_last_name: null,
  });
});

test("returns RPC errors without throwing", async () => {
  const client = {
    async rpc() {
      return { data: null, error: { code: "23514", message: "invalid phone" } };
    },
  };

  const result = await saveWaitlistPhoneName(client, "+1555", "Bad", "");

  assert.deepEqual(result, { ok: false, error: { code: "23514", message: "invalid phone" } });
});

// Accepts either {email, name} (home-page form) or {phone[, first_name,
// last_name]} (QR claim flow). The waitlist Postgres table has a CHECK
// constraint requiring at least one identifier, so server-side validation
// here mirrors that.
//
// The QR flow calls this twice per user:
//   1. After OTP+claim succeeds — `{phone}` only, mirrors the verified
//      phone onto the waitlist row.
//   2. After the NameEntry screen — `{phone, first_name, last_name?}`,
//      back-fills the name onto the same row (upsert by phone).
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function composeFullName(first: string, last: string): string {
  return last.length > 0 ? `${first} ${last}` : first;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
    const rawFirstName =
      typeof body.first_name === "string" ? body.first_name.trim().slice(0, 60) : "";
    const rawLastName =
      typeof body.last_name === "string" ? body.last_name.trim().slice(0, 60) : "";

    const hasEmailEntry = rawEmail !== "" || rawName !== "";
    const hasPhoneEntry = rawPhone !== "";
    const hasPhoneName = hasPhoneEntry && rawFirstName !== "";

    if (!hasEmailEntry && !hasPhoneEntry) {
      return NextResponse.json(
        { error: "Provide either an email + name, or a phone number." },
        { status: 400 }
      );
    }

    // Phone path (QR claim flow). Splits into:
    //  - phone-only insert (first call from ClaimFlow.handleClaimed)
    //  - phone+name upsert (second call from NameEntry.handleSubmit)
    if (hasPhoneEntry && !hasEmailEntry) {
      // Loose E.164 check — leading +, then 8–15 digits.
      if (!/^\+\d{8,15}$/.test(rawPhone)) {
        return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
      }

      // Phone + name → upsert. The first ClaimFlow call already inserted
      // the phone row, so this back-fills `name`. Onconflict=phone makes
      // it idempotent if the order is reversed or the first call is lost.
      if (hasPhoneName) {
        const fullName = composeFullName(rawFirstName, rawLastName);
        const { error } = await supabase
          .from("waitlist")
          .upsert({ phone: rawPhone, name: fullName }, { onConflict: "phone" });
        if (error) {
          // Schema not ready (phone column missing). Degrade gracefully
          // so the QR flow doesn't fail post-claim.
          if (error.code === "42703" || error.code === "23502") {
            console.warn("Waitlist schema not ready for name upsert:", error.message);
            return NextResponse.json(
              { success: true, message: "Skipped (schema pending)." },
              { status: 200 }
            );
          }
          console.error("Supabase upsert error (phone + name):", error);
          return NextResponse.json({ error: "Failed to save name" }, { status: 500 });
        }
        console.log("Waitlist name capture (phone):", {
          phone: rawPhone,
          name: fullName,
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json({ success: true, message: "Name saved." }, { status: 200 });
      }

      // Phone-only insert.
      const { error } = await supabase.from("waitlist").insert({ phone: rawPhone });

      if (error) {
        // Already on the waitlist via the same phone — treat as success so the
        // QR flow doesn't fail the user on a re-scan.
        if (error.code === "23505") {
          return NextResponse.json(
            { success: true, message: "Already on the waitlist." },
            { status: 200 }
          );
        }
        // Migration not yet live (column missing) — log and degrade to no-op so
        // the QR flow doesn't break in the gap between this code shipping and
        // the backend migration landing on prod.
        if (error.code === "42703" || error.code === "23502") {
          console.warn("Waitlist phone column not ready, skipping insert:", error.message);
          return NextResponse.json(
            { success: true, message: "Skipped (schema pending)." },
            { status: 200 }
          );
        }
        console.error("Supabase insert error (phone):", error);
        return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
      }

      console.log("Waitlist signup (phone):", {
        phone: rawPhone,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { success: true, message: "Successfully joined the waitlist!" },
        { status: 200 }
      );
    }

    // Email path (home-page form) — keep prior contract.
    if (!rawEmail || !rawName) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const { error } = await supabase.from("waitlist").insert({
      name: rawName,
      email: rawEmail.toLowerCase(),
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already on the waitlist!" },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    console.log("Waitlist signup (email):", {
      email: rawEmail,
      name: rawName,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json({ error: "Server error, please try again later" }, { status: 500 });
  }
}

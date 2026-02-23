import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    // Here you can save data to database or send to external service
    // Currently returns success, can integrate Vercel KV, database, or other services later
    // Example: await saveToDatabase({ email, name, timestamp: new Date() });

    // Can integrate one of the following services:
    // 1. Vercel KV (Redis)
    // 2. Airtable
    // 3. Google Sheets API
    // 4. Custom database

    console.log("Waitlist submission:", { email, name, timestamp: new Date().toISOString() });

    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json({ error: "Server error, please try again later" }, { status: 500 });
  }
}

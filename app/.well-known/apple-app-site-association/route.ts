import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: "HV58968J2R.ai.mapier.app",
          paths: ["/share/post/*", "/share/profile/*"],
        },
      ],
    },
  });
}

const TEAM_ID = "HV58968J2R";
const IOS_BUNDLE_IDS = ["ai.mapier.app", "ai.mapier.native"] as const;
const AASA_PATHS = ["/post/*", "/profile/*", "/dazzi/*", "/invite/*", "/group/invite/*"] as const;

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      applinks: {
        apps: [],
        details: IOS_BUNDLE_IDS.map((bundleId) => ({
          appID: `${TEAM_ID}.${bundleId}`,
          paths: AASA_PATHS,
        })),
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

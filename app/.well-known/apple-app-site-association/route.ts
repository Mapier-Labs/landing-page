import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: 'FT3A737KDZ.ai.mapier',
          paths: ['/share/post/*', '/share/profile/*'],
        },
      ],
    },
  });
}

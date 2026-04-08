import { NextResponse } from 'next/server';

const ANDROID_SHA256 =
  process.env.ANDROID_SHA256_FINGERPRINT ??
  '0F:1F:6C:C3:0A:0E:28:BF:A0:5B:91:71:F5:B5:81:FE:B7:4B:BE:2C:2B:52:C1:0F:3F:68:5D:D8:51:70:2E:8F';

export async function GET() {
  return NextResponse.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'ai.mapier',
        sha256_cert_fingerprints: [ANDROID_SHA256],
      },
    },
  ]);
}

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Authorization token issuing is not available in the current @unlink-xyz/sdk version (0.0.2-canary.0). " +
        "The admin module documented at docs.unlink.xyz has not been shipped yet. " +
        "See https://dashboard.unlink.xyz for SDK updates.",
    },
    { status: 501 }
  );
}

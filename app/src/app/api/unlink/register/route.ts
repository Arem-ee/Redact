import { NextRequest, NextResponse } from "next/server";
import { createUnlinkAdmin, createUnlinkAuthRoutes } from "@unlink-xyz/sdk/admin";

const apiKey = process.env.UNLINK_API_KEY;

let routes: ReturnType<typeof createUnlinkAuthRoutes<{}>> | null = null;

function getRoutes() {
  if (routes) return routes;
  if (!apiKey) {
    throw new Error("UNLINK_API_KEY environment variable is not set");
  }
  const admin = createUnlinkAdmin({ environment: "monad-testnet", apiKey });
  routes = createUnlinkAuthRoutes<{}>({
    admin,
    authenticate: async () => ({}),
    authorizeUnlinkAddress: async () => true,
  });
  return routes;
}

export async function POST(request: NextRequest) {
  try {
    const handler = getRoutes().register;
    const response = await handler(request);
    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

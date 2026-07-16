import { NextRequest, NextResponse } from "next/server";
import { createUnlinkClient, createUser } from "@unlink-xyz/sdk";

function hexToUint8Array(hex: string): Uint8Array {
  const hexClean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(hexClean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hexClean.substr(i * 2, 2), 16);
  }
  return bytes;
}

function parseBigIntArray(arr: unknown): [bigint, bigint] {
  if (!Array.isArray(arr) || arr.length !== 2) {
    throw new Error("spendingPublicKey must be an array of 2 decimal strings");
  }
  return [BigInt(arr[0]), BigInt(arr[1])];
}

export async function POST(request: NextRequest) {
  const engineUrl = process.env.UNLINK_ENGINE_URL;
  const apiKey = process.env.UNLINK_API_KEY;

  if (!engineUrl || !apiKey) {
    return NextResponse.json(
      { error: "Unlink engine URL and API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const { spendingPublicKey, viewingPrivateKey, nullifyingKey } = body;

    if (typeof viewingPrivateKey !== "string" || typeof nullifyingKey !== "string") {
      return NextResponse.json(
        { error: "Invalid payload: expected spendingPublicKey (string[2]), viewingPrivateKey (hex string), nullifyingKey (decimal string)" },
        { status: 400 }
      );
    }

    const client = createUnlinkClient(engineUrl, apiKey);
    const result = await createUser(client, {
      spendingPublicKey: parseBigIntArray(spendingPublicKey),
      viewingPrivateKey: hexToUint8Array(viewingPrivateKey),
      nullifyingKey: BigInt(nullifyingKey),
    });

    return NextResponse.json({ address: result.address, index: result.index });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

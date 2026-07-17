"use client";

import { createUnlinkClient } from "@unlink-xyz/sdk/client";
import type { UnlinkClient } from "@unlink-xyz/sdk/client";
import { account, buildDeriveSeedMessage } from "@unlink-xyz/sdk/crypto";

const APP_ID = "redact";
const CHAIN_ID = 10143;

let _client: UnlinkClient | null = null;

export async function getUnlinkClient(
  signMessageAsync: (message: string) => Promise<`0x${string}`>,
): Promise<UnlinkClient> {
  if (_client) return _client;
  const message = buildDeriveSeedMessage({ appId: APP_ID, chainId: CHAIN_ID });
  const signature = await signMessageAsync(message);
  const unlinkAccount = account.fromEthereumSignature({
    signature,
    appId: APP_ID,
    chainId: CHAIN_ID,
  });
  _client = createUnlinkClient({
    environment: "monad-testnet",
    account: unlinkAccount,
    registerUrl: "/api/unlink/register",
    authorizationToken: { url: "/api/unlink/authorization-token" },
  });
  await _client.ensureRegistered();
  return _client;
}

export function clearUnlinkClient() {
  _client = null;
}

export async function fetchPrivateBalance(
  client: UnlinkClient,
): Promise<string | null> {
  const balances = await client.getBalances();
  if (!balances || !balances.balances || balances.balances.length === 0) {
    return null;
  }
  const total = balances.balances.reduce(
    (sum, b) => sum + BigInt(b.amount ?? "0"),
    BigInt(0),
  );
  if (total === BigInt(0)) return null;
  return total.toString();
}

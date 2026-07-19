"use client";

import { useAccount, useConnect, useSignMessage, useWalletClient } from "wagmi";
import { injected } from "wagmi/connectors";
import { useState } from "react";
import { getUnlinkClient } from "@/lib/unlink";

export default function DebugPage() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { data: walletClient } = useWalletClient();

  const [rawBalances, setRawBalances] = useState<object | null>(null);
  const [unlinkAddress, setUnlinkAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [faucetStatus, setFaucetStatus] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState("");

  const fetchRawBalances = async () => {
    if (!isConnected) return;
    setLoading(true);
    setError(null);
    setRawBalances(null);
    try {
      const client = await getUnlinkClient(
        (msg: string) => signMessageAsync({ message: msg }),
        walletClient ?? undefined,
      );
      const [address, balances] = await Promise.all([
        client.getAddress(),
        client.getBalances(),
      ]);
      setUnlinkAddress(address);
      setRawBalances(balances);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const claimFaucet = async () => {
    if (!isConnected) return;
    const token = tokenAddress.trim();
    if (!token) { setFaucetStatus("Enter a token address first"); return; }
    setFaucetStatus("Claiming...");
    try {
      const client = await getUnlinkClient(
        (msg: string) => signMessageAsync({ message: msg }),
        walletClient ?? undefined,
      );
      const result = await client.faucet.requestTestTokens({ token });
      setFaucetStatus(JSON.stringify(result, null, 2));
    } catch (err) {
      setFaucetStatus(err instanceof Error ? err.message : "Faucet claim failed");
    }
  };

  const claimPrivateFaucet = async () => {
    if (!isConnected) return;
    const token = tokenAddress.trim();
    if (!token) { setFaucetStatus("Enter a token address first"); return; }
    setFaucetStatus("Claiming private tokens...");
    try {
      const client = await getUnlinkClient(
        (msg: string) => signMessageAsync({ message: msg }),
        walletClient ?? undefined,
      );
      const result = await client.faucet.requestPrivateTokens({ token });
      setFaucetStatus(JSON.stringify(result, null, 2));
    } catch (err) {
      setFaucetStatus(err instanceof Error ? err.message : "Private faucet claim failed");
    }
  };

  return (
    <div className="min-h-screen bg-studio p-8">
      <h1 className="font-display text-2xl font-bold text-ink mb-6">Balance Diagnostics</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          disabled={isConnecting}
          className="bg-redact text-white px-4 py-2 text-sm font-label uppercase tracking-wider cursor-pointer"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-6 max-w-2xl">
          <p className="font-mono text-sm text-muted">Wallet: {address}</p>

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-wider text-muted block">
              Token Address (for faucet, leave empty for default)
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full border border-line/[0.08] bg-white px-3 py-2 font-mono text-sm text-ink"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchRawBalances}
              disabled={loading}
              className="bg-redact text-white px-4 py-2 text-sm font-label uppercase tracking-wider disabled:bg-line disabled:text-muted cursor-pointer"
            >
              {loading ? "Loading..." : "Fetch Raw Balances"}
            </button>
            <button
              onClick={claimFaucet}
              className="border border-redact/40 text-redact px-4 py-2 text-sm font-label uppercase tracking-wider cursor-pointer"
            >
              Claim Test Tokens (EVM)
            </button>
            <button
              onClick={claimPrivateFaucet}
              className="border border-redact/40 text-redact px-4 py-2 text-sm font-label uppercase tracking-wider cursor-pointer"
            >
              Claim Private Tokens (Shielded)
            </button>
          </div>

          {unlinkAddress && (
            <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] p-4">
              <h2 className="font-label text-xs uppercase tracking-wider text-muted mb-2">Unlink Address</h2>
              <p className="font-mono text-sm text-ink break-all select-all">{unlinkAddress}</p>
            </div>
          )}

          {rawBalances && (
            <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] p-4">
              <h2 className="font-label text-xs uppercase tracking-wider text-muted mb-2">Raw getBalances() Response</h2>
              <pre className="font-mono text-xs text-ink whitespace-pre-wrap break-all">
                {JSON.stringify(rawBalances, null, 2)}
              </pre>
            </div>
          )}

          {faucetStatus && (
            <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] p-4">
              <h2 className="font-label text-xs uppercase tracking-wider text-muted mb-2">Faucet Result</h2>
              <pre className="font-mono text-xs text-ink whitespace-pre-wrap break-all">
                {faucetStatus}
              </pre>
            </div>
          )}

          {error && (
            <div className="border border-redact/20 p-4">
              <p className="font-sans text-sm text-redact">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

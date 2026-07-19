"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "./Modal";
import { getUnlinkClient } from "@/lib/unlink";
import type { WalletClient } from "viem";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  onWithdrawComplete: () => void;
  signMessageAsync: (msg: string) => Promise<`0x${string}`>;
  walletClient: WalletClient | undefined;
  isWrongNetwork: boolean;
}

type TxStage =
  | "idle"
  | "signing"
  | "withdrawing"
  | "pending"
  | "confirmed"
  | "failed";

interface BalanceEntry {
  token: string;
  amount: string;
}

export function WithdrawModal({
  open,
  onClose,
  onWithdrawComplete,
  signMessageAsync,
  walletClient,
  isWrongNetwork,
}: WithdrawModalProps) {
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<TxStage>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<BalanceEntry[] | null>(null);
  const [balancesLoading, setBalancesLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      setBalancesLoading(true);
      (async () => {
        try {
          const client = await getUnlinkClient(signMessageAsync, walletClient);
          const data = await client.getBalances();
          const entries: BalanceEntry[] = (data?.balances ?? [])
            .map((b: { token: string; amount?: string }) => ({ token: b.token, amount: b.amount ?? "0" }))
            .filter((b: BalanceEntry) => b.token);
          setBalances(entries);
          const firstWithBalance = entries.find(
            (b: BalanceEntry) => BigInt(b.amount) > 0n,
          );
          if (firstWithBalance) setToken(firstWithBalance.token);
        } catch {
          setBalances([]);
        } finally {
          setBalancesLoading(false);
        }
      })();
    }, 0);
    return () => clearTimeout(id);
  }, [open, signMessageAsync, walletClient]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (isWrongNetwork) {
      setError("Wrong network. Switch to Monad Testnet.");
      return;
    }
    if (!recipient || !recipient.startsWith("0x") || recipient.length !== 42) {
      setError("Enter a valid recipient 0x address.");
      return;
    }
    if (!token || token === "0x0000000000000000000000000000000000000000") {
      setError("Enter a valid token address (non-zero). Zero address is not a withdrawable token.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    setStage("signing");
    try {
      const client = await getUnlinkClient(signMessageAsync, walletClient);

      const wei = BigInt(Math.floor(parseFloat(amount) * 1e18)).toString();

      setStage("withdrawing");
      const handle = await client.withdraw({
        recipientEvmAddress: recipient as `0x${string}`,
        token,
        amount: wei,
      });

      setStage("pending");
      const result = await handle.wait();

      setTxHash(result.txHash ?? null);
      if (result.fundsUsable || result.confirmationStatus !== "failed") {
        setStage("confirmed");
        onWithdrawComplete();
      } else {
        setStage("failed");
        setError("Transaction failed on chain.");
      }
    } catch (err) {
      setStage("failed");
      const msg = err instanceof Error ? err.message : "Withdraw failed";
      if (msg.includes("rejected") || msg.includes("denied")) {
        setError("Transaction rejected in wallet.");
      } else {
        setError(msg);
      }
    }
  };

  const isProcessing = stage === "signing" || stage === "withdrawing" || stage === "pending";

  return (
    <Modal open={open} onClose={onClose} title="Withdraw">
      <form onSubmit={handleSubmit} className="space-y-4">
        {balancesLoading && (
          <p className="font-sans text-xs text-muted italic">Loading available tokens…</p>
        )}

        {balances && balances.length > 0 && (
          <div className="bg-studio border border-line/[0.06] p-3 space-y-1">
            <p className="font-label text-[10px] uppercase tracking-wider text-muted">
              Available private balances
            </p>
            {balances.map((b) => (
              <div
                key={b.token}
                className="flex justify-between items-center font-mono text-xs"
              >
                <span className="text-ink truncate max-w-[180px]">{b.token}</span>
                <span className="text-muted">
                  {b.amount && BigInt(b.amount) > 0n
                    ? (Number(BigInt(b.amount)) / 1e18).toFixed(4)
                    : "0"}
                </span>
              </div>
            ))}
          </div>
        )}

        {balances && balances.length === 0 && !balancesLoading && (
          <p className="font-sans text-xs text-muted italic">No token balances found.</p>
        )}

        <div>
          <label className="font-label text-xs uppercase tracking-wider text-muted block mb-1">
            Recipient Address
          </label>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isProcessing}
            placeholder="0x..."
            className="w-full border border-line/[0.08] px-3 py-2 font-mono text-sm text-ink placeholder:text-muted/50 disabled:opacity-50 focus:outline-2 focus:outline-ink bg-studio"
          />
        </div>

        <div>
          <label className="font-label text-xs uppercase tracking-wider text-muted block mb-1">
            Token Address
          </label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={isProcessing}
            placeholder="0x..."
            className="w-full border border-line/[0.08] px-3 py-2 font-mono text-sm text-ink placeholder:text-muted/50 disabled:opacity-50 focus:outline-2 focus:outline-ink bg-studio"
          />
          {!token && balances && balances.length > 0 && (
            <p className="font-sans text-[10px] text-redact mt-1">
              Select a token from the available balances above — the zero address is not withdrawable.
            </p>
          )}
        </div>

        <div>
          <label className="font-label text-xs uppercase tracking-wider text-muted block mb-1">
            Amount
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
            placeholder="0.0"
            className="w-full border border-line/[0.08] px-3 py-2 font-sans text-sm text-ink placeholder:text-muted/50 disabled:opacity-50 focus:outline-2 focus:outline-ink bg-studio"
          />
        </div>

        {stage === "signing" && (
          <p className="font-sans text-sm text-muted">Signing with your wallet…</p>
        )}
        {stage === "withdrawing" && (
          <p className="font-sans text-sm text-muted">Withdrawing from the privacy pool…</p>
        )}
        {stage === "pending" && (
          <p className="font-sans text-sm text-muted">Waiting for chain confirmation…</p>
        )}
        {stage === "confirmed" && txHash && (
          <div className="bg-studio border border-line/[0.06] p-3">
            <p className="font-sans text-sm text-emerald-700 font-semibold">Withdraw confirmed</p>
            <p className="font-mono text-xs text-muted break-all mt-1">tx: {txHash}</p>
          </div>
        )}
        {error && (
          <p className="font-sans text-xs text-redact break-words">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          {stage === "confirmed" ? (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={isProcessing || !amount || !recipient || !token || isWrongNetwork}
                className="flex-1 bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
              >
                {isProcessing ? "Processing…" : "Withdraw"}
              </button>
              {!isProcessing && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="border border-redact/40 text-redact text-sm font-label uppercase tracking-wider px-6 py-3 hover:bg-redact hover:text-white disabled:border-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
                >
                  Cancel
                </button>
              )}
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}

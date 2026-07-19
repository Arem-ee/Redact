"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { getUnlinkClient } from "@/lib/unlink";
import type { WalletClient } from "viem";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  onDepositComplete: () => void;
  signMessageAsync: (msg: string) => Promise<`0x${string}`>;
  walletClient: WalletClient | undefined;
  isWrongNetwork: boolean;
}

type TxStage =
  | "idle"
  | "signing"
  | "depositing"
  | "pending"
  | "confirmed"
  | "failed";

export function DepositModal({
  open,
  onClose,
  onDepositComplete,
  signMessageAsync,
  walletClient,
  isWrongNetwork,
}: DepositModalProps) {
  const [token, setToken] = useState("0x0000000000000000000000000000000000000000");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<TxStage>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (isWrongNetwork) {
      setError("Wrong network. Switch to Monad Testnet.");
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

      setStage("depositing");
      const handle = await client.deposit({ token, amount: wei });

      setStage("pending");
      const result = await handle.wait();

      setTxHash(result.txHash ?? null);
      if (result.fundsUsable) {
        setStage("confirmed");
        onDepositComplete();
      } else if (result.confirmationStatus === "failed") {
        setStage("failed");
        setError("Transaction failed on chain.");
      } else {
        setStage("confirmed");
        onDepositComplete();
      }
    } catch (err) {
      setStage("failed");
      const msg = err instanceof Error ? err.message : "Deposit failed";
      if (msg.includes("rejected") || msg.includes("denied")) {
        setError("Transaction rejected in wallet.");
      } else if (msg.includes("insufficient funds") || msg.includes("balance")) {
        setError("Insufficient funds for this deposit.");
      } else if (msg.includes("wrong network") || msg.includes("chain")) {
        setError("Wrong network. Switch to Monad Testnet.");
      } else {
        setError(msg);
      }
    }
  };

  const isProcessing = stage === "signing" || stage === "depositing" || stage === "pending";

  return (
    <Modal open={open} onClose={onClose} title="Deposit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-label text-xs uppercase tracking-wider text-muted block mb-1">
            Token
          </label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={isProcessing}
            className="w-full border border-line/[0.08] px-3 py-2 font-mono text-sm text-ink placeholder:text-muted/50 disabled:opacity-50 focus:outline-2 focus:outline-ink bg-studio"
          />
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
        {stage === "depositing" && (
          <p className="font-sans text-sm text-muted">Depositing into the privacy pool…</p>
        )}
        {stage === "pending" && (
          <p className="font-sans text-sm text-muted">Waiting for chain confirmation…</p>
        )}
        {stage === "confirmed" && txHash && (
          <div className="bg-studio border border-line/[0.06] p-3">
            <p className="font-sans text-sm text-emerald-700 font-semibold">Deposit confirmed</p>
            <p className="font-mono text-xs text-muted break-all mt-1">tx: {txHash}</p>
          </div>
        )}
        {error && (
          <p className="font-sans text-sm text-redact">{error}</p>
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
                disabled={isProcessing || !amount || isWrongNetwork}
                className="flex-1 bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
              >
                {isProcessing ? "Processing…" : "Deposit"}
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

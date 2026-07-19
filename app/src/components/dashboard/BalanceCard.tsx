"use client";

import { DissolveValue } from "./DissolveValue";

interface BalanceCardProps {
  balance: string | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  walletConnected: boolean;
  isWrongNetwork: boolean;
}

function BalanceSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-3 w-24 bg-line/30" />
      <div className="h-8 w-40 bg-line/30" />
    </div>
  );
}

function BalanceError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="space-y-3">
      <p className="font-sans text-sm text-redact/80">{message}</p>
      <button
        onClick={onRetry}
        className="text-xs font-label uppercase tracking-wider text-redact underline underline-offset-4 hover:text-reveal transition-colors cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
      >
        Retry
      </button>
    </div>
  );
}

export function BalanceCard({ balance, loading, error, onRetry, onDeposit, onWithdraw, walletConnected, isWrongNetwork }: BalanceCardProps) {
  return (
    <section className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] p-6 sm:p-8">
      <h2 className="font-label text-xs uppercase tracking-[0.06em] text-muted mb-3">
        Your balance
      </h2>

      <div className="min-h-[72px]">
        {loading ? (
          <BalanceSkeleton />
        ) : error ? (
          <BalanceError message={error} onRetry={onRetry} />
        ) : isWrongNetwork ? (
          <p className="font-sans text-base text-muted">Switch to Monad Testnet to view your balance.</p>
        ) : !walletConnected ? (
          <p className="font-sans text-base text-muted">Connect your wallet to view balance.</p>
        ) : balance === null ? (
          <p className="font-sans text-base text-muted">No funds yet. Deposit to get started.</p>
        ) : (
          <DissolveValue
            value={balance}
            className="font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight"
          />
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onDeposit}
          disabled={!walletConnected || isWrongNetwork}
          className="bg-redact text-white text-sm font-label uppercase tracking-wider px-6 py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
        >
          Deposit
        </button>
        <button
          onClick={onWithdraw}
          disabled={!walletConnected || isWrongNetwork}
          className="border border-redact/40 text-redact text-sm font-label uppercase tracking-wider px-6 py-3 hover:bg-redact hover:text-white disabled:border-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
        >
          Withdraw
        </button>
      </div>
    </section>
  );
}

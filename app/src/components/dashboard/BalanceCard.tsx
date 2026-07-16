"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

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
      <div className="h-3 w-24 bg-paper-text/10" />
      <div className="h-8 w-40 bg-paper-text/10" />
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

function BalanceValue({ balance }: { balance: string }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRevealed) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsRevealed(false);
        setIsHovered(false);
      }, 3500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, [isRevealed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    revealTimeoutRef.current = setTimeout(() => {
      setIsRevealed(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    setIsHovered(false);
    setIsRevealed(false);
  };

  const handleTrigger = () => {
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    setIsHovered(true);
    setIsRevealed(true);
  };

  return (
    <div
      className="relative inline-block cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTrigger}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setIsRevealed(!isRevealed);
        }
      }}
      aria-label="Balance. Hover or tap to reveal."
    >
      <span className="font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
        {balance}
      </span>

      {prefersReducedMotion ? (
        <span
          className="absolute inset-0 pointer-events-none transition-all duration-200"
          style={{
            filter: isRevealed
              ? "drop-shadow(0 0 0px rgba(0,0,0,0))"
              : isHovered
              ? "drop-shadow(0 0 12px rgba(178, 122, 255, 0.75))"
              : "drop-shadow(0 0 5px rgba(75, 29, 115, 0.45))"
          }}
        >
          <span className="absolute inset-0 overflow-hidden block">
            <span
              className={`absolute inset-0 bg-redact transition-opacity duration-300 ${
                isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{ clipPath: "polygon(0% 1.5%, 26% 0%, 51% 2.5%, 74% 0.5%, 100% 2%, 99% 98%, 76% 99.5%, 48% 97.5%, 24% 99%, 0% 98.5%)" }}
            />
          </span>
        </span>
      ) : (
        <span
          className="absolute inset-0 pointer-events-none transition-all duration-200"
          style={{
            filter: isRevealed
              ? "none"
              : isHovered
              ? "drop-shadow(0 0 14px rgba(178, 122, 255, 0.85))"
              : "drop-shadow(0 0 6px rgba(75, 29, 115, 0.5))"
          }}
        >
          <span className="absolute inset-0 overflow-hidden block">
            <motion.span
              className="absolute inset-0 bg-redact"
              initial={{ x: "0%" }}
              animate={{ x: isRevealed ? "101%" : "0%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ clipPath: "polygon(0% 1.5%, 26% 0%, 51% 2.5%, 74% 0.5%, 100% 2%, 99% 98%, 76% 99.5%, 48% 97.5%, 24% 99%, 0% 98.5%)" }}
            />
          </span>
        </span>
      )}
    </div>
  );
}

export function BalanceCard({ balance, loading, error, onRetry, onDeposit, onWithdraw, walletConnected, isWrongNetwork }: BalanceCardProps) {
  return (
    <section className="bg-paper text-ink border border-line/30 p-6 sm:p-8">
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
        ) : !walletConnected || balance === null ? (
          <p className="font-sans text-base text-muted">Connect your wallet to view balance.</p>
        ) : balance === "$0.00" ? (
          <p className="font-sans text-base text-muted">No funds yet. Deposit to get started.</p>
        ) : (
          <BalanceValue balance={balance} />
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onDeposit}
          disabled={!walletConnected || isWrongNetwork}
          className="bg-redact text-paper text-sm font-label uppercase tracking-wider px-6 py-3 rounded-[4px] hover:bg-reveal disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
        >
          Deposit
        </button>
        <button
          onClick={onWithdraw}
          disabled={!walletConnected || isWrongNetwork}
          className="border border-redact text-redact text-sm font-label uppercase tracking-wider px-6 py-3 rounded-[4px] hover:bg-redact hover:text-paper disabled:border-line disabled:text-muted disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
        >
          Withdraw
        </button>
      </div>
    </section>
  );
}

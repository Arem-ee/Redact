"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ActivityItem } from "./types";

interface ActivityListProps {
  items: ActivityItem[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  walletConnected: boolean;
  isWrongNetwork: boolean;
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-line/30">
          <div className="space-y-1.5">
            <div className="h-3 w-16 bg-paper-text/10" />
            <div className="h-2.5 w-32 bg-paper-text/10" />
          </div>
          <div className="h-5 w-20 bg-paper-text/10" />
        </div>
      ))}
    </div>
  );
}

interface ActivityRowProps {
  item: ActivityItem;
}

function ActivityRow({ item }: ActivityRowProps) {
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

  const date = new Date(item.timestamp * 1000);
  const formattedDate = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const formattedTime = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center justify-between py-3 border-b border-line/30 last:border-b-0">
      <div className="space-y-0.5">
        <span className={`font-label text-xs uppercase tracking-wider ${
          item.type === "deposit" ? "text-emerald-700" : "text-redact"
        }`}>
          {item.type === "deposit" ? "Deposit" : "Withdraw"}
        </span>
        <p className="font-sans text-xs text-muted">{formattedDate} · {formattedTime}</p>
      </div>

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
        aria-label="Amount. Hover or tap to reveal."
      >
        <span className="font-sans text-sm font-medium text-ink">{item.amount}</span>

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
                className={`absolute inset-0 bg-redact/95 backdrop-blur-md transition-opacity duration-300 ${
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
                className="absolute inset-0 bg-redact/95 backdrop-blur-md"
                initial={{ x: "0%" }}
                animate={{ x: isRevealed ? "101%" : "0%" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ clipPath: "polygon(0% 1.5%, 26% 0%, 51% 2.5%, 74% 0.5%, 100% 2%, 99% 98%, 76% 99.5%, 48% 97.5%, 24% 99%, 0% 98.5%)" }}
              />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export function ActivityList({ items, loading, error, onRetry, walletConnected, isWrongNetwork }: ActivityListProps) {
  return (
    <section className="bg-paper text-ink border border-line/30 p-6 sm:p-8">
      <h2 className="font-label text-xs uppercase tracking-[0.06em] text-muted mb-4">
        Recent activity
      </h2>

      <div className="min-h-[80px]">
        {loading ? (
          <ActivitySkeleton />
        ) : error ? (
          <div className="space-y-3">
            <p className="font-sans text-sm text-redact/80">{error}</p>
            <button
              onClick={onRetry}
              className="text-xs font-label uppercase tracking-wider text-redact underline underline-offset-4 hover:text-reveal transition-colors cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : isWrongNetwork ? (
          <p className="font-sans text-sm text-muted">Switch to Monad Testnet to view activity.</p>
        ) : !walletConnected ? (
          <p className="font-sans text-sm text-muted">Connect your wallet to view activity.</p>
        ) : !items || items.length === 0 ? (
          <p className="font-sans text-sm text-muted">No activity yet. Make your first deposit above.</p>
        ) : (
          <div>
            {items.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

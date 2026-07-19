"use client";

import { DissolveValue } from "./DissolveValue";
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
        <div key={i} className="flex items-center justify-between py-3 border-b border-line/15">
          <div className="space-y-1.5">
            <div className="h-3 w-16 bg-line/30" />
            <div className="h-2.5 w-32 bg-line/30" />
          </div>
          <div className="h-5 w-20 bg-line/30" />
        </div>
      ))}
    </div>
  );
}

interface ActivityRowProps {
  item: ActivityItem;
}

function ActivityRow({ item }: ActivityRowProps) {
  const date = new Date(item.timestamp * 1000);
  const formattedDate = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const formattedTime = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center justify-between py-3 border-b border-line/15 last:border-b-0">
      <div className="space-y-0.5">
        <span className={`font-label text-xs uppercase tracking-wider ${
          item.type === "deposit" ? "text-emerald-700" : "text-redact"
        }`}>
          {item.type === "deposit" ? "Deposit" : "Withdraw"}
        </span>
        <p className="font-sans text-xs text-muted">{formattedDate} &middot; {formattedTime}</p>
      </div>

      <DissolveValue
        value={item.amount}
        className="font-sans text-sm font-medium text-ink"
        dissolveDelay={3500}
      />
    </div>
  );
}

export function ActivityList({ items, loading, error, onRetry, walletConnected, isWrongNetwork }: ActivityListProps) {
  return (
    <section className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] p-6 sm:p-8">
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

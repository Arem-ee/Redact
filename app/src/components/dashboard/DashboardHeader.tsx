"use client";

import { useEffect, useState } from "react";
import { BrandWordmark } from "../BrandWordmark";

interface DashboardHeaderProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function DashboardHeader({ walletAddress, onConnect, isConnecting }: DashboardHeaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <header className="border-b border-line/[0.06] bg-studio/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
        >
          <BrandWordmark className="text-base tracking-[0.15em]" iconSize="w-4 h-4" />
        </button>

        <div className="flex items-center gap-6">
          <a
            href="/docs"
            className="font-label text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
          >
            Docs
          </a>
          {mounted && walletAddress ? (
            <span className="hover-dissolve font-label text-xs text-muted tracking-wider px-3 py-1.5 border border-line/[0.08] cursor-default">
              {truncateAddress(walletAddress)}
            </span>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-redact text-white text-xs font-label uppercase tracking-widest px-4 py-2 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

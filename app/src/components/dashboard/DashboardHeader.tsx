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
  useEffect(() => { setMounted(true); }, []); // eslint-disable-line react-hooks/set-state-in-effect
  return (
    <header className="border-b border-line/10 bg-room/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer focus:outline-2 focus:outline-paper-text focus:outline-offset-2"
        >
          <BrandWordmark className="text-base tracking-[0.15em]" iconSize="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          {mounted && walletAddress ? (
            <span className="font-label text-xs text-paper-text/70 tracking-wider px-3 py-1.5 border border-paper-text/20 rounded-none">
              {truncateAddress(walletAddress)}
            </span>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-redact text-paper text-xs font-label uppercase tracking-widest px-4 py-2 rounded-[4px] hover:bg-reveal disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer focus:outline-2 focus:outline-paper-text focus:outline-offset-2"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

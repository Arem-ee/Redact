"use client";

import { UserRejectedRequestError } from "viem";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface WrongNetworkBannerProps {
  isWrongNetwork: boolean;
  onSwitch: () => void;
  isSwitching: boolean;
  switchError: Error | null;
}

export function WrongNetworkBanner({ isWrongNetwork, onSwitch, isSwitching, switchError }: WrongNetworkBannerProps) {
  if (!isWrongNetwork) return null;

  const rejected = switchError instanceof UserRejectedRequestError;

  return (
    <div className="bg-redact/5 border border-redact/20 p-4 flex items-start gap-3">
      <AlertTriangle size={18} className="text-redact shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-label text-xs uppercase tracking-wider text-redact font-semibold">
          Wrong network
        </p>
        <p className="font-sans text-sm text-muted mt-1">
          {rejected
            ? "Network switch was declined. Redact requires Monad Testnet."
            : "You are connected to an unsupported network. Please switch to Monad Testnet."}
        </p>
      </div>
      <button
        onClick={onSwitch}
        disabled={isSwitching}
        className="shrink-0 bg-redact text-white text-xs font-label uppercase tracking-wider px-4 py-2 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2 focus:outline-2 focus:outline-ink focus:outline-offset-2"
      >
        {isSwitching ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            Switching
          </>
        ) : (
          "Switch Network"
        )}
      </button>
    </div>
  );
}

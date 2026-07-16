"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function InteractiveBlockExplorer() {
  const [isRedactExplorerRevealed, setIsRedactExplorerRevealed] = useState(false);

  return (
    <div id="explorer-visual" className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-12">
      <div id="public-explorer-card" className="bg-paper border border-line p-6 rounded-none flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
            <span className="font-label text-sm uppercase tracking-[0.06em] text-ink font-bold">
              PUBLIC EXPLORER
            </span>
            <span className="font-label text-[10px] uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 font-medium">
              EXPOSED BALANCES
            </span>
          </div>

          <div className="mb-6">
            <p className="font-label text-[10px] uppercase tracking-wider text-muted mb-1">Target Address</p>
            <p className="font-sans text-sm font-medium break-all text-ink">
              0x71C2496EC3c11f711c151a660a9f5d34be7e8971
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-line">
              <span className="font-label text-[10px] uppercase tracking-wider text-muted">Asset</span>
              <span className="font-label text-[10px] uppercase tracking-wider text-muted">Balance</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-sans text-sm text-ink">Monad (MON)</span>
              <span className="font-sans text-sm font-semibold text-ink">15,000.00 MON</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-sans text-sm text-ink">USD Coin (USDC)</span>
              <span className="font-sans text-sm font-semibold text-ink">$906,250.00</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-sans text-sm text-ink">Ethereum (ETH)</span>
              <span className="font-sans text-sm font-semibold text-ink">120.50 ETH</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-line text-[11px] text-muted font-sans leading-relaxed">
          Every balance and history is searchable and visible to any actor on-chain.
        </div>
      </div>

      <div id="redact-explorer-card" className="bg-paper border-2 border-redact p-6 rounded-none flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
            <span className="font-label text-sm uppercase tracking-[0.06em] text-redact font-bold">
              REDACT
            </span>
            <span className="font-label text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-medium">
              REDACTED VAULT
            </span>
          </div>

          <div className="mb-6">
            <p className="font-label text-[10px] uppercase tracking-wider text-muted mb-1">Target Address</p>
            <p className="font-sans text-sm font-medium break-all text-ink">
              0x71C2496EC3c11f711c151a660a9f5d34be7e8971
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-line">
              <span className="font-label text-[10px] uppercase tracking-wider text-muted">Asset</span>
              <span className="font-label text-[10px] uppercase tracking-wider text-muted">Balance</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-sans text-sm text-ink">Monad (MON)</span>
              <div className="relative inline-block h-5 w-28 overflow-hidden bg-redact" style={{ clipPath: "polygon(0.5% 2.5%, 25.5% 0%, 50% 1.5%, 75% 0%, 99.5% 1.5%, 99% 97%, 74.5% 99.5%, 49% 98%, 24.5% 99%, 0.5% 98%)" }}>
                <AnimatePresence>
                  {isRedactExplorerRevealed && (
                    <motion.div
                      className="absolute inset-0 bg-paper px-2 py-0.5 flex items-center justify-end font-sans text-sm font-semibold text-ink"
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 0.25 }}
                    >
                      15,000.00 MON
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-sans text-sm text-ink">USD Coin (USDC)</span>
              <div className="relative inline-block h-5 w-32 overflow-hidden bg-redact" style={{ clipPath: "polygon(0% 1%, 26% 2.5%, 49% 0%, 74% 2%, 100% 0.5%, 98.5% 99%, 74% 97.5%, 52% 99%, 23% 98%, 0% 100%)" }}>
                <AnimatePresence>
                  {isRedactExplorerRevealed && (
                    <motion.div
                      className="absolute inset-0 bg-paper px-2 py-0.5 flex items-center justify-end font-sans text-sm font-semibold text-ink"
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 0.25 }}
                    >
                      $906,250.00
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-sans text-sm text-ink">Ethereum (ETH)</span>
              <div className="relative inline-block h-5 w-24 overflow-hidden bg-redact" style={{ clipPath: "polygon(1.5% 0.5%, 24% 2%, 51.5% 0.5%, 73% 3%, 100% 1.5%, 99% 98.5%, 76% 97%, 48% 99.5%, 26% 98%, 1% 99%)" }}>
                <AnimatePresence>
                  {isRedactExplorerRevealed && (
                    <motion.div
                      className="absolute inset-0 bg-paper px-2 py-0.5 flex items-center justify-end font-sans text-sm font-semibold text-ink"
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 0.25 }}
                    >
                      120.50 ETH
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-line flex items-center justify-between gap-4">
          <span className="text-[11px] text-muted font-sans leading-relaxed">
            Balances are encrypted cryptographically and hidden from public view.
          </span>

          <button
            id="reveal-btn-explorer"
            onMouseEnter={() => setIsRedactExplorerRevealed(true)}
            onMouseLeave={() => setIsRedactExplorerRevealed(false)}
            onTouchStart={() => setIsRedactExplorerRevealed(true)}
            onTouchEnd={() => setIsRedactExplorerRevealed(false)}
            className="flex-shrink-0 text-xs font-label uppercase tracking-[0.06em] text-redact font-bold hover:text-reveal transition-colors duration-150 cursor-pointer"
          >
            {isRedactExplorerRevealed ? "Hide state" : "Reveal state"}
          </button>
        </div>
      </div>
    </div>
  );
}

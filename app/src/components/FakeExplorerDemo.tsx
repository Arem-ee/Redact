"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const MOCK_DATA = {
  address: "0x91D4e9b2AB8c3f1a7E5f",
  balance: "$1,206,250.00",
  tokens: [
    { name: "MON", amount: "125,000.00" },
    { name: "USDC", amount: "906,250.00" },
    { name: "ETH", amount: "45.50" },
  ],
  nfts: [
    { name: "Monad Madness #42", floor: "2.5 MON" },
    { name: "Redact Genesis #7", floor: "0.8 MON" },
  ],
  txs: [
    { hash: "0x1a2b...c3d4", to: "0x8f3E...7b21", amount: "$250,000.00", type: "in" },
    { hash: "0x4e5f...6a7b", to: "0x2c9D...1e4f", amount: "$12.50", type: "out" },
    { hash: "0x8c9d...0e1f", to: "0x7a3B...5c6d", amount: "$906,250.00", type: "in" },
  ],
};

export function FakeExplorerDemo() {
  const [isEnable, setIsEnable] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const duration = prefersReducedMotion ? 0.3 : 0.7;

  return (
    <div className="w-full max-w-[680px] mx-auto">
      <div className="bg-white border border-line/40 shadow-[0_4px_24px_rgba(26,21,32,0.04)] overflow-hidden">
        <div className="border-b border-line/30 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="14" height="14" rx="2" stroke="#A09AA8" strokeWidth="1.2" />
              <path d="M5 8h6M8 5v6" stroke="#A09AA8" strokeWidth="1.2" />
            </svg>
            <span className="font-label text-[10px] uppercase tracking-wider text-muted">Explorer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label text-[9px] uppercase tracking-wider text-muted/50 px-2 py-0.5 border border-line/30">
              MOCK DATA
            </span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <AnimatePresence mode="wait">
            {!isEnable ? (
              <motion.div
                key="visible"
                initial={false}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                transition={{ duration: duration * 0.3 }}
                className="space-y-5"
              >
                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-1">Address</p>
                  <p className="hover-dissolve font-mono text-sm text-ink font-medium tracking-tight cursor-default">
                    {MOCK_DATA.address}
                  </p>
                </div>

                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-1">Total Balance</p>
                  <p className="hover-dissolve font-display text-3xl font-semibold text-ink cursor-default">
                    {MOCK_DATA.balance}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {MOCK_DATA.tokens.map((t) => (
                    <div key={t.name} className="border border-line/30 px-3 py-2">
                      <p className="font-label text-[9px] uppercase tracking-wider text-muted">{t.name}</p>
                          <p className="hover-dissolve font-mono text-sm font-medium text-ink cursor-default">{t.amount}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-2">NFTs</p>
                  <div className="flex gap-3">
                    {MOCK_DATA.nfts.map((n) => (
                      <div key={n.name} className="border border-line/30 px-3 py-2 flex-1">
                        <p className="font-sans text-xs text-ink">{n.name}</p>
                        <p className="font-label text-[10px] text-muted">Floor: {n.floor}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-2">Recent Activity</p>
                  <div className="space-y-1">
                    {MOCK_DATA.txs.map((tx, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-line/20 text-xs">
                        <span className="font-mono text-muted">{tx.hash}</span>
                        <span className="text-muted">→ {tx.to}</span>
                        <span className={tx.type === "in" ? "text-emerald-700 font-medium" : "text-red-700 font-medium"}>
                          {tx.type === "in" ? "+" : ""}{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="redacted"
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration * 0.3 }}
                className="space-y-5"
              >
                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-1">Address</p>
                  <motion.p
                    className="font-mono text-sm text-ink/30 font-medium tracking-tight"
                    initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1 }}
                    animate={{ filter: "blur(4px)", opacity: 0.3 }}
                    transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {MOCK_DATA.address.split("").map((c, i) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        animate={{
                          opacity: [1, 0.2, 1],
                          y: [0, -2, 0],
                        }}
                        transition={{
                          duration: duration * 0.5,
                          delay: (i / MOCK_DATA.address.length) * duration * 0.8,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </motion.p>
                </div>

                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-1">Total Balance</p>
                  <motion.p
                    className="font-display text-3xl font-semibold"
                    initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1, color: "#1A1520" }}
                    animate={{ filter: "blur(8px)", opacity: 0.15, color: "#A09AA8" }}
                    transition={{ duration: duration, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {MOCK_DATA.balance}
                  </motion.p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {MOCK_DATA.tokens.map((t) => (
                    <div key={t.name} className="border border-line/15 px-3 py-2">
                      <p className="font-label text-[9px] uppercase tracking-wider text-muted">{t.name}</p>
                      <motion.p
                        className="font-mono text-sm font-medium"
                        initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1 }}
                        animate={{ filter: "blur(5px)", opacity: 0.15 }}
                        transition={{ duration, delay: 0.2 }}
                      >
                        {t.amount}
                      </motion.p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-2">NFTs</p>
                  <div className="flex gap-3">
                    {MOCK_DATA.nfts.map((n) => (
                      <div key={n.name} className="border border-line/15 px-3 py-2 flex-1">
                        <motion.p
                          className="font-sans text-xs"
                          initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1 }}
                          animate={{ filter: "blur(4px)", opacity: 0.15 }}
                          transition={{ duration, delay: 0.25 }}
                        >
                          {n.name}
                        </motion.p>
                        <motion.p
                          className="font-label text-[10px]"
                          initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1 }}
                          animate={{ filter: "blur(3px)", opacity: 0.1 }}
                          transition={{ duration, delay: 0.3 }}
                        >
                          Floor: {n.floor}
                        </motion.p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-label text-[9px] uppercase tracking-wider text-muted mb-2">Recent Activity</p>
                  <div className="space-y-1">
                    {MOCK_DATA.txs.map((tx, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-line/10 text-xs">
                        <motion.span
                          className="font-mono text-muted/30"
                          initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1 }}
                          animate={{ filter: "blur(3px)", opacity: 0.15 }}
                          transition={{ duration, delay: 0.3 + i * 0.1 }}
                        >
                          {tx.hash}
                        </motion.span>
                        <motion.span
                          className="text-muted/30"
                          initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1 }}
                          animate={{ filter: "blur(3px)", opacity: 0.15 }}
                          transition={{ duration, delay: 0.35 + i * 0.1 }}
                        >
                          → {tx.to}
                        </motion.span>
                        <motion.span
                          className="text-muted/30 font-medium"
                          initial={prefersReducedMotion ? {} : { filter: "blur(0px)", opacity: 1 }}
                          animate={{ filter: "blur(4px)", opacity: 0.1 }}
                          transition={{ duration, delay: 0.4 + i * 0.1 }}
                        >
                          {tx.type === "in" ? "+" : ""}{tx.amount}
                        </motion.span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          id="enable-privacy-btn"
          onClick={() => setIsEnable((p) => !p)}
          className={`text-sm font-label uppercase tracking-wider py-3 px-8 cursor-pointer transition-all duration-300 ${
            isEnable
              ? "bg-studio text-muted border border-line/40 hover:text-ink hover:border-line/80"
              : "bg-redact text-white hover:bg-[#3E1660]"
          }`}
        >
          {isEnable ? "Reset view" : "Enable Privacy"}
        </button>
      </div>
    </div>
  );
}

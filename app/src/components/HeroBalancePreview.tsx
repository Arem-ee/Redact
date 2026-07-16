"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

export function HeroBalancePreview() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRevealed) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsRevealed(false);
        setIsHovered(false);
      }, 2500);
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
      className="paper-elevation-wrapper flex-shrink-0 cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTrigger}
    >
      <div
        className="deckled-paper paper-grain bg-paper border border-line/30 p-4 w-[200px] h-[120px] flex flex-col justify-between relative overflow-hidden"
        style={{
          clipPath: "polygon(0% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 0% 100%, 5% 50%)"
        }}
      >
        <div className="flex justify-between items-center">
          <span className="font-label text-[10px] uppercase tracking-widest text-muted font-bold">
            YOUR BALANCE
          </span>
          <div className="w-1.5 h-1.5 rounded-full transition-colors duration-300" style={{
            backgroundColor: isRevealed ? "var(--color-reveal)" : "var(--color-redact)"
          }} />
        </div>

        <div className="relative mt-2 mb-1">
          <div className="font-mono text-xl font-bold tracking-tight text-ink relative">
            <span className={`transition-opacity duration-300 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
              1,240 USDC
            </span>
            <span className={`absolute left-0 top-0 transition-opacity duration-300 ${isRevealed ? "opacity-0" : "opacity-100"}`}>
              &bull;&bull;&bull;&bull;&bull;&bull;
            </span>
          </div>

          <div
            className="absolute -inset-y-1 -inset-x-2 pointer-events-none transition-all duration-200"
            style={{
              filter: isRevealed
                ? "none"
                : isHovered
                ? "drop-shadow(0 0 12px rgba(178, 122, 255, 0.85))"
                : "drop-shadow(0 0 6px rgba(75, 29, 115, 0.5))"
            }}
          >
            <div className="absolute inset-0 overflow-hidden block">
              <motion.div
                className="absolute inset-0 bg-redact"
                initial={{ x: "0%" }}
                animate={{ x: isRevealed ? "105%" : "0%" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ clipPath: "polygon(0% 2%, 100% 0%, 98% 98%, 2% 100%)" }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] font-label text-muted tracking-wider">
          <span>MONAD LEDGER</span>
          <span className="font-bold">{isRevealed ? "REVEALED" : "REDACTED"}</span>
        </div>
      </div>
    </div>
  );
}

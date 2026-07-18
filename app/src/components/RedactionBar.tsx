"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

interface RedactionBarProps {
  children: string;
}

export function RedactionBar({ children }: RedactionBarProps) {
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
    <span
      id={`redact-bar-${children.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
      className="relative inline-block cursor-pointer align-baseline select-none px-1 mx-0.5"
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
      aria-label="Redacted word. Hover or tap to reveal."
    >
      <span className="font-display font-semibold tracking-tight text-ink">
        {children}
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
    </span>
  );
}

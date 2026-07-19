"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

interface DissolveValueProps {
  value: string;
  className?: string;
  dissolveDelay?: number;
}

function maskValue(value: string): string {
  return value.replace(/[0-9a-zA-Z$,.\s]/g, (c) =>
    /[0-9]/.test(c) ? "•" : c === "$" ? "$" : c === "," ? "," : c === "." ? "." : c === " " ? " " : "•"
  );
}

export function DissolveValue({ value, className = "", dissolveDelay = 3500 }: DissolveValueProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => {
        setIsRevealed(false);
      }, dissolveDelay);
      timerRef.current = timer;
      return () => clearTimeout(timer);
    }
  }, [isRevealed, dissolveDelay]);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleHide = () => {
    setIsRevealed(false);
  };

  if (prefersReducedMotion) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span
      className={`relative inline-block cursor-pointer select-none ${className}`}
      onMouseEnter={handleReveal}
      onMouseLeave={handleHide}
      onClick={() => setIsRevealed((p) => !p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setIsRevealed((p) => !p);
      }}
      aria-label={isRevealed ? value : "Hidden value. Hover to reveal."}
    >
      <motion.span
        className="inline-block"
        animate={{
          filter: isRevealed ? "blur(0px)" : "blur(3px)",
          opacity: isRevealed ? 1 : 0.25,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {isRevealed ? value : maskValue(value)}
      </motion.span>
    </span>
  );
}

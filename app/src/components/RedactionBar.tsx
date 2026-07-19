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
      className="relative inline-block cursor-pointer align-baseline select-none mx-0.5"
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
      <span className="font-display font-semibold tracking-tight text-ink relative z-10">
        {children}
      </span>

      <span className="absolute inset-0 pointer-events-none" style={{ top: -2, bottom: -2, left: -1, right: -1 }}>
        {prefersReducedMotion ? (
          <>
            <span
              className="absolute inset-x-0 top-0 overflow-hidden"
              style={{
                height: "50%",
                transform: isRevealed ? "scaleY(0)" : "scaleY(1)",
                transformOrigin: "top center",
                transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-b from-[#E4E0E8] to-[#D4D0D8]" />
            </span>
            <span
              className="absolute inset-x-0 bottom-0 overflow-hidden"
              style={{
                height: "50%",
                transform: isRevealed ? "scaleY(0)" : "scaleY(1)",
                transformOrigin: "bottom center",
                transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-[#E4E0E8] to-[#D4D0D8]" />
            </span>
            <span
              className="absolute inset-x-0"
              style={{
                top: "calc(50% - 0.5px)",
                height: 1,
                backgroundColor: isHovered ? "#B27AFF" : "#4B1D73",
                opacity: isHovered ? 0.8 : 0.25,
                transition: "opacity 0.2s, background-color 0.2s",
              }}
            />
          </>
        ) : (
          <>
            <motion.span
              className="absolute inset-x-0 top-0 overflow-hidden"
              style={{ height: "50%" }}
              animate={{ scaleY: isRevealed ? 0 : 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              initial={false}
            >
              <span className="absolute inset-0 bg-gradient-to-b from-[#E4E0E8] to-[#D4D0D8]" />
            </motion.span>
            <motion.span
              className="absolute inset-x-0 bottom-0 overflow-hidden"
              style={{ height: "50%" }}
              animate={{ scaleY: isRevealed ? 0 : 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              initial={false}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-[#E4E0E8] to-[#D4D0D8]" />
            </motion.span>
            <motion.span
              className="absolute inset-x-0"
              style={{ top: "calc(50% - 0.5px)", height: 1, originX: "50%" }}
              animate={{
                scaleX: isHovered || isRevealed ? 1.1 : 1,
                backgroundColor: isHovered ? "#B27AFF" : "#4B1D73",
                opacity: isHovered ? 0.8 : 0.25,
              }}
              transition={{ duration: 0.2 }}
            />
            {isHovered && !isRevealed && (
              <motion.span
                className="absolute inset-0"
                style={{
                  boxShadow: "inset 0 0 8px rgba(178, 122, 255, 0.15)",
                  borderRadius: 1,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </>
        )}
      </span>
    </span>
  );
}

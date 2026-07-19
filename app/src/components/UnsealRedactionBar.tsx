"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RedactionBar } from "./RedactionBar";

interface UnsealRedactionBarProps {
  children: string;
  extraPrefix?: string;
  extraSuffix?: string;
  unsealed: boolean;
}

export function UnsealRedactionBar({
  children,
  extraPrefix = "",
  extraSuffix = "",
  unsealed
}: UnsealRedactionBarProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span className="relative inline-flex items-center align-baseline">
      {extraPrefix && (
        <span className="relative inline-block px-0.5 mr-0.5 select-none z-10">
          <span className="opacity-100 transition-opacity duration-300">
            {extraPrefix}
          </span>
          <AnimatePresence>
            {!unsealed && (
              prefersReducedMotion ? (
                <span className="absolute inset-0 bg-[#E4E0E8] transition-opacity duration-500" style={{ top: -1, bottom: -1 }} />
              ) : (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#D4D0D8] to-[#E4E0E8]"
                  style={{ top: -1, bottom: -1 }}
                  initial={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  layout={false}
                />
              )
            )}
          </AnimatePresence>
        </span>
      )}

      <RedactionBar>{children}</RedactionBar>

      {extraSuffix && (
        <span className="relative inline-block px-0.5 ml-0.5 select-none z-10">
          <span className="opacity-100 transition-opacity duration-300">
            {extraSuffix}
          </span>
          <AnimatePresence>
            {!unsealed && (
              prefersReducedMotion ? (
                <span className="absolute inset-0 bg-[#E4E0E8] transition-opacity duration-500" style={{ top: -1, bottom: -1 }} />
              ) : (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-l from-[#D4D0D8] to-[#E4E0E8]"
                  style={{ top: -1, bottom: -1 }}
                  initial={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  layout={false}
                />
              )
            )}
          </AnimatePresence>
        </span>
      )}
    </span>
  );
}

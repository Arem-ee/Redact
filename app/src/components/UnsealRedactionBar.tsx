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
        <span className="relative inline-block px-0.5 mr-0.5 select-none">
          <span className="opacity-100 transition-opacity duration-300">
            {extraPrefix}
          </span>
          <AnimatePresence>
            {!unsealed && (
              prefersReducedMotion ? (
                <span className="absolute inset-0 bg-redact/95 backdrop-blur-md transition-opacity duration-500" />
              ) : (
                <motion.span
                  className="absolute inset-0 bg-redact/95 backdrop-blur-md"
                  initial={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    originX: 1,
                    clipPath: "polygon(0% 2%, 100% 0%, 98% 98%, 2% 100%)"
                  }}
                />
              )
            )}
          </AnimatePresence>
        </span>
      )}

      <RedactionBar>{children}</RedactionBar>

      {extraSuffix && (
        <span className="relative inline-block px-0.5 ml-0.5 select-none">
          <span className="opacity-100 transition-opacity duration-300">
            {extraSuffix}
          </span>
          <AnimatePresence>
            {!unsealed && (
              prefersReducedMotion ? (
                <span className="absolute inset-0 bg-redact/95 backdrop-blur-md transition-opacity duration-500" />
              ) : (
                <motion.span
                  className="absolute inset-0 bg-redact/95 backdrop-blur-md"
                  initial={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    originX: 0,
                    clipPath: "polygon(0% 0%, 100% 2%, 98% 97%, 1% 100%)"
                  }}
                />
              )
            )}
          </AnimatePresence>
        </span>
      )}
    </span>
  );
}

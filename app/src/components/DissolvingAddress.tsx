"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const FULL_ADDR = "0x91D4e9b2AB8c3f1a7E5f6D0a9B3c7E8f1A2b3C4d";
const DISPLAY_LEN = 16;
const DOTS = "•".repeat(DISPLAY_LEN);

function pickChars(len: number): string {
  const hex = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < len; i++) s += hex[Math.floor(Math.random() * 16)];
  return "0x" + s + "...";
}

function shuffleString(s: string, intensity: number): string {
  const arr = s.split("");
  const swaps = Math.floor(intensity * arr.length);
  for (let i = 0; i < swaps; i++) {
    const a = Math.floor(Math.random() * arr.length);
    const b = Math.floor(Math.random() * arr.length);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  return arr.join("");
}

export function DissolvingAddress() {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(FULL_ADDR.slice(0, DISPLAY_LEN));
  const [blur, setBlur] = useState(0);
  const phaseRef = useRef(0);
  const frameRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    startRef.current = Date.now();
    const TICK = 40;

    const tick = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const cycle = elapsed % 8;

      if (cycle < 3) {
        phaseRef.current = 0;
        setDisplay(FULL_ADDR.slice(0, DISPLAY_LEN));
        setBlur(0);
      } else if (cycle < 4) {
        phaseRef.current = 1;
        const p = (cycle - 3);
        const b = p * 4;
        setBlur(b);
        setDisplay(shuffleString(FULL_ADDR.slice(0, DISPLAY_LEN), p * 0.7));
      } else if (cycle < 6) {
        phaseRef.current = 2;
        setBlur(6);
        setDisplay(DOTS);
      } else if (cycle < 7) {
        phaseRef.current = 3;
        const p = (cycle - 6);
        const b = 6 - p * 6;
        setBlur(b);
        setDisplay(shuffleString(FULL_ADDR.slice(0, DISPLAY_LEN), (1 - p) * 0.7));
      } else {
        phaseRef.current = 4;
        setDisplay(FULL_ADDR.slice(0, DISPLAY_LEN));
        setBlur(0);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span className="font-mono font-semibold text-ink select-none">
        {FULL_ADDR.slice(0, DISPLAY_LEN)}
      </span>
    );
  }

  return (
    <span
      className="font-mono font-semibold text-ink select-none inline-block transition-[filter] duration-[40ms]"
      style={{ filter: `blur(${blur}px)` }}
      aria-label="Redacted wallet address"
    >
      {display}
    </span>
  );
}

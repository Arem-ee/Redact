"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface ApertureIrisProps {
  size?: number;
  isOpen: boolean;
  children?: React.ReactNode;
  className?: string;
}

const BLADES = 8;
const VIEW = 220;
const HALF = VIEW / 2;
const PIVOT_R = 70;
const BLADE_LEN = 65;
const OUTER_R = PIVOT_R + 10;

const BLADE_POLYGON = [
  [0, -10],
  [0, 10],
  [-BLADE_LEN * 0.55, 14],
  [-BLADE_LEN * 0.85, 7],
  [-BLADE_LEN, 0],
  [-BLADE_LEN * 0.85, -7],
  [-BLADE_LEN * 0.55, -14],
].map((p) => p.join(",")).join(" ");

export function ApertureIris({ size = 320, isOpen, children, className = "" }: ApertureIrisProps) {
  const prefersReducedMotion = useReducedMotion();
  const [breathOffset, setBreathOffset] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    startRef.current = Date.now();
    const tick = () => {
      const t = (Date.now() - startRef.current) / 1000;
      setBreathOffset(Math.sin(t * 0.35) * 0.2);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  const openAngle = isOpen ? 24 : 0;
  const animAngle = prefersReducedMotion ? openAngle : openAngle + (isOpen ? breathOffset * 0.15 : breathOffset);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full transition-all duration-700 pointer-events-none"
        style={{
          width: "90%",
          height: "90%",
          left: "5%",
          top: "5%",
          background: isOpen
            ? "radial-gradient(circle, rgba(178,122,255,0.18) 0%, rgba(178,122,255,0.04) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(178,122,255,0.07) 0%, transparent 55%)",
        }}
      />

      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="relative z-10"
        style={{
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 18px 35px rgba(26,21,32,0.10)) drop-shadow(0 4px 12px rgba(26,21,32,0.06))",
        }}
      >
        <circle cx={HALF} cy={HALF} r={OUTER_R + 4} fill="#E4E0E8" stroke="#D0CCD8" strokeWidth={1} />
        <circle cx={HALF} cy={HALF} r={OUTER_R} fill="#EEEAEE" />

        {Array.from({ length: BLADES }).map((_, i) => {
          const bladeAngle = (i / BLADES) * 360;

          return (
            <g key={i} transform={`translate(${HALF}, ${HALF}) rotate(${bladeAngle}) translate(${PIVOT_R}, 0)`}>
              <motion.g
                initial={false}
                animate={{ rotate: animAngle }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 20,
                  mass: 0.8,
                }}
                style={{ originX: 0, originY: 0 }}
              >
                <polygon
                  points={BLADE_POLYGON}
                  fill="url(#bladeFill)"
                  stroke="url(#bladeStroke)"
                  strokeWidth={0.7}
                />
              </motion.g>
            </g>
          );
        })}

        <circle cx={HALF} cy={HALF} r={PIVOT_R + 4} fill="none" stroke="#D4D0D8" strokeWidth={0.8} />

        {Array.from({ length: BLADES }).map((_, i) => {
          const angle = ((i / BLADES) * 360) * (Math.PI / 180);
          return (
            <circle
              key={`pin-${i}`}
              cx={HALF + PIVOT_R * Math.cos(angle)}
              cy={HALF + PIVOT_R * Math.sin(angle)}
              r={2.2}
              fill="#C4C0C8"
              stroke="#B0ACB8"
              strokeWidth={0.4}
            />
          );
        })}

        {!isOpen && (
          <circle cx={HALF} cy={HALF} r={4} fill="#D0CCD8" stroke="#B27AFF" strokeWidth={0.4} opacity={0.4} />
        )}

        <defs>
          <linearGradient id="bladeFill" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#EAE6EE" />
            <stop offset="60%" stopColor="#DCD8E2" />
            <stop offset="100%" stopColor="#C8C4D0" />
          </linearGradient>
          <linearGradient id="bladeStroke" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#C4C0CC" />
            <stop offset="100%" stopColor="#B27AFF" stopOpacity={0.55} />
          </linearGradient>
        </defs>
      </svg>

      {children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {children}
        </div>
      )}
    </div>
  );
}

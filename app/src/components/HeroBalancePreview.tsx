"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const SCREEN_WIDTH = 280;
const SCREEN_HEIGHT = 608;
const BEZEL_RADIUS = 50;
const BEZEL_COLOR = "#1C1C1E";
const DYNAMIC_ISLAND_WIDTH = 108;
const DYNAMIC_ISLAND_HEIGHT = 32;

function SideButtons() {
  return (
    <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ right: -4 }}>
      <div className="absolute w-[3px] h-[52px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 140 }} />
      <div className="absolute w-[3px] h-[36px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 200 }} />
      <div className="absolute w-[3px] h-[36px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 244 }} />
    </div>
  );
}

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
      className="flex-shrink-0 cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTrigger}
      style={{ position: "relative" }}
    >
      <div
        className="relative"
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          borderRadius: BEZEL_RADIUS,
          backgroundColor: BEZEL_COLOR,
          padding: 8,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.06),
            0 20px 60px rgba(0,0,0,0.6),
            0 8px 20px rgba(0,0,0,0.4)
          `,
        }}
      >
        <SideButtons />

        <div
          className="overflow-hidden relative"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: BEZEL_RADIUS - 8,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background: "var(--color-room)",
              padding: "56px 16px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                marginLeft: -DYNAMIC_ISLAND_WIDTH / 2,
                width: DYNAMIC_ISLAND_WIDTH,
                height: DYNAMIC_ISLAND_HEIGHT,
                borderRadius: DYNAMIC_ISLAND_HEIGHT / 2,
                backgroundColor: "#050505",
                zIndex: 20,
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                className="font-label"
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-muted)",
                  fontWeight: 500,
                }}
              >
                Redact
              </span>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isRevealed ? "var(--color-reveal)" : "var(--color-redact)",
                  transition: "background-color 0.3s",
                }}
              />
            </div>

            <div>
              <span
                className="font-label"
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-muted)",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Your Balance
              </span>
              <div style={{ position: "relative", minHeight: 32 }}>
                <span
                  className="font-display"
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "var(--color-paper-text)",
                    letterSpacing: "-0.02em",
                    transition: "opacity 0.3s",
                    opacity: isRevealed ? 1 : 0,
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}
                >
                  1,240 USDC
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "var(--color-paper-text)",
                    letterSpacing: "-0.02em",
                    transition: "opacity 0.3s",
                    opacity: isRevealed ? 0 : 1,
                  }}
                >
                  &bull;&bull;&bull;&bull;&bull;&bull;
                </span>

                <div
                  style={{
                    position: "absolute",
                    inset: -4,
                    pointerEvents: "none",
                    filter: isRevealed
                      ? "none"
                      : isHovered
                      ? "drop-shadow(0 0 12px rgba(178, 122, 255, 0.85))"
                      : "drop-shadow(0 0 6px rgba(75, 29, 115, 0.5))",
                    transition: "filter 0.2s",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                    <motion.div
                      className="bg-redact/95 backdrop-blur-md"
                      style={{
                        position: "absolute",
                        inset: 0,
                        clipPath: "polygon(0% 2%, 100% 0%, 98% 98%, 2% 100%)",
                      }}
                      initial={{ x: "0%" }}
                      animate={{ x: isRevealed ? "105%" : "0%" }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                borderRadius: 6,
                border: "1px solid rgba(234,230,221,0.08)",
                padding: 12,
                background: "rgba(234,230,221,0.03)",
              }}
            >
              <div
                className="font-label"
                style={{
                  fontSize: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--color-muted)",
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Recent Activity
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Deposit", amount: "+500 USDC", time: "2m ago" },
                  { label: "Deposit", amount: "+250 USDC", time: "1h ago" },
                  { label: "Withdraw", amount: "-100 USDC", time: "3h ago" },
                ].map((item) => (
                  <div
                    key={item.amount + item.time}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: 6,
                      borderBottom: "1px solid rgba(234,230,221,0.06)",
                    }}
                  >
                    <span
                      className="font-label"
                      style={{
                        fontSize: 9,
                        color: "var(--color-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        className="font-label"
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: item.amount.startsWith("+") ? "#4ADE80" : "#F87171",
                        }}
                      >
                        {item.amount}
                      </span>
                      <span style={{ fontSize: 8, color: "var(--color-muted)", opacity: 0.6 }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(234,230,221,0.08)",
                paddingTop: 10,
              }}
            >
              <span
                className="font-label"
                style={{
                  fontSize: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--color-muted)",
                  fontWeight: 500,
                }}
              >
                Private Vault
              </span>
              <span
                className="font-label"
                style={{
                  fontSize: 8,
                  fontWeight: 600,
                  color: isRevealed ? "var(--color-reveal)" : "var(--color-redact)",
                }}
              >
                {isRevealed ? "REVEALED" : "REDACTED"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Shield, RefreshCw } from "lucide-react";

const SCREEN_W = 260;
const SCREEN_H = 564;
const BEZEL_R = 28;
const BEZEL_C = "#1C1C1E";
const DI_W = 100;
const DI_H = 28;

function SideButtons() {
  return (
    <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ right: -3 }}>
      <div className="absolute w-[2.5px] h-[40px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 130 }} />
      <div className="absolute w-[2.5px] h-[28px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 178 }} />
      <div className="absolute w-[2.5px] h-[28px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 214 }} />
    </div>
  );
}

function OrbitingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute w-1.5 h-1.5 rounded-full bg-redact/15" style={{
        top: "50%", left: "50%",
        animation: "orbit 12s linear infinite",
        marginTop: -3, marginLeft: -3,
      }} />
      <div className="absolute w-1 h-1 rounded-full bg-purple-bright/10" style={{
        top: "50%", left: "50%",
        animation: "orbit-reverse 16s linear infinite",
        marginTop: -2, marginLeft: -2,
      }} />
    </div>
  );
}

export function InteractiveDuressDemo() {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockType, setUnlockType] = useState<"standard" | "duress" | null>(null);
  const [showError, setShowError] = useState(false);
  const [tiltOffset, setTiltOffset] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      const t = (Date.now() - startRef.current) / 1000;
      setTiltOffset(Math.sin(t * 0.3) * 1.2);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleKeyPress = (num: string) => {
    if (isUnlocked) return;
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin === "5820") {
        setTimeout(() => { setUnlockType("standard"); setIsUnlocked(true); }, 300);
      } else if (nextPin === "1397") {
        setTimeout(() => { setUnlockType("duress"); setIsUnlocked(true); }, 300);
      } else if (nextPin.length === 4) {
        setTimeout(() => { setShowError(true); setTimeout(() => { setPin(""); setShowError(false); }, 1000); }, 300);
      }
    }
  };

  const handleBackspace = () => { if (!isUnlocked) setPin(pin.slice(0, -1)); };

  const handleReset = () => { setPin(""); setIsUnlocked(false); setUnlockType(null); };

  return (
    <div id="duress-simulator-widget" className="flex flex-col lg:flex-row gap-8 items-center w-full">
      <div className="flex-1 space-y-6 max-w-md">
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          Set a duress PIN. If you&apos;re ever forced to open the app, entering it shows a low harmless balance instead of your real one. There&apos;s no visible difference.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-3 border-b border-line/15">
            <div>
              <h4 className="font-display font-bold text-sm text-ink mb-0.5">
                Standard Vault PIN
              </h4>
              <span className="text-xs text-muted">Unlocks your actual redacted holdings</span>
            </div>
            <button
              id="pin-std-preset"
              onClick={() => { handleReset(); setPin("5820"); setUnlockType("standard"); setIsUnlocked(true); }}
              className="bg-redact text-white text-xs font-label uppercase tracking-wider px-4 py-2 hover:bg-[#3E1660] focus:outline-2 focus:outline-ink focus:outline-offset-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 flex-shrink-0 ml-4"
            >
              Enter 5820
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-line/15">
            <div>
              <h4 className="font-display font-bold text-sm text-ink mb-0.5">
                Duress Decoy PIN
              </h4>
              <span className="text-xs text-muted">Displays an authentic low-balance safety decoy</span>
            </div>
            <button
              id="pin-dur-preset"
              onClick={() => { handleReset(); setPin("1397"); setUnlockType("duress"); setIsUnlocked(true); }}
              className="bg-redact text-white text-xs font-label uppercase tracking-wider px-4 py-2 hover:bg-[#3E1660] focus:outline-2 focus:outline-ink focus:outline-offset-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 flex-shrink-0 ml-4"
            >
              Enter 1397
            </button>
          </div>
        </div>

        {isUnlocked && (
          <button
            id="reset-duress-sim"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-label uppercase tracking-[0.04em] text-muted hover:text-ink underline decoration-0 hover:decoration-1 underline-offset-4 cursor-pointer transition-colors"
          >
            <RefreshCw size={12} /> Reset
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center relative">
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-[100px] rounded-full bg-redact/5 blur-[50px] pointer-events-none"
        />

        <OrbitingParticles />

        <div
          className="relative cursor-pointer select-none"
          style={{
            transform: `rotate(${tiltOffset}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div
            className="relative"
            style={{
              width: SCREEN_W,
              height: SCREEN_H,
              borderRadius: BEZEL_R,
              backgroundColor: BEZEL_C,
              padding: 5,
              boxShadow: "0 0 0 0.5px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            <SideButtons />

            <div
              className="overflow-hidden relative"
              style={{ width: "100%", height: "100%", borderRadius: BEZEL_R - 5 }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: "#FFFFFF",
                  padding: "50px 14px 14px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    marginLeft: -DI_W / 2,
                    width: DI_W,
                    height: DI_H,
                    borderRadius: DI_H / 2,
                    backgroundColor: "#050505",
                    zIndex: 20,
                  }}
                />

                <AnimatePresence mode="wait">
                  {!isUnlocked ? (
                    <motion.div
                      key="lockscreen"
                      className="flex flex-col justify-between"
                      style={{ flex: 1 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="text-center mt-4">
                        <div className="inline-flex p-2.5 bg-redact/5 text-redact rounded-none mb-2">
                          <Shield size={18} />
                        </div>
                        <h3 className="font-display font-semibold text-sm text-ink">Enter Security PIN</h3>
                        <p className="text-[11px] text-muted mt-0.5">Unlock your private vault</p>
                      </div>

                      <div className="flex justify-center gap-2.5 my-5">
                        {[0, 1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 border transition-colors duration-150 ${
                              showError
                                ? "bg-red-500 border-red-500"
                                : pin.length > idx
                                ? "bg-redact border-redact"
                                : "border-line bg-transparent"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 mt-auto">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleKeyPress(num)}
                            className="h-9 border border-line/60 bg-white text-ink font-label font-medium text-sm hover:bg-[#F0ECF4] transition-all duration-150 hover:scale-[1.03] active:scale-95 flex items-center justify-center cursor-pointer"
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={handleBackspace}
                          className="h-9 border border-line/60 bg-white text-ink text-[10px] hover:bg-[#F0ECF4] transition-all duration-150 hover:scale-[1.03] active:scale-95 flex items-center justify-center cursor-pointer col-span-1 font-label font-medium"
                        >
                          DEL
                        </button>
                        <button
                          onClick={() => handleKeyPress("0")}
                          className="h-9 border border-line/60 bg-white text-ink font-label font-medium text-sm hover:bg-[#F0ECF4] transition-all duration-150 hover:scale-[1.03] active:scale-95 flex items-center justify-center cursor-pointer"
                        >
                          0
                        </button>
                        <button
                          onClick={handleReset}
                          className="h-9 border border-line/60 bg-white text-ink text-[10px] hover:bg-[#F0ECF4] transition-all duration-150 hover:scale-[1.03] active:scale-95 flex items-center justify-center cursor-pointer col-span-1 font-label font-medium"
                        >
                          CLR
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="dashboardscreen"
                      className="flex flex-col"
                      style={{ flex: 1 }}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-label text-[9px] font-medium text-muted uppercase tracking-wider">
                          Redact
                        </span>
                        <span
                          className={`font-label text-[8px] font-medium uppercase px-1 py-0.5 ${
                            unlockType === "standard"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {unlockType === "standard" ? "Vault" : "Decoy"}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="font-label text-[8px] uppercase tracking-wider text-muted font-medium mb-0.5">
                          Your Balance
                        </p>
                        <h2 className="font-display font-bold text-xl text-ink">
                          {unlockType === "standard" ? "$1,206,250.00" : "$142.50"}
                        </h2>
                      </div>

                      <div className="flex-1 border border-line/40 p-2.5 bg-white">
                        <p className="font-label text-[7px] uppercase tracking-wider text-muted font-medium mb-2 border-b border-line/40 pb-1">
                          Recent Activity
                        </p>
                        <div className="space-y-1.5">
                          {unlockType === "standard" ? (
                            <>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-ink">Deposited from Monad</span>
                                <span className="font-medium text-emerald-700 font-label">+$250,000.00</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-ink">Deposited from Monad</span>
                                <span className="font-medium text-emerald-700 font-label">+$956,250.00</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-ink">Coffee Shop</span>
                                <span className="font-medium text-red-700 font-label">-$12.50</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-ink">Supermarket</span>
                                <span className="font-medium text-red-700 font-label">-$35.00</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-line/40 pt-2.5">
                        <span className="font-label text-[7px] uppercase tracking-wider text-muted font-medium">
                          Private Vault
                        </span>
                        <span className="font-label text-[7px] font-medium uppercase tracking-wider text-redact">
                          {unlockType === "standard" ? "UNLOCKED" : "DECOY"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

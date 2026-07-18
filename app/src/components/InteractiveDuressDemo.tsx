"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Shield, RefreshCw } from "lucide-react";

const SCREEN_W = 280;
const SCREEN_H = 608;
const BEZEL_R = 50;
const BEZEL_C = "#1C1C1E";
const DI_W = 108;
const DI_H = 32;

function SideButtons() {
  return (
    <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ right: -4 }}>
      <div className="absolute w-[3px] h-[52px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 140 }} />
      <div className="absolute w-[3px] h-[36px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 200 }} />
      <div className="absolute w-[3px] h-[36px] bg-[#3A3A3C] rounded-[1px]" style={{ top: 244 }} />
    </div>
  );
}

export function InteractiveDuressDemo() {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockType, setUnlockType] = useState<"standard" | "duress" | null>(null);
  const [showError, setShowError] = useState(false);

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
    <div id="duress-simulator-widget" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12 w-full">
      <div className="lg:col-span-5 space-y-6">
        <p className="text-base text-muted leading-relaxed">
          Set a duress PIN. If you&apos;re ever forced to open the app, entering it shows a low harmless balance instead of your real one. There&apos;s no visible difference.
        </p>

        <div className="space-y-4 pt-2">
          <div className="bg-paper border border-line p-4 rounded-none">
            <h4 className="font-display font-bold text-sm text-ink mb-1">
              Standard Vault PIN
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Unlocks your actual redacted holdings</span>
              <button
                id="pin-std-preset"
                onClick={() => { handleReset(); setPin("5820"); setUnlockType("standard"); setIsUnlocked(true); }}
                className="bg-redact text-paper text-xs font-label uppercase tracking-wider rounded-[4px] px-3 py-1.5 hover:bg-reveal focus:outline-2 focus:outline-ink focus:outline-offset-2 cursor-pointer"
              >
                Enter 5820
              </button>
            </div>
          </div>

          <div className="bg-paper border border-line p-4 rounded-none">
            <h4 className="font-display font-bold text-sm text-ink mb-1">
              Duress Decoy PIN
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Displays an authentic low-balance safety decoy</span>
              <button
                id="pin-dur-preset"
                onClick={() => { handleReset(); setPin("1397"); setUnlockType("duress"); setIsUnlocked(true); }}
                className="bg-redact text-paper text-xs font-label uppercase tracking-wider rounded-[4px] px-3 py-1.5 hover:bg-reveal focus:outline-2 focus:outline-ink focus:outline-offset-2 cursor-pointer"
              >
                Enter 1397
              </button>
            </div>
          </div>
        </div>

        {isUnlocked && (
          <button
            id="reset-duress-sim"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-label uppercase tracking-[0.04em] text-ink underline decoration-0 hover:decoration-1 underline-offset-4 cursor-pointer"
          >
            <RefreshCw size={12} /> Reset
          </button>
        )}
      </div>

      <div className="lg:col-span-7 flex justify-center">
        <div
          className="relative cursor-pointer select-none"
          style={{ position: "relative" }}
        >
          <div
            className="relative"
            style={{
              width: SCREEN_W,
              height: SCREEN_H,
              borderRadius: BEZEL_R,
              backgroundColor: BEZEL_C,
              padding: 8,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <SideButtons />

            <div
              className="overflow-hidden relative"
              style={{ width: "100%", height: "100%", borderRadius: BEZEL_R - 8 }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: "var(--color-paper)",
                  padding: "56px 16px 16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
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
                      <div className="text-center mt-6">
                        <div className="inline-flex p-3 bg-redact/10 text-redact rounded-none mb-3">
                          <Shield size={20} />
                        </div>
                        <h3 className="font-display font-semibold text-base text-ink">Enter Security PIN</h3>
                        <p className="text-xs text-muted mt-1">Unlock your private vault</p>
                      </div>

                      <div className="flex justify-center gap-3 my-6">
                        {[0, 1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className={`w-3.5 h-3.5 border rounded-none transition-colors duration-150 ${
                              showError
                                ? "bg-red-700 border-red-700"
                                : pin.length > idx
                                ? "bg-redact border-redact"
                                : "border-muted bg-transparent"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-auto">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleKeyPress(num)}
                            className="h-10 border border-line bg-paper text-ink font-label font-medium hover:bg-ink hover:text-paper rounded-[4px] transition-colors duration-100 flex items-center justify-center cursor-pointer"
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={handleBackspace}
                          className="h-10 border border-line bg-paper text-ink text-xs hover:bg-ink hover:text-paper rounded-[4px] transition-colors duration-100 flex items-center justify-center cursor-pointer col-span-1 font-label font-medium"
                        >
                          DEL
                        </button>
                        <button
                          onClick={() => handleKeyPress("0")}
                          className="h-10 border border-line bg-paper text-ink font-label font-medium hover:bg-ink hover:text-paper rounded-[4px] transition-colors duration-100 flex items-center justify-center cursor-pointer"
                        >
                          0
                        </button>
                        <button
                          onClick={handleReset}
                          className="h-10 border border-line bg-paper text-ink text-xs hover:bg-ink hover:text-paper rounded-[4px] transition-colors duration-100 flex items-center justify-center cursor-pointer col-span-1 font-label font-medium"
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
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-label text-[10px] font-medium text-muted uppercase tracking-wider">
                          Redact
                        </span>
                        <span
                          className={`font-label text-[9px] font-medium uppercase px-1.5 py-0.5 rounded-none ${
                            unlockType === "standard"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {unlockType === "standard" ? "Vault" : "Decoy"}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="font-label text-[9px] uppercase tracking-wider text-muted font-medium mb-0.5">
                          Your Balance
                        </p>
                        <h2 className="font-display font-bold text-2xl text-ink">
                          {unlockType === "standard" ? "$1,206,250.00" : "$142.50"}
                        </h2>
                      </div>

                      <div
                        className="flex-1 rounded-none border border-line/50 p-3"
                        style={{ background: "var(--color-paper)" }}
                      >
                        <p className="font-label text-[8px] uppercase tracking-wider text-muted font-medium mb-3 border-b border-line pb-1.5">
                          Recent Activity
                        </p>
                        <div className="space-y-2">
                          {unlockType === "standard" ? (
                            <>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-ink">Deposited from Monad</span>
                                <span className="font-medium text-emerald-700 font-label">+$250,000.00</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-ink">Deposited from Monad</span>
                                <span className="font-medium text-emerald-700 font-label">+$956,250.00</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-ink">Coffee Shop</span>
                                <span className="font-medium text-red-700 font-label">-$12.50</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-ink">Supermarket</span>
                                <span className="font-medium text-red-700 font-label">-$35.00</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-line/50 pt-3">
                        <span className="font-label text-[8px] uppercase tracking-wider text-muted font-medium">
                          Private Vault
                        </span>
                        <span className="font-label text-[8px] font-medium uppercase tracking-wider" style={{ color: unlockType === "standard" ? "var(--color-reveal)" : "var(--color-redact)" }}>
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

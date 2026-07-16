"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, RefreshCw, User } from "lucide-react";

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
        setTimeout(() => {
          setUnlockType("standard");
          setIsUnlocked(true);
        }, 300);
      } else if (nextPin === "1397") {
        setTimeout(() => {
          setUnlockType("duress");
          setIsUnlocked(true);
        }, 300);
      } else if (nextPin.length === 4) {
        setTimeout(() => {
          setShowError(true);
          setTimeout(() => {
            setPin("");
            setShowError(false);
          }, 1000);
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    if (isUnlocked) return;
    setPin(pin.slice(0, -1));
  };

  const handleReset = () => {
    setPin("");
    setIsUnlocked(false);
    setUnlockType(null);
  };

  return (
    <div id="duress-simulator-widget" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12 w-full">
      <div className="lg:col-span-5 space-y-6">
        <p className="font-sans text-base text-muted leading-relaxed">
          The Redact wallet protects you against physical threats and coerced device unlocks. By configuring two independent codes, you retain perfect safety under pressure.
        </p>

        <div className="space-y-4 pt-2">
          <div className="bg-paper border border-line p-4 rounded-none">
            <h4 className="font-display font-bold text-sm text-ink mb-1">
              Standard Vault PIN
            </h4>
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-muted">Unlocks your actual redacted holdings</span>
              <button
                id="pin-std-preset"
                onClick={() => {
                  handleReset();
                  setPin("5820");
                  setUnlockType("standard");
                  setIsUnlocked(true);
                }}
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
              <span className="font-sans text-xs text-muted">Displays an authentic low-balance safety decoy</span>
              <button
                id="pin-dur-preset"
                onClick={() => {
                  handleReset();
                  setPin("1397");
                  setUnlockType("duress");
                  setIsUnlocked(true);
                }}
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
            <RefreshCw size={12} /> Reset Numpad Simulator
          </button>
        )}
      </div>

      <div className="lg:col-span-7 flex justify-center">
        <div className="w-full max-w-[340px] bg-paper border-[4px] border-ink rounded-none shadow-sm flex flex-col overflow-hidden aspect-[9/18]">
          <div className="bg-ink text-paper px-4 py-2 flex justify-between items-center">
            <span className="font-label text-[10px] tracking-widest text-paper/80">REDACT OS</span>
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-label text-[9px] text-paper/60 uppercase">SECURE_NODE</span>
            </div>
          </div>

          <div className="flex-grow p-6 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                <motion.div
                  key="lockscreen"
                  className="flex-grow flex flex-col justify-between h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-center mt-4">
                    <div className="inline-flex p-3 bg-redact/10 text-redact mb-3">
                      <Lock size={20} />
                    </div>
                    <h3 className="font-display font-semibold text-base text-ink">Enter Security PIN</h3>
                    <p className="font-sans text-xs text-muted mt-1">Unlock encrypted monad balance</p>
                  </div>

                  <div className="flex justify-center gap-3 my-4">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-3.5 h-3.5 border border-ink rounded-none transition-colors duration-150 ${
                          showError
                            ? "bg-red-700 border-red-700"
                            : pin.length > idx
                            ? "bg-redact border-redact"
                            : "bg-transparent"
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
                      className="h-10 border border-line bg-paper text-ink font-sans text-xs hover:bg-ink hover:text-paper rounded-[4px] transition-colors duration-100 flex items-center justify-center cursor-pointer col-span-1"
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
                      className="h-10 border border-line bg-paper text-ink font-sans text-xs hover:bg-ink hover:text-paper rounded-[4px] transition-colors duration-100 flex items-center justify-center cursor-pointer col-span-1"
                    >
                      CLR
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="walletscreen"
                  className="flex-grow flex flex-col justify-between h-full"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-muted" />
                        <span className="font-label text-[10px] tracking-wider text-muted">0x71C...8971</span>
                      </div>
                      <span className="font-label text-[9px] uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-none font-medium">
                        {unlockType === "standard" ? "Vault Mode" : "Decoy Active"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-label text-[10px] text-muted tracking-wider uppercase">Available Stablecoins</p>
                      <h2 className="font-display font-bold text-2xl text-ink">
                        {unlockType === "standard" ? "$1,206,250.00" : "$142.50"}
                      </h2>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="font-label text-[9px] text-muted tracking-wider uppercase border-b border-line pb-1">
                        Recent Transactions
                      </p>

                      {unlockType === "standard" ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-sans text-ink">Deposited from Monad L1</span>
                            <span className="font-sans font-medium text-emerald-700">+$250,000.00</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-sans text-ink">Deposited from Monad L1</span>
                            <span className="font-sans font-medium text-emerald-700">+$956,250.00</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-sans text-ink">Coffee Shop Purchase</span>
                            <span className="font-sans font-medium text-red-700">-$12.50</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-sans text-ink">Supermarket Payment</span>
                            <span className="font-sans font-medium text-red-700">-$35.00</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto space-y-2 pt-4 border-t border-line">
                    <button
                      onClick={handleReset}
                      className="w-full bg-redact text-paper text-xs font-label uppercase tracking-wider py-2.5 rounded-[4px] hover:bg-reveal transition-colors duration-150 text-center cursor-pointer"
                    >
                      Lock Vault
                    </button>
                    <p className="font-sans text-[9px] text-muted text-center leading-relaxed">
                      {unlockType === "standard"
                        ? "Unlocked using secure Vault PIN. Full transaction logs and total assets decrypted."
                        : "Decoy mode loaded. There is no cryptographic indication that a duress code was used."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

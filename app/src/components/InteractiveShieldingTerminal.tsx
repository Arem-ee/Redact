"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Shield, RefreshCw, AlertTriangle, Check } from "lucide-react";

export function InteractiveShieldingTerminal() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [shieldAmount, setShieldAmount] = useState(90);
  const [stdPin, setStdPin] = useState("");
  const [durPin, setDurPin] = useState("");
  const [isShielding, setIsShielding] = useState(false);
  const [shieldProgress, setShieldProgress] = useState(0);

  const simulateDemoAddress = () => {
    setAddress("0x71C2496EC3c11f711c151a660a9f5d34be7e8971");
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep(2);
    }, 1500);
  };

  const handleShield = () => {
    setStep(3);
  };

  const executeShielding = (e: React.FormEvent) => {
    e.preventDefault();
    if (stdPin.length < 4 || durPin.length < 4) return;
    setIsShielding(true);

    const interval = setInterval(() => {
      setShieldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsShielding(false);
            setStep(4);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const resetWizard = () => {
    setStep(1);
    setAddress("");
    setShieldProgress(0);
    setStdPin("");
    setDurPin("");
  };

  return (
    <div className="max-w-2xl mx-auto w-full paper-elevation-wrapper">
      <div id="shielding-terminal" className="deckled-paper paper-grain bg-paper border border-line/30 p-6 lg:p-12 rounded-none w-full text-ink relative overflow-hidden">
      <div className="flex justify-between items-center border-b border-line pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-redact" />
          <span className="font-label text-xs uppercase tracking-[0.04em] text-ink">
            Shielding Protocol Simulator
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-5 h-1 transition-colors duration-200 ${
                step >= s ? "bg-redact" : "bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display font-semibold text-lg text-ink mb-1">
                Scan Public Wallet Vulnerability
              </h3>
              <p className="font-sans text-sm text-muted">
                Analyze stablecoin exposure and check what is visible to public address queries.
              </p>
            </div>

            <form onSubmit={handleScan} className="space-y-4">
              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-[0.04em] text-muted block">
                  Monad Public Address
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter 0x... address"
                    className="flex-grow border border-line bg-paper text-ink p-3 text-sm font-sans rounded-none focus:border-redact focus:outline-none tracking-wider"
                    required
                    disabled={isScanning}
                  />
                  <button
                    type="submit"
                    disabled={isScanning || !address}
                    className="bg-redact text-paper rounded-[4px] px-6 py-3 font-label uppercase text-xs tracking-wider hover:bg-reveal disabled:bg-line disabled:text-muted focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Scanning
                      </>
                    ) : (
                      "Scan Wallet"
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="font-sans text-xs text-muted">No real private keys are required.</span>
              <button
                id="use-demo-addr"
                onClick={simulateDemoAddress}
                className="flex items-center gap-1 text-xs font-label uppercase tracking-[0.04em] text-ink underline decoration-0 hover:decoration-1 underline-offset-4 cursor-pointer"
              >
                Simulate with demo address
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="bg-red-50 border border-red-200 p-4 flex gap-3">
              <AlertTriangle className="text-red-700 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-display font-semibold text-sm text-red-950 mb-0.5">Critical Public Vulnerability Detected</h4>
                <p className="font-sans text-xs text-red-900 leading-relaxed">
                  The address is connected to active on-chain entities. 100% of holdings are searchable by anyone, making this wallet a prime target.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-line divide-y divide-line bg-paper">
                <div className="p-3 flex justify-between text-xs">
                  <span className="font-label uppercase tracking-[0.04em] text-muted">Address Profile</span>
                  <span className="font-sans font-medium text-ink break-all">{address}</span>
                </div>
                <div className="p-3 flex justify-between text-xs">
                  <span className="font-label uppercase tracking-[0.04em] text-muted">Exposed Monad Balance</span>
                  <span className="font-sans font-medium text-ink">15,000.00 MON (~$30,000.00)</span>
                </div>
                <div className="p-3 flex justify-between text-xs">
                  <span className="font-label uppercase tracking-[0.04em] text-muted">Exposed Stablecoins</span>
                  <span className="font-sans font-semibold text-red-700">$906,250.00 USDC</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-label">
                  <span className="text-muted uppercase tracking-[0.04em]">Amount to Shield into Redact</span>
                  <span className="text-redact font-bold">{shieldAmount}% (${(906250 * shieldAmount / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDC)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={shieldAmount}
                  onChange={(e) => setShieldAmount(Number(e.target.value))}
                  className="w-full accent-redact bg-line h-1 rounded-none outline-none appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-line">
              <button
                onClick={resetWizard}
                className="text-xs font-label uppercase tracking-[0.04em] text-muted hover:text-ink transition-colors duration-150 cursor-pointer self-center"
              >
                Back
              </button>
              <button
                onClick={handleShield}
                className="bg-redact text-paper rounded-[4px] px-6 py-3 font-label uppercase text-xs tracking-wider hover:bg-reveal focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Secure Vault
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display font-semibold text-lg text-ink mb-1">
                Configure Private Vault PINs
              </h3>
              <p className="font-sans text-sm text-muted">
                Create your secure retrieval PINs. These are saved completely locally and securely inside the enclave.
              </p>
            </div>

            <form onSubmit={executeShielding} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-[0.04em] text-ink block">
                    1. Secure Vault PIN (e.g. 5820)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    value={stdPin}
                    onChange={(e) => setStdPin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="4-digit PIN"
                    className="w-full border border-line bg-paper text-ink p-3 text-sm font-sans rounded-none focus:border-redact focus:outline-none tracking-widest text-center"
                    required
                    disabled={isShielding}
                  />
                  <p className="font-sans text-[10px] text-muted leading-tight">
                    Used to retrieve and view your genuine shielded holdings.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-[0.04em] text-redact block">
                    2. Duress Decoy PIN (e.g. 1397)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    value={durPin}
                    onChange={(e) => setDurPin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="4-digit PIN"
                    className="w-full border border-line bg-paper text-ink p-3 text-sm font-sans rounded-none focus:border-redact focus:outline-none tracking-widest text-center"
                    required
                    disabled={isShielding}
                  />
                  <p className="font-sans text-[10px] text-muted leading-tight">
                    Shows decoy low assets ($142.50) if forced to open wallet.
                  </p>
                </div>
              </div>

              {isShielding ? (
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between items-center text-xs font-label">
                    <span className="text-redact uppercase tracking-[0.04em] font-bold">Cryptographic Redaction Active...</span>
                    <span>{shieldProgress}%</span>
                  </div>
                  <div className="w-full bg-line h-1.5 rounded-none overflow-hidden">
                    <div className="bg-redact h-full transition-all duration-150" style={{ width: `${shieldProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-redact text-paper rounded-[4px] py-3 mt-6 font-label uppercase text-xs tracking-wider hover:bg-reveal focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Confirm Cryptographic Redaction
                </button>
              )}
            </form>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6 text-center py-4"
          >
            <div className="inline-flex p-4 bg-emerald-100 text-emerald-800 rounded-full mb-3">
              <Check size={32} />
            </div>

            <div>
              <h3 className="font-display font-semibold text-xl text-ink mb-2">
                Redaction Shield Complete
              </h3>
              <p className="font-sans text-sm text-muted max-w-md mx-auto leading-relaxed">
                Your stablecoins are now fully redacted on-chain. Your public balance has been successfully concealed on Monad.
              </p>
            </div>

            <div className="border border-line bg-paper divide-y divide-line max-w-sm mx-auto text-left rounded-none">
              <div className="p-3 flex justify-between text-xs">
                <span className="font-label uppercase tracking-[0.04em] text-muted">Public Exposure Balance</span>
                <span className="font-sans font-medium text-muted">$0.00 (Protected)</span>
              </div>
              <div className="p-3 flex justify-between text-xs">
                <span className="font-label uppercase tracking-[0.04em] text-ink font-bold">Redacted Balance</span>
                <span className="font-sans font-semibold text-redact">
                  ${(906250 * shieldAmount / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDC
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <p className="font-sans text-xs text-muted">
                You can try entering your newly configured PINs in the Duress Mode simulator below!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#duress-mode"
                  className="bg-ink text-paper rounded-[4px] px-6 py-2.5 font-label uppercase text-xs tracking-wider hover:bg-muted focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-colors duration-150 cursor-pointer self-center"
                >
                  Test Duress PIN
                </a>

                <button
                  onClick={resetWizard}
                  className="text-xs font-label uppercase tracking-[0.04em] text-ink underline decoration-0 hover:decoration-1 underline-offset-4 cursor-pointer self-center"
                >
                  Shield Another Wallet
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

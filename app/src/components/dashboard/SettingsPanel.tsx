"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { CheckCircle, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { verifyCurrentPin, changeStandardPin, saveDuressPin, hasDuressPin } from "@/lib/duress";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

type Step = "main" | "verify" | "change" | "fallback" | "success";

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [step, setStep] = useState<Step>("main");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [fallbackPin, setFallbackPin] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reset = () => {
    setStep("main");
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setFallbackPin("");
    setStatus("idle");
    setErrorMsg("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(currentPin)) return;
    setStatus("loading");
    setErrorMsg("");
    const ok = await verifyCurrentPin(currentPin);
    if (ok) {
      setStep("change");
      setStatus("idle");
    } else {
      setStatus("error");
      setErrorMsg("Incorrect PIN");
    }
  };

  const handleChangePin = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) return;
    if (newPin !== confirmPin) {
      setStatus("error");
      setErrorMsg("PINs do not match");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    const ok = await changeStandardPin(currentPin, newPin);
    if (ok) {
      setStep("success");
      setStatus("idle");
    } else {
      setStatus("error");
      setErrorMsg("Failed to change PIN");
    }
  };

  const handleSaveFallback = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(fallbackPin)) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await saveDuressPin(fallbackPin);
      setStep("success");
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg("Failed to save");
    }
  };

  const title = step === "main" ? "Settings" : "Change PIN";

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      {step === "main" && (
        <div className="space-y-4">
          <p className="font-sans text-sm text-muted leading-relaxed">
            Manage your vault security settings.
          </p>
          <button
            onClick={() => { setStep("verify"); setCurrentPin(""); setErrorMsg(""); }}
            className="w-full bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
          >
            Change PIN
          </button>
        </div>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <button
            type="button"
            onClick={() => setStep("main")}
            className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors cursor-pointer focus:outline-2 focus:outline-ink"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <div className="space-y-2">
            <label
              htmlFor="settings-current-pin"
              className="font-label text-xs uppercase tracking-[0.04em] text-ink block"
            >
              Enter current PIN
            </label>
            <input
              id="settings-current-pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={currentPin}
              onChange={(e) => { setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrorMsg(""); }}
              placeholder="4-digit PIN"
              disabled={status === "loading"}
              autoFocus
              className="w-full border border-line/[0.08] bg-studio text-ink p-3 text-sm font-sans focus:outline-2 focus:outline-ink tracking-widest text-center disabled:bg-studio/50 disabled:text-muted disabled:cursor-not-allowed"
            />
          </div>
          {status === "error" && (
            <p className="font-sans text-xs text-redact text-center">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={!/^\d{4}$/.test(currentPin) || status === "loading"}
            className="w-full bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 focus:outline-2 focus:outline-ink focus:outline-offset-2"
          >
            {status === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Verifying...</>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      )}

      {step === "change" && (
        <form onSubmit={handleChangePin} className="space-y-4">
          <button
            type="button"
            onClick={() => setStep("verify")}
            className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors cursor-pointer focus:outline-2 focus:outline-ink"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <div className="space-y-2">
            <label
              htmlFor="settings-new-pin"
              className="font-label text-xs uppercase tracking-[0.04em] text-ink block"
            >
              New PIN
            </label>
            <input
              id="settings-new-pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={newPin}
              onChange={(e) => { setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrorMsg(""); }}
              placeholder="4-digit PIN"
              disabled={status === "loading"}
              autoFocus
              className="w-full border border-line/[0.08] bg-studio text-ink p-3 text-sm font-sans focus:outline-2 focus:outline-ink tracking-widest text-center disabled:bg-studio/50 disabled:text-muted disabled:cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="settings-confirm-pin"
              className="font-label text-xs uppercase tracking-[0.04em] text-ink block"
            >
              Confirm new PIN
            </label>
            <input
              id="settings-confirm-pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrorMsg(""); }}
              placeholder="4-digit PIN"
              disabled={status === "loading"}
              className="w-full border border-line/[0.08] bg-studio text-ink p-3 text-sm font-sans focus:outline-2 focus:outline-ink tracking-widest text-center disabled:bg-studio/50 disabled:text-muted disabled:cursor-not-allowed"
            />
          </div>
          {status === "error" && (
            <p className="font-sans text-xs text-redact text-center">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={!/^\d{4}$/.test(newPin) || !/^\d{4}$/.test(confirmPin) || status === "loading"}
            className="w-full bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 focus:outline-2 focus:outline-ink focus:outline-offset-2"
          >
            {status === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              "Save"
            )}
          </button>
          <div className="pt-2 border-t border-line/[0.06]">
            <button
              type="button"
              onClick={() => { setStep("fallback"); setFallbackPin(""); setErrorMsg(""); }}
              className="text-[11px] text-muted/50 hover:text-muted transition-colors cursor-pointer focus:outline-2 focus:outline-ink underline decoration-dotted underline-offset-2"
            >
              Add fallback code
            </button>
          </div>
        </form>
      )}

      {step === "fallback" && (
        <form onSubmit={handleSaveFallback} className="space-y-4">
          <button
            type="button"
            onClick={() => setStep("change")}
            className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors cursor-pointer focus:outline-2 focus:outline-ink"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <div className="space-y-2">
            <label
              htmlFor="settings-fallback-pin"
              className="font-label text-xs uppercase tracking-[0.04em] text-ink block"
            >
              New code
            </label>
            <input
              id="settings-fallback-pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={fallbackPin}
              onChange={(e) => { setFallbackPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrorMsg(""); }}
              placeholder="4 digits"
              disabled={status === "loading"}
              autoFocus
              className="w-full border border-line/[0.08] bg-studio text-ink p-3 text-sm font-sans focus:outline-2 focus:outline-ink tracking-widest text-center disabled:bg-studio/50 disabled:text-muted disabled:cursor-not-allowed"
            />
          </div>
          {status === "error" && (
            <p className="font-sans text-xs text-redact text-center">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={!/^\d{4}$/.test(fallbackPin) || status === "loading"}
            className="w-full bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 focus:outline-2 focus:outline-ink focus:outline-offset-2"
          >
            {status === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              "Save"
            )}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="space-y-4 text-center py-4">
          <div className="flex justify-center">
            <CheckCircle size={32} className="text-emerald-700" />
          </div>
          <p className="font-sans text-sm text-ink">Settings updated</p>
          <button
            onClick={handleClose}
            className="w-full bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}

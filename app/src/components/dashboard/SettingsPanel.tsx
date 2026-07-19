"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      setStatus("success");
      setPin("");
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Vault PIN Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="vault-pin"
            className="font-label text-xs uppercase tracking-[0.04em] text-ink block"
          >
            Vault PIN
          </label>
          <input
            id="vault-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="4-digit PIN"
            disabled={status === "loading"}
            className="w-full border border-line/[0.08] bg-studio text-ink p-3 text-sm font-sans focus:outline-2 focus:outline-ink tracking-widest text-center disabled:bg-studio/50 disabled:text-muted disabled:cursor-not-allowed"
          />
        </div>

        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-sans">
            <CheckCircle size={16} />
            <span>PIN saved</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-start gap-2 text-redact text-sm font-sans">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!/^\d{4}$/.test(pin) || status === "loading"}
          className="w-full bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 focus:outline-2 focus:outline-ink focus:outline-offset-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save PIN"
          )}
        </button>
      </form>
    </Modal>
  );
}

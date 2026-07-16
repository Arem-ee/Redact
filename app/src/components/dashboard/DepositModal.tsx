"use client";

import { Modal } from "./Modal";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

export function DepositModal({ open, onClose }: DepositModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Deposit">
      <p className="font-sans text-sm text-muted leading-relaxed">
        Deposit into your redacted vault. This feature is not yet connected to the contract.
      </p>
      <div className="mt-6">
        <button
          disabled
          className="w-full bg-line text-muted text-sm font-label uppercase tracking-wider py-3 rounded-[4px] cursor-not-allowed"
        >
          Deposit
        </button>
      </div>
    </Modal>
  );
}

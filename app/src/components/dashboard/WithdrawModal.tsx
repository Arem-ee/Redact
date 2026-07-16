"use client";

import { Modal } from "./Modal";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

export function WithdrawModal({ open, onClose }: WithdrawModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Withdraw">
      <p className="font-sans text-sm text-muted leading-relaxed">
        Withdraw funds from your redacted vault. This feature is not yet connected to the contract.
      </p>
      <div className="mt-6">
        <button
          disabled
          className="w-full bg-line text-muted text-sm font-label uppercase tracking-wider py-3 rounded-[4px] cursor-not-allowed"
        >
          Withdraw
        </button>
      </div>
    </Modal>
  );
}

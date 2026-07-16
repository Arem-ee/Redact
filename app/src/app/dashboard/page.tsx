"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { DepositModal } from "@/components/dashboard/DepositModal";
import { WithdrawModal } from "@/components/dashboard/WithdrawModal";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import type { ModalType, ActivityItem } from "@/components/dashboard/types";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [activities, setActivities] = useState<ActivityItem[] | null>(null);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const fetchBalance = async () => {
    setBalanceLoading(true);
    setBalanceError(null);
    try {
      setBalance(null);
    } catch (err) {
      setBalanceError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    try {
      setActivities([]);
    } catch (err) {
      setActivitiesError(err instanceof Error ? err.message : "Failed to fetch activity");
    } finally {
      setActivitiesLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-room">
      <DashboardHeader
        walletAddress={address ?? null}
        onConnect={handleConnect}
      />

      <main className="max-w-3xl mx-auto px-6 py-8 sm:py-12 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper-text">
            Vault
          </h1>
          {isConnected && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveModal("settings")}
                className="font-label text-xs uppercase tracking-wider text-muted hover:text-paper-text transition-colors cursor-pointer focus:outline-2 focus:outline-paper-text focus:outline-offset-2"
              >
                Settings
              </button>
              <button
                onClick={() => disconnect()}
                className="font-label text-xs uppercase tracking-wider text-redact/70 hover:text-redact transition-colors cursor-pointer focus:outline-2 focus:outline-paper-text focus:outline-offset-2"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        <BalanceCard
          balance={balance}
          loading={balanceLoading}
          error={balanceError}
          onRetry={fetchBalance}
          onDeposit={() => setActiveModal("deposit")}
          onWithdraw={() => setActiveModal("withdraw")}
          walletConnected={isConnected}
        />

        <ActivityList
          items={activities}
          loading={activitiesLoading}
          error={activitiesError}
          onRetry={fetchActivities}
          walletConnected={isConnected}
        />
      </main>

      <DepositModal open={activeModal === "deposit"} onClose={() => setActiveModal(null)} />
      <WithdrawModal open={activeModal === "withdraw"} onClose={() => setActiveModal(null)} />
      <SettingsPanel open={activeModal === "settings"} onClose={() => setActiveModal(null)} />
    </div>
  );
}

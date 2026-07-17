"use client";

import { useAccount, useConnect, useDisconnect, useSignMessage, useWalletClient } from "wagmi";
import { injected } from "wagmi/connectors";
import { UserRejectedRequestError } from "viem";
import { useState, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { DepositModal } from "@/components/dashboard/DepositModal";
import { WithdrawModal } from "@/components/dashboard/WithdrawModal";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { WrongNetworkBanner } from "@/components/dashboard/WrongNetworkBanner";
import { useNetworkGuard } from "@/lib/useNetworkGuard";
import { getUnlinkClient, clearUnlinkClient, fetchPrivateBalance } from "@/lib/unlink";
import type { ModalType, ActivityItem } from "@/components/dashboard/types";
import type { WalletClient } from "viem";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { connect, error: connectError, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { data: walletClient } = useWalletClient();
  const { isWrongNetwork, switchToMonad, switchError, isSwitching } = useNetworkGuard();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [activities, setActivities] = useState<ActivityItem[] | null>(null);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const connectRejected = connectError instanceof UserRejectedRequestError;

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const fetchBalance = useCallback(async () => {
    setBalanceLoading(true);
    setBalanceError(null);
    try {
      const client = await getUnlinkClient(
        (msg: string) => signMessageAsync({ message: msg }),
        walletClient ?? undefined,
      );
      const raw = await fetchPrivateBalance(client);
      setBalance(raw);
    } catch (err) {
      setBalanceError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setBalanceLoading(false);
    }
  }, [signMessageAsync, walletClient]);

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
        isConnecting={isConnecting}
      />

      <main className="max-w-3xl mx-auto px-6 py-8 sm:py-12 space-y-6">
        <WrongNetworkBanner
          isWrongNetwork={isWrongNetwork}
          onSwitch={switchToMonad}
          isSwitching={isSwitching}
          switchError={switchError}
        />

        {connectRejected && !isConnected && (
          <div className="border border-redact/30 p-4 flex items-start gap-3">
            <p className="font-sans text-sm text-muted flex-1">
              Connection cancelled. Click <strong>Connect Wallet</strong> above to try again.
            </p>
          </div>
        )}

        {connectError && !connectRejected && !isConnected && (
          <div className="border border-redact/30 p-4 flex items-start gap-3">
            <p className="font-sans text-sm text-redact flex-1">
              {connectError.message || "Connection failed. Please try again."}
            </p>
          </div>
        )}

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
          isWrongNetwork={isWrongNetwork}
        />

        <ActivityList
          items={activities}
          loading={activitiesLoading}
          error={activitiesError}
          onRetry={fetchActivities}
          walletConnected={isConnected}
          isWrongNetwork={isWrongNetwork}
        />
      </main>

      <DepositModal
        open={activeModal === "deposit"}
        onClose={() => setActiveModal(null)}
        onDepositComplete={fetchBalance}
        signMessageAsync={(msg: string) => signMessageAsync({ message: msg })}
        walletClient={walletClient ?? undefined}
        isWrongNetwork={isWrongNetwork}
      />
      <WithdrawModal open={activeModal === "withdraw"} onClose={() => setActiveModal(null)} />
      <SettingsPanel open={activeModal === "settings"} onClose={() => setActiveModal(null)} />
    </div>
  );
}

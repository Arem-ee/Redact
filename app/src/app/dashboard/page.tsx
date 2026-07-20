"use client";

import { useAccount, useConnect, useDisconnect, useSignMessage, useWalletClient } from "wagmi";
import { injected } from "wagmi/connectors";
import { UserRejectedRequestError } from "viem";
import { useState, useCallback, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { DepositModal } from "@/components/dashboard/DepositModal";
import { WithdrawModal } from "@/components/dashboard/WithdrawModal";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { WrongNetworkBanner } from "@/components/dashboard/WrongNetworkBanner";
import { useNetworkGuard } from "@/lib/useNetworkGuard";
import { getUnlinkClient, fetchPrivateBalance } from "@/lib/unlink";
import { identifyPin, hasPins, isDuressModeActive, setDuressModeActive, getDecoyBalance, recordFailedAttempt, resetRateLimit, getRateLimitDelay } from "@/lib/duress";
import type { ModalType, ActivityItem } from "@/components/dashboard/types";

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

  const [unlockPin, setUnlockPin] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlockDelay, setUnlockDelay] = useState(0);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  const [activities, setActivities] = useState<ActivityItem[] | null>(null);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const connectRejected = connectError instanceof UserRejectedRequestError;

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const fetchBalance = useCallback(async () => {
    const client = await getUnlinkClient(
      (msg: string) => signMessageAsync({ message: msg }),
      walletClient ?? undefined,
    );
    return await fetchPrivateBalance(client);
  }, [signMessageAsync, walletClient]);

  const handleRefreshBalance = useCallback(async () => {
    setBalanceLoading(true);
    setBalanceError(null);
    try {
      const raw = await fetchBalance();
      setBalance(raw);
    } catch (err) {
      setBalanceError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setBalanceLoading(false);
    }
  }, [fetchBalance]);

  useEffect(() => {
    if (isConnected && walletClient) {
      const id = setTimeout(() => {
        setBalanceLoading(true);
        setBalanceError(null);
        fetchBalance()
          .then(setBalance)
          .catch((err) => setBalanceError(err instanceof Error ? err.message : "Failed to fetch balance"))
          .finally(() => setBalanceLoading(false));
      }, 0);
      return () => clearTimeout(id);
    } else if (!isConnected) {
      const id = setTimeout(() => {
        setBalance(null);
        setBalanceLoading(false);
        setVaultUnlocked(false);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [isConnected, walletClient, fetchBalance]);

  const handleUnlock = async () => {
    const delay = getRateLimitDelay();
    if (delay > 0) {
      setUnlockDelay(delay);
      setUnlockError(`Too many attempts. Try again in ${Math.ceil(delay / 1000)}s.`);
      setTimeout(() => setUnlockDelay(0), delay);
      return;
    }
    const result = await identifyPin(unlockPin);
    if (result === "standard") {
      resetRateLimit();
      setDuressModeActive(false);
      setVaultUnlocked(true);
      setUnlockPin("");
      setUnlockError("");
    } else if (result === "duress") {
      resetRateLimit();
      setDuressModeActive(true);
      setVaultUnlocked(true);
      setUnlockPin("");
      setUnlockError("");
    } else {
      recordFailedAttempt();
      const newDelay = getRateLimitDelay();
      if (newDelay > 0) {
        setUnlockDelay(newDelay);
        setUnlockError(`Too many attempts. Try again in ${Math.ceil(newDelay / 1000)}s.`);
        setTimeout(() => setUnlockDelay(0), newDelay);
      } else {
        setUnlockError("Invalid PIN");
      }
    }
  };

  const handleLock = () => {
    setVaultUnlocked(false);
    setUnlockPin("");
    setDuressModeActive(false);
  };

  const displayBalance = vaultUnlocked && isDuressModeActive()
    ? getDecoyBalance()
    : balance;

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
    <div className="min-h-screen bg-studio">
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
          <div className="border border-redact/20 p-4 flex items-start gap-3">
            <p className="font-sans text-sm text-muted flex-1">
              Connection cancelled. Click <strong>Connect Wallet</strong> above to try again.
            </p>
          </div>
        )}

        {connectError && !connectRejected && !isConnected && (
          <div className="border border-redact/20 p-4 flex items-start gap-3">
            <p className="font-sans text-sm text-redact flex-1">
              {connectError.message || "Connection failed. Please try again."}
            </p>
          </div>
        )}

        {isConnected && hasPins() && !vaultUnlocked ? (
          <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] p-8 max-w-sm mx-auto mt-16">
            <h2 className="font-display text-xl font-bold text-ink text-center mb-6">
              Enter PIN
            </h2>
            <div className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={unlockPin}
                disabled={unlockDelay > 0}
                onChange={(e) => {
                  setUnlockPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setUnlockError("");
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleUnlock(); }}
                placeholder="4-digit PIN"
                className="w-full border border-line/[0.08] bg-studio text-ink p-3 text-sm font-sans focus:outline-2 focus:outline-ink tracking-widest text-center disabled:bg-studio/50 disabled:text-muted disabled:cursor-not-allowed"
                autoFocus
              />
              {unlockError && (
                <p className="font-sans text-xs text-redact text-center">{unlockError}</p>
              )}
              <button
                onClick={handleUnlock}
                disabled={!/^\d{4}$/.test(unlockPin)}
                className="w-full bg-redact text-white text-sm font-label uppercase tracking-wider py-3 hover:bg-[#3E1660] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
              >
                Unlock
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Vault
              </h1>
              {isConnected && (
                <div className="flex items-center gap-3">
                  {!isDuressModeActive() && (
                    <button
                      onClick={() => setActiveModal("settings")}
                      className="font-label text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
                    >
                      Settings
                    </button>
                  )}
                  {hasPins() && vaultUnlocked && (
                    <button
                      onClick={handleLock}
                      className="font-label text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
                    >
                      Lock
                    </button>
                  )}
                  <button
                    onClick={() => disconnect()}
                    className="font-label text-xs uppercase tracking-wider text-redact/70 hover:text-redact transition-colors cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            <BalanceCard
              balance={displayBalance}
              loading={balanceLoading}
              error={balanceError}
              onRetry={handleRefreshBalance}
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
          </>
        )}
      </main>

      <DepositModal
        open={activeModal === "deposit"}
        onClose={() => setActiveModal(null)}
        onDepositComplete={handleRefreshBalance}
        signMessageAsync={(msg: string) => signMessageAsync({ message: msg })}
        walletClient={walletClient ?? undefined}
        isWrongNetwork={isWrongNetwork}
      />
      <WithdrawModal
        open={activeModal === "withdraw"}
        onClose={() => setActiveModal(null)}
        onWithdrawComplete={handleRefreshBalance}
        signMessageAsync={(msg: string) => signMessageAsync({ message: msg })}
        walletClient={walletClient ?? undefined}
        isWrongNetwork={isWrongNetwork}
      />
      <SettingsPanel open={activeModal === "settings"} onClose={() => setActiveModal(null)} />
    </div>
  );
}

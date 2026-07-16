"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { UserRejectedRequestError } from "viem";

export function useNetworkGuard() {
  const { chainId, isConnected } = useAccount();
  const { switchChain, error: switchError, isPending: isSwitching } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== monadTestnet.id;
  const switchRejected = switchError instanceof UserRejectedRequestError;

  const switchToMonad = () => switchChain({ chainId: monadTestnet.id });

  return { isWrongNetwork, switchToMonad, switchError, isSwitching, switchRejected } as const;
}

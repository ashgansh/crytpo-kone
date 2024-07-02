import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { WalletState } from "@web3-onboard/core";
import { useConnectWallet } from "@web3-onboard/react";
import { initializeRequestNetwork } from "./initializeRN";
import type { RequestNetwork } from "@requestnetwork/request-client.js";
import { CurrencyManager } from "@requestnetwork/currency";
import { currencies } from "@/utils/currencies"; // Make sure this path is correct

interface ContextType {
  wallet: WalletState | null;
  requestNetwork: RequestNetwork | null;
  currencyManager: CurrencyManager;
}

const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: ReactNode }) => {
  const [{ wallet }] = useConnectWallet();
  const [requestNetwork, setRequestNetwork] = useState<RequestNetwork | null>(null);
  const [currencyManager] = useState(() => new CurrencyManager(currencies));

  useEffect(() => {
    if (wallet) {
      const { provider } = wallet;
      initializeRequestNetwork(setRequestNetwork, provider);
    }
  }, [wallet]);

  return (
    <Context.Provider
      value={{
        wallet,
        requestNetwork,
        currencyManager,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within a Context Provider");
  }
  return context;
}

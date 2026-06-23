"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";

import MaintenanceGuard from "@/components/custom/MaintenanceGuard";
import { store } from "@/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <MaintenanceGuard />
        {children}
      </Provider>
    </SessionProvider>
  );
}

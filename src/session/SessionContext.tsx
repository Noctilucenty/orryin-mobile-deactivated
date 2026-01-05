import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type FlowUser = { id: number; email: string } | null;
export type FlowAccount = { id: number; currency: string } | null;

type SessionState = {
  user: FlowUser;
  account: FlowAccount;
  setUser: (u: FlowUser) => void;
  setAccount: (a: FlowAccount) => void;
  clear: () => void;
  hydrated: boolean;
};

const STORAGE_KEY = "orryin.session.v1";
const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FlowUser>(null);
  const [account, setAccount] = useState<FlowAccount>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setUser(parsed?.user ?? null);
            setAccount(parsed?.account ?? null);
          } catch {
            // corrupted storage — ignore
          }
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, account })).catch(() => {});
  }, [user, account, hydrated]);

  const value = useMemo(
    () => ({
      user,
      account,
      setUser,
      setAccount,
      hydrated,
      clear: () => {
        setUser(null);
        setAccount(null);
        AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      },
    }),
    [user, account, hydrated]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

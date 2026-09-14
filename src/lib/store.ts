import { useCallback, useEffect, useState } from "react";
import type { Lang, Pool, ScanRecord, Token } from "./types";
import { demoPools, demoTokens } from "./data";

const KEY = "kisanq.state.v1";

export interface AppState {
  lang: Lang;
  tokens: Token[];
  pools: Pool[];
  session: { name: string; phone: string } | null;
  offlineQueue: number;
  /** Log of QR scans performed by the Center Admin, most recent first. */
  scans: ScanRecord[];
}

const initial: AppState = {
  lang: "en",
  tokens: demoTokens(),
  pools: demoPools(),
  session: null,
  offlineQueue: 0,
  scans: [],
};

let memory: AppState = initial;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* offline-safe: ignore quota / private-mode failures */
  }
}

export function hydrate() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      memory = { ...initial, ...parsed };
      if (!parsed.tokens?.length) memory.tokens = demoTokens();
      if (!parsed.pools?.length) memory.pools = demoPools();
      if (!Array.isArray(parsed.scans)) memory.scans = [];
    }
  } catch {
    /* corrupt cache -> fall back to demo data */
  }
  listeners.forEach((l) => l());
}

export function setState(update: (s: AppState) => AppState) {
  memory = update(memory);
  persist();
  listeners.forEach((l) => l());
}

export function useAppState() {
  const [state, set] = useState<AppState>(memory);

  useEffect(() => {
    const l = () => set({ ...memory });
    listeners.add(l);
    hydrate();
    return () => {
      listeners.delete(l);
    };
  }, []);

  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), []);
  return [state, update] as const;
}

"use client";

import type {
  Asset,
  FinancialAccount,
  FinancialSnapshot,
  Milestone,
  Phase,
  Task,
} from "./supabase";

const STORAGE_KEYS = {
  PHASES: "mission-tracker:phases",
  TASKS: "mission-tracker:tasks",
  MILESTONES: "mission-tracker:milestones",
  FINANCIAL_ACCOUNTS: "mission-tracker:financial-accounts",
  ASSETS: "mission-tracker:assets",
  FINANCIAL_SNAPSHOTS: "mission-tracker:financial-snapshots",
  LAST_SYNC: "mission-tracker:last-sync",
  FOCUS_MODE: "mission-tracker:focus-mode",
} as const;

export const storage = {
  // Phases
  getPhases(): Phase[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.PHASES);
    return data ? JSON.parse(data) : [];
  },

  setPhases(phases: Phase[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(phases));
    this.setLastSync();
  },

  // Tasks
  getTasks(): Task[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  setTasks(tasks: Task[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    this.setLastSync();
  },

  // Milestones
  getMilestones(): Milestone[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    return data ? JSON.parse(data) : [];
  },

  setMilestones(milestones: Milestone[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
    this.setLastSync();
  },

  // Financial Accounts
  getFinancialAccounts(): FinancialAccount[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.FINANCIAL_ACCOUNTS);
    return data ? JSON.parse(data) : [];
  },

  setFinancialAccounts(accounts: FinancialAccount[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEYS.FINANCIAL_ACCOUNTS,
      JSON.stringify(accounts),
    );
    this.setLastSync();
  },

  // Assets
  getAssets(): Asset[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return data ? JSON.parse(data) : [];
  },

  setAssets(assets: Asset[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    this.setLastSync();
  },

  // Financial Snapshots
  getFinancialSnapshots(): FinancialSnapshot[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.FINANCIAL_SNAPSHOTS);
    return data ? JSON.parse(data) : [];
  },

  setFinancialSnapshots(snapshots: FinancialSnapshot[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEYS.FINANCIAL_SNAPSHOTS,
      JSON.stringify(snapshots),
    );
    this.setLastSync();
  },

  // Focus Mode
  getFocusMode(): boolean {
    if (typeof window === "undefined") return false;
    const data = localStorage.getItem(STORAGE_KEYS.FOCUS_MODE);
    return data === "true";
  },

  setFocusMode(enabled: boolean): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.FOCUS_MODE, String(enabled));
  },

  // Last Sync
  getLastSync(): Date | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return data ? new Date(data) : null;
  },

  setLastSync(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  },

  // Clear all data
  clearAll(): void {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  // Check if offline data is available
  hasOfflineData(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(STORAGE_KEYS.PHASES));
  },
};

// Online status detection
export const networkStatus = {
  isOnline(): boolean {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  },

  onOnline(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("online", callback);
    return () => window.removeEventListener("online", callback);
  },

  onOffline(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("offline", callback);
    return () => window.removeEventListener("offline", callback);
  },
};

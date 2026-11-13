"use client";

import * as React from "react";

export interface BagItem {
  key: string; // `${productId}:${colorId}:${sizeLabel}`
  productId: string;
  dropId?: string;
  code: string;
  subBrand: string;
  nameAr: string;
  nameEn: string;
  colorId: string;
  colorNameAr: string;
  colorHex: string;
  sizeLabel: string;
  unitPrice: number;
  qty: number;
  image: string;
}

interface CartContextValue {
  items: BagItem[];
  totalCount: number;
  subtotal: number;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  addItem: (item: Omit<BagItem, "key">, openBagAfter?: boolean) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "moworld_bag_v1";

const CartContext = React.createContext<CartContextValue | null>(null);

let listeners: Array<() => void> = [];
let cachedRaw = "[]";
let cachedItems: BagItem[] = [];

function emitChange() {
  for (const fn of listeners) fn();
}

function readSnapshot(): BagItem[] {
  if (typeof window === "undefined") return cachedItems;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = JSON.parse(raw);
      cachedItems = Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    cachedItems = [];
  }
  return cachedItems;
}

const SERVER_SNAPSHOT: BagItem[] = [];
function getServerSnapshot(): BagItem[] {
  return SERVER_SNAPSHOT;
}

function subscribeBag(listener: () => void) {
  listeners = [...listeners, listener];
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function writeSnapshot(next: BagItem[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(next);
    cachedRaw = raw;
    cachedItems = next;
    localStorage.setItem(STORAGE_KEY, raw);
    emitChange();
  } catch {
    // Ignore quota errors
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = React.useSyncExternalStore(subscribeBag, readSnapshot, getServerSnapshot);
  const [bagOpen, setBagOpen] = React.useState(false);

  const addItem = React.useCallback((incoming: Omit<BagItem, "key">, openBagAfter = true) => {
    const key = `${incoming.productId}:${incoming.colorId}:${incoming.sizeLabel}`;
    const current = readSnapshot();
    const existing = current.find((it) => it.key === key);
    let next: BagItem[];
    if (existing) {
      next = current.map((it) =>
        it.key === key ? { ...it, qty: Math.min(20, it.qty + incoming.qty) } : it,
      );
    } else {
      next = [{ ...incoming, key }, ...current];
    }
    writeSnapshot(next);
    if (openBagAfter) setBagOpen(true);
  }, []);

  const updateQty = React.useCallback((key: string, qty: number) => {
    const current = readSnapshot();
    if (qty <= 0) {
      writeSnapshot(current.filter((it) => it.key !== key));
      return;
    }
    writeSnapshot(
      current.map((it) => (it.key === key ? { ...it, qty: Math.min(20, qty) } : it)),
    );
  }, []);

  const removeItem = React.useCallback((key: string) => {
    writeSnapshot(readSnapshot().filter((it) => it.key !== key));
  }, []);

  const clearCart = React.useCallback(() => {
    writeSnapshot([]);
  }, []);

  const totalCount = React.useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items],
  );
  const subtotal = React.useMemo(
    () => items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0),
    [items],
  );

  const value = React.useMemo(
    () => ({
      items,
      totalCount,
      subtotal,
      bagOpen,
      setBagOpen,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }),
    [items, totalCount, subtotal, bagOpen, addItem, updateQty, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

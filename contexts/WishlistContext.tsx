"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product, getProductById } from "@/lib/data/products";

// ============================================
// TYPES
// ============================================

export interface WishlistItem {
  productId: number;
  product: Product;
  addedAt: number; // timestamp
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: { product: Product } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "CLEAR_WISHLIST" }
  | { type: "LOAD_WISHLIST"; payload: WishlistState };

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  itemCount: number;
}

// ============================================
// REDUCER
// ============================================

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product } = action.payload;
      const exists = state.items.some(item => item.productId === product.id);
      if (exists) return state;

      return {
        items: [
          ...state.items,
          { productId: product.id, product, addedAt: Date.now() },
        ],
      };
    }

    case "REMOVE_ITEM": {
      return {
        items: state.items.filter(item => item.productId !== action.payload.productId),
      };
    }

    case "CLEAR_WISHLIST": {
      return { items: [] };
    }

    case "LOAD_WISHLIST": {
      return action.payload;
    }

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "lepakshi_wishlist";

function loadWishlistFromStorage(): WishlistState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Rehydrate product data
    const items = parsed.items
      .map((item: { productId: number; addedAt: number }) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean);

    return { items };
  } catch {
    return null;
  }
}

function saveWishlistToStorage(state: WishlistState): void {
  if (typeof window === "undefined") return;

  try {
    const toStore = {
      items: state.items.map(item => ({
        productId: item.productId,
        addedAt: item.addedAt,
      })),
    };
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Ignore storage errors
  }
}

// ============================================
// PROVIDER
// ============================================

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = loadWishlistFromStorage();
    if (savedWishlist) {
      dispatch({ type: "LOAD_WISHLIST", payload: savedWishlist });
    }
  }, []);

  // Save wishlist to localStorage on changes
  useEffect(() => {
    saveWishlistToStorage(state);
  }, [state]);

  const itemCount = state.items.length;

  // Actions
  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: { product } });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const isInWishlist = (productId: number): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        toggleWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

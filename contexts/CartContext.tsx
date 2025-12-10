"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product, getProductById } from "@/lib/data/products";

// ============================================
// TYPES
// ============================================

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_PROMO"; payload: { code: string; discount: number } }
  | { type: "REMOVE_PROMO" }
  | { type: "LOAD_CART"; payload: CartState };

interface CartContextType {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// ============================================
// PROMO CODES
// ============================================

const PROMO_CODES: Record<string, number> = {
  "WELCOME10": 10,
  "CRAFT20": 20,
  "FESTIVE15": 15,
};

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

// ============================================
// REDUCER
// ============================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { productId: product.id, quantity, product }],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload.productId),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, 10) }
            : item
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        items: [],
        promoCode: null,
        promoDiscount: 0,
      };
    }

    case "APPLY_PROMO": {
      return {
        ...state,
        promoCode: action.payload.code,
        promoDiscount: action.payload.discount,
      };
    }

    case "REMOVE_PROMO": {
      return {
        ...state,
        promoCode: null,
        promoDiscount: 0,
      };
    }

    case "LOAD_CART": {
      return action.payload;
    }

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "lepakshi_cart";

function loadCartFromStorage(): CartState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Rehydrate product data
    const items = parsed.items
      .map((item: { productId: number; quantity: number }) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean);

    return {
      items,
      promoCode: parsed.promoCode || null,
      promoDiscount: parsed.promoDiscount || 0,
    };
  } catch {
    return null;
  }
}

function saveCartToStorage(state: CartState): void {
  if (typeof window === "undefined") return;

  try {
    const toStore = {
      items: state.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      promoCode: state.promoCode,
      promoDiscount: state.promoDiscount,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Ignore storage errors
  }
}

// ============================================
// PROVIDER
// ============================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    promoCode: null,
    promoDiscount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: savedCart });
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  // Calculate totals
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const savings = state.items.reduce((sum, item) => {
    const originalPrice = item.product.originalPrice || item.product.price;
    return sum + (originalPrice - item.product.price) * item.quantity;
  }, 0);

  const promoDiscountAmount = (subtotal * state.promoDiscount) / 100;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - promoDiscountAmount + shipping;

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Actions
  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const applyPromo = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    const discount = PROMO_CODES[upperCode];
    if (discount) {
      dispatch({ type: "APPLY_PROMO", payload: { code: upperCode, discount } });
      return true;
    }
    return false;
  };

  const removePromo = () => {
    dispatch({ type: "REMOVE_PROMO" });
  };

  const isInCart = (productId: number): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = state.items.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        promoCode: state.promoCode,
        promoDiscount: state.promoDiscount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
        isInCart,
        getItemQuantity,
        subtotal,
        savings,
        shipping,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

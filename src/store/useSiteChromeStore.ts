import { create } from "zustand";

type SiteChromeState = {
  cartCount: number;
  setCartCount: (n: number) => void;
  /** Fallback when httpOnly cookie lags after add-to-bag; server actions may use this to load the cart. */
  cartIdHint: string | null;
  setCartIdHint: (id: string | null) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

export const useSiteChromeStore = create<SiteChromeState>((set) => ({
  cartCount: 0,
  setCartCount: (n) => set({ cartCount: n }),
  cartIdHint: null,
  setCartIdHint: (cartIdHint) => set({ cartIdHint }),
  cartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
}));

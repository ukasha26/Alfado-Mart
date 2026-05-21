import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  productModalOpen: boolean;
  selectedProductId: string | null;
  checkoutRequested: boolean;
  activeCategory: string;
  searchQuery: string;
  announcementVisible: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openProductModal: (productId: string) => void;
  openCheckout: () => void;
  clearCheckout: () => void;
  closeProductModal: () => void;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  dismissAnnouncement: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  productModalOpen: false,
  selectedProductId: null,
  checkoutRequested: false,
  activeCategory: "all",
  searchQuery: "",
  announcementVisible: true,

  toggleSidebar: () =>
    set((s) => ({ sidebarOpen: !s.sidebarOpen, cartOpen: false })),
  closeSidebar: () => set({ sidebarOpen: false }),

  openProductModal: (productId) =>
    set({
      productModalOpen: true,
      selectedProductId: productId,
      checkoutRequested: false,
      sidebarOpen: false,
    }),
  openCheckout: () =>
    set({
      productModalOpen: true,
      selectedProductId: null,
      checkoutRequested: true,
      sidebarOpen: false,
    }),
  clearCheckout: () => set({ checkoutRequested: false }),
  closeProductModal: () =>
    set({ productModalOpen: false, selectedProductId: null, checkoutRequested: false }),

  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  dismissAnnouncement: () => set({ announcementVisible: false }),
}));

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  checkoutModalOpen: boolean;
  checkoutRequested: boolean;
  activeCategory: string;
  searchQuery: string;
  announcementVisible: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openCheckout: () => void;
  clearCheckout: () => void;
  closeCheckoutModal: () => void;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  dismissAnnouncement: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  checkoutModalOpen: false,
  checkoutRequested: false,
  activeCategory: "all",
  searchQuery: "",
  announcementVisible: true,

  toggleSidebar: () =>
    set((s) => ({ sidebarOpen: !s.sidebarOpen, cartOpen: false })),
  closeSidebar: () => set({ sidebarOpen: false }),

  openCheckout: () =>
    set({
      checkoutModalOpen: true,
      checkoutRequested: true,
      sidebarOpen: false,
    }),
  clearCheckout: () => set({ checkoutRequested: false }),
  closeCheckoutModal: () =>
    set({ checkoutModalOpen: false, checkoutRequested: false }),

  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  dismissAnnouncement: () => set({ announcementVisible: false }),
}));

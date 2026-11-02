# ALFADO MART. — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | React DOM renderer |
| typescript | ^5.7.0 | Type safety |
| vite | ^6.2.0 | Build tool & dev server |
| @vitejs/plugin-react | ^4.4.0 | Vite React integration |
| tailwindcss | ^4.1.0 | Utility-first CSS |
| @tailwindcss/vite | ^4.1.0 | Tailwind Vite plugin |
| geist | ^1.3.0 | Geist Sans font family |
| lucide-react | ^0.475.0 | Icon library (hamburger, search, cart, X, etc.) |
| framer-motion | ^12.0.0 | Animations (drawer slides, modal fades, staggered cards, countdown timer) |
| zustand | ^5.0.0 | Lightweight global state (cart, UI modals, toast) |
| clsx | ^2.1.0 | Conditional className utility |
| tailwind-merge | ^3.0.0 | Merge Tailwind classes without conflicts |

---

## Component Inventory

### Layout (shared across all sections)

| Component | Source | Notes |
|-----------|--------|-------|
| AnnouncementBar | Custom | Sticky top bar, countdown timer, dismiss with sessionStorage. Self-contained timer logic. |
| Navbar | Custom | Sticky header; includes HamburgerMenu, SearchBar, CartButton. Sticky state tracked via scroll listener. |
| Sidebar | Custom | Slide-out panel, shares backdrop with CartDrawer. |
| CartDrawer | Custom | Slide-in from right; shares Backdrop component with Sidebar and ProductModal. |
| Footer | Custom | Static, minimal. |

### Sections (page-level, used once)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroBanner | Custom | Text-only promo with countdown timer (reuses AnnouncementBar timer logic or a shared hook). |
| FilterBar | Custom | Horizontal scrollable tabs; category filter controls ProductGrid. |
| ProductGrid | Custom | CSS Grid layout; hosts ProductCard list. |
| ProductModal | Custom | Full-screen overlay (mobile) / centered overlay (desktop). Contains ImageGallery + product details + checkout form. |
| CheckoutForm | Custom | Embedded inside ProductModal. Handles form state, validation, and API submission. |

### Reusable Components (used 2+ times)

| Component | Source | Used By |
|-----------|--------|---------|
| Backdrop | Custom | Sidebar, CartDrawer, ProductModal — semi-transparent overlay with click-to-close. |
| ProductCard | Custom | ProductGrid — card with image, title, price, badge, hover quick-add. |
| QuantitySelector | Custom | ProductModal, CartDrawer — minus/number/plus control. |
| Toast | Custom | Global — triggered via Zustand store (add-to-cart, form success/error). |

### Hooks

| Hook | Purpose |
|------|---------|
| useCountdown | Shared timer logic for AnnouncementBar and HeroBanner. Returns {days, hours, minutes, seconds}. |
| useScrollLock | Locks/unlocks body scroll when modals/drawers are open. Applied to Sidebar, CartDrawer, ProductModal. |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Product cards fade-in (staggered) | Framer Motion | `motion.div` with `whileInView`, `staggerChildren: 0.05` on grid container, `initial={{ opacity: 0, y: 20 }}` on each card. | Medium |
| Hero content fade-in sequence | Framer Motion | `motion.div` with staggered `delay` on headline, subheadline, timer, CTA. | Low |
| Announcement bar slide-down | Framer Motion | `motion.div` with `initial={{ y: '-100%' }}`, `animate={{ y: 0 }}`. | Low |
| Sidebar slide-in from left | Framer Motion | `AnimatePresence` + `motion.aside` with `x: '-100%' → 0`. Menu items use `staggerChildren`. | Medium |
| CartDrawer slide-in from right | Framer Motion | `AnimatePresence` + `motion.div` with `x: '100%' → 0`. Items stagger in. | Medium |
| ProductModal slide-up (mobile) / fade-scale (desktop) | Framer Motion | `AnimatePresence` + conditional animation: `y: '100%'` (mobile) vs `scale: 0.95, opacity: 0` (desktop) via media query or responsive prop. | Medium |
| Backdrop fade | Framer Motion | `motion.div` with `initial={{ opacity: 0 }}`, `animate={{ opacity: 0.5 }}`. | Low |
| Navbar logo/icons fade-in | Framer Motion | `motion.div` with `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`. | Low |
| Search bar expand | Framer Motion | `motion.input` with `animate={{ width: isFocused ? 280 : 0 }}`. | Low |
| Product image hover scale | CSS transition | `transition-transform duration-300 hover:scale-[1.02]` on image. | Low |
| Card border hover change | CSS transition | `transition-colors duration-300 hover:border-black` on card. | Low |
| Toast slide-up | Framer Motion | `AnimatePresence` + `motion.div` with `y: 20 → 0`, `opacity: 0 → 1`. Auto-dismiss with `setTimeout`. | Low |
| Skeleton shimmer | CSS animation | `animate-shimmer` keyframe — linear gradient sweep, 1.5s loop. | Low |
| Thumbnail crossfade | Framer Motion | `AnimatePresence` + `motion.img` with `opacity` transition on primary image swap. | Low |
| Button active press | CSS transition | `active:scale-[0.98] transition-transform duration-100`. | Low |
| Countdown timer number update | Framer Motion | `AnimatePresence` with `mode="popLayout"` for digit transitions (optional polish). | Low |

---

## State & Logic Plan

### Cart Store (Zustand)

Global store managing cart items, persistence, and derived values.

- **State**: `items: CartItem[]`, `isOpen: boolean`
- **Actions**: `addItem(product, variant?, qty)`, `removeItem(productId, variantId?)`, `updateQty(productId, variantId?, qty)`, `clearCart()`, `toggleCart()`, `openCart()`, `closeCart()`
- **Persistence**: `persist` middleware writing to localStorage key `"alfado-cart"`
- **Derived**: `totalItems` (sum of quantities), `subtotal` (sum of price × qty)
- **Toast integration**: `addItem` triggers a toast notification automatically

### UI Store (Zustand)

Manages visibility state for all overlay components. Prevents conflicting states (e.g., sidebar and cart drawer both open).

- **State**: `sidebarOpen: boolean`, `productModalOpen: boolean`, `selectedProductId: string | null`, `activeCategory: string`, `searchQuery: string`, `announcementVisible: boolean`
- **Actions**: `toggleSidebar()`, `openProductModal(productId)`, `closeProductModal()`, `setCategory(slug)`, `setSearchQuery(q)`, `dismissAnnouncement()`
- **Mutual exclusion**: Opening any modal/drawer automatically closes others

### Toast Store (Zustand)

Lightweight notification queue. Used globally for add-to-cart, checkout success/error, and validation feedback.

- **State**: `toasts: { id, message, type }[]`
- **Actions**: `addToast(message, type, duration?)`, `removeToast(id)`
- **Auto-dismiss**: Each toast auto-removes after 2.5s (or custom duration) via `setTimeout`

### useCountdown Hook

Shared timer logic for both AnnouncementBar and HeroBanner. Avoids duplicating `setInterval` logic.

- **Input**: Target timestamp (end of sale)
- **Output**: `{ days, hours, minutes, seconds, expired }`
- **Logic**: `setInterval(1000)` computing delta; cleans up on unmount

### useScrollLock Hook

Locks body scroll when any overlay is active. Uses a ref counter to handle multiple simultaneous overlays.

- **Input**: `locked: boolean`
- **Logic**: Sets `document.body.style.overflow = 'hidden'`; increments/decrements counter to avoid premature unlock when two overlays are open

### Order Submission Flow

Checkout form handles client-side validation and API dispatch to Google Sheets endpoint.

- **Validation**: Real-time field validation (name min 3 chars, Pakistani phone regex `03XXXXXXXXX`, required fields); errors displayed inline
- **Submission**: `fetch()` POST with JSON payload (full Order object); button enters loading state during request
- **Success**: Form replaced with success confirmation view; order ID displayed; cart cleared
- **Error**: Toast notification with error message; button returns to normal state

### Product Filtering & Search

- **Category filter**: `activeCategory` state filters product array client-side; "ALL" shows all products
- **Search**: Debounced 300ms via `useDeferredValue` or manual `setTimeout`; filters by product name matching search query (case-insensitive)
- **Combined**: Category and search filters stack (both applied simultaneously)

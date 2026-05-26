import { lazy, Suspense } from "react";
import { AnnouncementBar } from "@/sections/AnnouncementBar";
import { Navbar } from "@/sections/Navbar";
import { HeroBanner } from "@/sections/HeroBanner";
import { Seo } from "@/components/Seo";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE_PATH,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_URL,
} from "@/lib/seo";

const Sidebar = lazy(() =>
  import("@/sections/Sidebar").then((module) => ({ default: module.Sidebar }))
);
const CartDrawer = lazy(() =>
  import("@/sections/CartDrawer").then((module) => ({ default: module.CartDrawer }))
);
const ProductModal = lazy(() =>
  import("@/sections/ProductModal").then((module) => ({ default: module.ProductModal }))
);
const ToastContainer = lazy(() =>
  import("@/components/Toast").then((module) => ({ default: module.ToastContainer }))
);
const FilterBar = lazy(() =>
  import("@/sections/FilterBar").then((module) => ({ default: module.FilterBar }))
);
const ProductGrid = lazy(() =>
  import("@/sections/ProductGrid").then((module) => ({ default: module.ProductGrid }))
);
const Footer = lazy(() =>
  import("@/sections/Footer").then((module) => ({ default: module.Footer }))
);

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        keywords={DEFAULT_KEYWORDS}
        canonicalUrl={SITE_URL}
        image={DEFAULT_IMAGE_PATH}
        pageType="website"
      />
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroBanner />
        <Suspense
          fallback={
            <>
              <section className="bg-white border-b border-[#F3F4F6]">
                <div className="max-w-[1440px] mx-auto px-4 md:px-12">
                  <div className="h-[49px] md:h-[56px]" />
                </div>
              </section>
              <section className="bg-white">
                <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-6 md:py-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="border border-[#F3F4F6] bg-white">
                        <div className="aspect-[4/3] bg-[#F3F4F6] animate-pulse" />
                        <div className="p-4 space-y-3">
                          <div className="h-4 w-4/5 bg-[#F3F4F6] animate-pulse" />
                          <div className="h-5 w-1/2 bg-[#F3F4F6] animate-pulse" />
                          <div className="h-11 bg-[#F3F4F6] animate-pulse md:hidden" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          }
        >
          <FilterBar />
          <ProductGrid />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-24 bg-white" />}>
        <Footer />
      </Suspense>
      <a
        href="https://wa.me/923346605354?text=Hello%20Alfado%20Mart%2C%20I%20need%20help%20with%20my%20order."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[600] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M19.11 17.7c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.85 1.05-.16.18-.31.2-.58.07-.27-.14-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.48-1.84-.16-.27-.02-.41.12-.54.12-.12.27-.31.41-.46.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.46-.84-2-.22-.52-.45-.45-.61-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26 0 1.33.98 2.61 1.12 2.79.14.18 1.91 2.92 4.63 4.1 1.82.79 2.53.86 3.44.72.55-.08 1.59-.65 1.82-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32ZM16.06 3C9.28 3 3.78 8.5 3.78 15.28c0 2.16.56 4.26 1.61 6.11L4 29l7.81-1.35a12.2 12.2 0 0 0 4.25.76c6.78 0 12.28-5.5 12.28-12.28C28.34 8.5 22.84 3 16.06 3Zm0 22.38c-1.34 0-2.66-.23-3.91-.68l-.28-.1-4.64.8.82-4.52-.18-.29a9.83 9.83 0 0 1-1.52-5.28c0-5.47 4.45-9.92 9.92-9.92 5.47 0 9.92 4.45 9.92 9.92 0 5.47-4.45 9.92-9.92 9.92Z" />
          </svg>
        </span>
      </a>
      <Suspense fallback={null}>
        <Sidebar />
        <CartDrawer />
        <ProductModal />
        <ToastContainer />
      </Suspense>
    </div>
  );
}

export default App;

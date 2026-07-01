import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Zap } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { OrderCheckoutForm } from "@/components/OrderCheckoutForm";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantitySelector } from "@/components/QuantitySelector";
import { getProductBySlug } from "@/data/products";
import { formatDiscountPercentage, calculateTieredLineTotal, getTieredDeliveryCharge } from "@/lib/pricing";
import { TieredDiscount } from "@/components/TieredDiscount";
import { ProductReviews } from "@/components/ProductReviews";
import { SITE_URL, type SeoProductDetails } from "@/lib/seo";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const addToast = useToastStore((s) => s.addToast);
  const actionBarRef = useRef<HTMLDivElement | null>(null);

  const product = slug ? getProductBySlug(slug) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showStickyActions, setShowStickyActions] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setShowCheckout(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    const target = actionBarRef.current;

    if (!target || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyActions(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [slug]);

  const galleryImages = useMemo(
    () => (product?.images?.length ? product.images : product ? [product.image] : []),
    [product]
  );

  const discountLabel = product?.originalPrice
    ? formatDiscountPercentage(product.originalPrice, product.price)
    : "";

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

  const isBundleDealProduct =
    product?.id === "vegetable-cutter" || product?.id === "stainless-steel-vegetable-cutter";

  const hasTieredOffer = product ? product.hasTieredDiscount || isBundleDealProduct : false;

  const lineTotal = product
    ? hasTieredOffer
      ? calculateTieredLineTotal(product.price, quantity)
      : product.price * quantity
    : 0;

  const deliveryCharge = isBundleDealProduct
    ? 0
    : hasTieredOffer
    ? getTieredDeliveryCharge(quantity)
    : 0;

  const getWhatsAppOrderUrl = () => {
    if (!product) return "https://wa.me/923346605354";

    const message = [
      "Hello Alfado Mart, I want to order:",
      product.name,
      `Quantity: ${quantity}`,
      `Total: ${formatPrice(lineTotal + deliveryCharge)}`,
    ].join("\n");

    return `https://wa.me/923346605354?text=${encodeURIComponent(message)}`;
  };

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const productSeo: SeoProductDetails = {
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    currency: "PKR",
    availability: product.inStock ? "InStock" : "OutOfStock",
    sku: product.id,
    brand: "Alfado Mart",
    url: `${SITE_URL}/product/${product.id}`,
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
    addToast("Added to cart", "success");
  };

  const handleBuyNow = () => {
    addToast("Ready for checkout", "success");
    setShowCheckout(true);
  };

  return (
    <>
      <Seo
        title={`${product.name} | Alfado Mart`}
        description={product.description}
        keywords={product.keywords}
        image={product.image}
        canonicalUrl={productSeo.url ?? SITE_URL}
        pageType="product"
        productDetails={productSeo}
      />

      <main className="bg-white">
        {showCheckout ? (
          <OrderCheckoutForm
            orderItems={[{ product, quantity }]}
            onBack={() => setShowCheckout(false)}
            onComplete={() => navigate("/")}
            backLabel="Back to product"
          />
        ) : (
          <div className="mx-auto max-w-[1200px]">
            <div className="border-b border-[#F3F4F6] px-4 py-4 md:px-12">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:text-black"
                type="button"
              >
                <ArrowLeft size={16} />
                Back to shop
              </button>
            </div>

            <article className="md:grid md:grid-cols-[55%_45%]">
              <section aria-label="Product images" className="relative overflow-hidden border-b border-[#F3F4F6] bg-white md:border-b-0 md:border-r">
                <ProductGallery images={galleryImages} altBase={product.name} className="w-full" />
                {discountLabel ? (
                  <div className="absolute left-4 top-4 z-10 bg-[#F2A93B] px-2 py-1 text-xs font-medium tracking-wider text-black">
                    {discountLabel} OFF
                  </div>
                ) : null}
              </section>

              <section aria-label="Product details" className="p-4 md:p-12">
                <h1 className="text-xl font-semibold tracking-[-0.01em] text-black md:text-2xl">
                  {product.name}
                </h1>

                <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-lg font-semibold text-black md:text-xl">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base font-bold text-red-600 line-through decoration-red-500 decoration-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="mt-5 inline-flex items-center rounded-full border border-black px-3 py-1 text-xs font-medium text-black">
                  Cash On Delivery
                </div>

                <div className="mt-5 rounded-lg border border-[#F3F4F6] bg-[#FAFAFA] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
                    Selected Product
                  </p>
                  <p className="mt-1 text-sm font-medium text-black">{product.name}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[#2A2A2A]">Quantity</span>
                    <span className="font-medium text-black">{quantity}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-[#2A2A2A]">Delivery</span>
                    <span className={`font-medium ${deliveryCharge === 0 ? "text-[#16A34A]" : "text-black"}`}>
                      {product.hasTieredDiscount
                        ? deliveryCharge === 0
                          ? "🎉 Free Delivery"
                          : formatPrice(deliveryCharge)
                        : "Free"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-[#2A2A2A]">Total</span>
                    <span className="font-semibold text-black">
                      {formatPrice(lineTotal + deliveryCharge)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
                    Quantity
                  </label>
                  <div className="mt-2">
                    <QuantitySelector quantity={quantity} onChange={setQuantity} />
                  </div>
                </div>

                {hasTieredOffer && (
                  <TieredDiscount
                    quantity={quantity}
                    unitPrice={product.price}
                    onSelectTier={setQuantity}
                  />
                )}

                {/* Updated Action Buttons Grid */}
                <div ref={actionBarRef} className="mt-6 grid gap-3 sm:grid-cols-3">
                  {/* Add To Cart */}
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-black text-sm font-bold tracking-wider text-white transition-all duration-200 hover:bg-[#1A1A1A] hover:shadow-lg"
                    type="button"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-white/10 transition-transform duration-1000 group-hover:translate-x-[300%]" />
                    <span className="relative flex items-center justify-center gap-2">
                      <ShoppingCart size={18} />
                      ADD TO CART
                    </span>
                  </motion.button>

                  {/* Buy Now */}
                  <motion.button
                    onClick={handleBuyNow}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-[#F2A93B] text-sm font-bold tracking-wider text-black transition-all duration-200 hover:bg-[#F5B957] hover:shadow-lg"
                    type="button"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-white/20 transition-transform duration-1000 group-hover:translate-x-[300%]" />
                    <span className="relative flex items-center justify-center gap-2">
                      <Zap size={18} fill="currentColor" />
                      BUY NOW
                    </span>
                  </motion.button>

                  {/* Official WhatsApp Button */}
                  <motion.a
                    href={getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold tracking-wider text-white shadow-[0_4px_14px_rgba(37,211,102,0.3)] transition-all duration-200 hover:bg-[#20BA5A] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)]"
                  >
                    <svg 
                      className="h-5 w-5 fill-current text-white" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WHATSAPP ORDER
                  </motion.a>
                </div>

                {showStickyActions ? (
                  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md md:hidden">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-3">
                      <motion.button
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.99 }}
                        className="inline-flex h-12 items-center justify-center rounded-xl bg-black text-xs font-bold tracking-wider text-white shadow-lg shadow-black/10"
                        type="button"
                      >
                        ADD TO CART
                      </motion.button>
                      <motion.button
                        onClick={handleBuyNow}
                        whileTap={{ scale: 0.99 }}
                        className="inline-flex h-12 items-center justify-center rounded-xl bg-[#F2A93B] text-xs font-bold tracking-wider text-black shadow-lg shadow-black/10"
                        type="button"
                      >
                        BUY NOW
                      </motion.button>
                    </div>
                  </div>
                ) : null}

                <p className="mt-6 text-sm leading-relaxed text-[#2A2A2A]">{product.description}</p>

                <div className="mt-5 space-y-4 rounded-lg border border-[#F3F4F6] bg-white p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">Features</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-[#2A2A2A]">
                      {product.features?.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">Caution</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-[#2A2A2A]">
                      {product.caution?.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </article>

            <ProductReviews productName={product.name} />
          </div>
        )}
      </main>
    </>
  );
}
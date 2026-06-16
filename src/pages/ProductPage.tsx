import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, ShoppingCart, Zap } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { OrderCheckoutForm } from "@/components/OrderCheckoutForm";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantitySelector } from "@/components/QuantitySelector";
import { getProductBySlug } from "@/data/products";
import { formatDiscountPercentage } from "@/lib/pricing";
import { SITE_URL, type SeoProductDetails } from "@/lib/seo";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const addToast = useToastStore((s) => s.addToast);

  const product = slug ? getProductBySlug(slug) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setShowCheckout(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const galleryImages = useMemo(
    () => (product?.images?.length ? product.images : product ? [product.image] : []),
    [product]
  );

  const discountLabel = product?.originalPrice
    ? formatDiscountPercentage(product.originalPrice, product.price)
    : "";

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

  const deliveryCharge = 0;

  const getWhatsAppOrderUrl = () => {
    if (!product) return "https://wa.me/923346605354";

    const message = [
      "Hello Alfado Mart, I want to order:",
      product.name,
      `Quantity: ${quantity}`,
      `Total: ${formatPrice(product.price * quantity + deliveryCharge)}`,
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

            <div className="md:grid md:grid-cols-[55%_45%]">
              <div className="relative overflow-hidden border-b border-[#F3F4F6] bg-white md:border-b-0 md:border-r">
                <ProductGallery images={galleryImages} altBase={product.name} className="w-full" />
                {discountLabel ? (
                  <div className="absolute left-4 top-4 z-10 bg-[#F2A93B] px-2 py-1 text-xs font-medium tracking-wider text-black">
                    {discountLabel}
                  </div>
                ) : null}
              </div>

              <div className="p-4 md:p-12">
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
                    <span className="text-[#2A2A2A]">Total</span>
                    <span className="font-semibold text-black">
                      {formatPrice(product.price * quantity + deliveryCharge)}
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

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="group relative inline-flex min-h-14 w-full overflow-hidden bg-black px-4 py-4 text-sm font-semibold tracking-wider text-white transition-colors duration-200 hover:bg-[#2A2A2A]"
                    type="button"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[320%]" />
                    <span className="relative flex w-full items-center justify-center gap-2">
                      <ShoppingCart size={17} />
                      ADD TO CART
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={handleBuyNow}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="group relative inline-flex min-h-14 w-full overflow-hidden border border-black bg-[#F2A93B] px-4 py-4 text-sm font-semibold tracking-wider text-black transition-colors duration-200 hover:bg-[#f5b957]"
                    type="button"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-white/35 transition-transform duration-700 group-hover:translate-x-[320%]" />
                    <span className="relative flex w-full items-center justify-center gap-2">
                      <Zap size={17} />
                      BUY NOW
                    </span>
                  </motion.button>

                  <a
                    href={getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-14 w-full items-center justify-center gap-2 border border-[#25D366] bg-white px-4 py-4 text-xs font-semibold tracking-wider text-[#128C4A] shadow-[0_10px_24px_rgba(37,211,102,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-white hover:shadow-[0_16px_34px_rgba(37,211,102,0.24)] active:scale-[0.98] md:text-[13px]"
                  >
                    <MessageCircle size={17} />
                    ORDER ON WHATSAPP
                  </a>
                </div>

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

                <div className="mt-8 border-t border-[#F3F4F6] pt-6">
                  <p className="text-xs text-[#2A2A2A]">
                    Free shipping on orders over Rs. 3,000. Easy 7-day returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

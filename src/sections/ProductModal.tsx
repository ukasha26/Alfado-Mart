import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Backdrop } from "@/components/Backdrop";
import { QuantitySelector } from "@/components/QuantitySelector";
import { Seo } from "@/components/Seo";
import { products } from "@/data/products";
import { SITE_URL, type SeoProductDetails } from "@/lib/seo";
import { sendOrderToSheets } from "@/lib/orderService";

interface FormData {
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  instructions: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
}

const cityOptions = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Other"];

export function ProductModal() {
  const isOpen = useUIStore((s) => s.productModalOpen);
  const selectedProductId = useUIStore((s) => s.selectedProductId);
  const checkoutRequested = useUIStore((s) => s.checkoutRequested);
  const clearCheckout = useUIStore((s) => s.clearCheckout);
  const closeProductModal = useUIStore((s) => s.closeProductModal);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useScrollLock(isOpen);

  const product = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [selectedProductId]
  );

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

  const handleClose = () => {
    closeProductModal();
    clearCheckout();
    setQuantity(1);
    setShowCheckout(false);
    setOrderSuccess(false);
    setOrderId("");
    setFormData({
      fullName: "",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      city: "",
      instructions: "",
    });
    setErrors({});
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    addToast("Added to cart", "success");
    handleClose();
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToast("Ready for checkout", "success");
    setShowCheckout(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }
    const phoneRegex = /^03\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/-/g, ""))) {
      newErrors.phone = "Enter a valid Pakistani mobile number (03XXXXXXXXX)";
    }
    if (formData.whatsapp.trim() && !phoneRegex.test(formData.whatsapp.replace(/-/g, ""))) {
      newErrors.whatsapp = "Enter a valid Pakistani mobile number";
    }
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Enter a valid email address";
      }
    }
    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }
    if (!formData.city) {
      newErrors.city = "Please select a city";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const orderItems = useMemo(() => {
    if (product) {
      return [{ product, quantity }];
    }

    return items;
  }, [product, quantity, items]);

  const orderSummaryTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [orderItems]
  );

  const orderProductLabel = useMemo(() => {
    return orderItems.map((item) => `${item.product.name} x${item.quantity}`).join(" | ");
  }, [orderItems]);

  const orderQuantityLabel = useMemo(() => {
    return orderItems.map((item) => String(item.quantity)).join(" | ");
  }, [orderItems]);

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    // Generate order ID
    const generatedOrderId = `AM-${Date.now().toString(36).toUpperCase()}`;
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    }).format(new Date());

    try {
      await sendOrderToSheets({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city,
        email: formData.email.trim(),
        product: orderProductLabel,
        quantity: orderQuantityLabel,
        instructions: formData.instructions.trim(),
      });

      // Since no-cors doesn't return readable response, we assume success
      setOrderId(generatedOrderId);
      setOrderSuccess(true);
      if ((window as any).fbq) {
        (window as any).fbq("track", "Purchase", {
          value: orderSummaryTotal,
          currency: "PKR",
        });
      }
      if (!product) {
        clearCart();
      }
      addToast("Order placed successfully!", "success");
    } catch {
      addToast("Failed to place order. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isCheckoutView = showCheckout || checkoutRequested;

  useEffect(() => {
    if (!isOpen) return;
    if (!isCheckoutView && !orderSuccess) return;

    modalScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [isOpen, isCheckoutView, orderSuccess]);

  const productSeo: SeoProductDetails | null = product
    ? {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        currency: "PKR",
        availability: product.inStock ? "InStock" : "OutOfStock",
        sku: product.id,
        brand: "Alfado Mart",
        url: SITE_URL,
      }
    : null;

  if (!isOpen || (!product && !checkoutRequested)) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {productSeo ? (
            <Seo
              title={`${product.name} | Alfado Mart`}
              description={product.description}
              image={product.image}
              canonicalUrl={SITE_URL}
              pageType="product"
              productDetails={productSeo}
            />
          ) : null}
          <Backdrop onClick={handleClose} zIndex={300} />
          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center bg-white md:bg-transparent overflow-y-auto"
            style={{ zIndex: 300 }}
            ref={modalScrollRef}
          >
            <div className="bg-white w-full md:max-w-[1200px] max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 text-[#2A2A2A] hover:text-black transition-colors duration-150 bg-white/80"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {!isCheckoutView && product ? (
                /* Product Detail View */
                <div className="md:grid md:grid-cols-[55%_45%]">
                  {/* Image */}
                  <div className="relative" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <div
                        className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium tracking-wider ${
                          product.badge === "SALE"
                            ? "bg-[#F2A93B] text-black"
                            : "bg-black text-white"
                        }`}
                      >
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-12">
                    <h2 className="text-xl md:text-2xl font-semibold text-black tracking-[-0.01em]">
                      {product.name}
                    </h2>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-lg md:text-xl font-semibold text-black">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-base text-[#2A2A2A] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#2A2A2A] mt-4 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-5 inline-flex items-center rounded-full border border-black px-3 py-1 text-xs font-medium text-black">
                      Cash On Delivery
                    </div>

                    <div className="mt-5 rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
                        Selected Product
                      </p>
                      <p className="mt-1 text-sm font-medium text-black">
                        {product.name}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-[#2A2A2A]">Quantity</span>
                        <span className="font-medium text-black">{quantity}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-[#2A2A2A]">Total</span>
                        <span className="font-semibold text-black">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="text-xs font-medium text-[#2A2A2A] uppercase tracking-wider">
                        Quantity
                      </label>
                      <div className="mt-2">
                        <QuantitySelector
                          quantity={quantity}
                          onChange={setQuantity}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-4 bg-black text-white text-sm font-medium tracking-wider hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98]"
                      >
                        ADD TO CART
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="w-full py-4 bg-white text-black text-sm font-medium tracking-wider border border-black hover:bg-[#F3F4F6] transition-colors duration-200 active:scale-[0.98]"
                      >
                        BUY NOW
                      </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                      <p className="text-xs text-[#2A2A2A]">
                        Free shipping on orders over Rs. 3,000. Easy 7-day
                        returns.
                      </p>
                    </div>
                  </div>
                </div>
              ) : orderSuccess ? (
                /* Order Success View */
                <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
                      <Check size={32} className="text-green-600" />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-semibold text-black">
                    Order Placed Successfully!
                  </h2>
                  <p className="text-sm text-[#2A2A2A] mt-2 text-center max-w-md">
                    Thank you for your order. We will contact you shortly to
                    confirm.
                  </p>
                  <p className="text-sm font-medium text-black mt-4">
                    Order #{orderId}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-8 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98]"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                /* Checkout Form View */
                <div className="max-w-[640px] mx-auto p-6 md:p-12">
                  {/* Compact Product Preview for mobile/checkout */}
                  {product && (
                    <div className="mb-4 flex items-center gap-4">
                      <div className="w-20 h-20 flex-shrink-0 border border-[#F3F4F6] overflow-hidden rounded">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#6b7280] mt-1">Qty {quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-black">
                        {formatPrice(product.price * quantity)}
                      </div>
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl font-semibold text-black mb-6">
                    Order Details
                  </h2>

                  {/* Order Summary */}
                  {orderItems.length > 0 && (
                    <div className="mb-6 p-4 bg-[#F3F4F6]">
                      <p className="text-xs font-medium text-[#2A2A2A] uppercase tracking-wider mb-2">
                        Order Summary
                      </p>
                      {orderItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex justify-between text-sm py-1"
                        >
                          <span className="text-black">
                            {item.product.name} x{item.quantity}
                          </span>
                          <span className="text-black font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-[#e5e7eb] mt-2 pt-2 flex justify-between">
                        <span className="text-sm font-medium text-black">
                          Subtotal
                        </span>
                        <span className="text-base font-semibold text-black">
                          {formatPrice(orderSummaryTotal)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mb-6 rounded-xl border border-black/10 bg-black/5 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
                      Payment Method
                    </p>
                    <p className="mt-1 text-sm font-medium text-black">
                      Cash On Delivery
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#2A2A2A] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className={`w-full px-4 py-3.5 border text-sm text-black placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-200 ${
                          errors.fullName
                            ? "border-red-500"
                            : "border-[#2A2A2A] focus:border-black"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2A2A2A] mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="03XX-XXXXXXX"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={`w-full px-4 py-3.5 border text-sm text-black placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-200 ${
                          errors.phone
                            ? "border-red-500"
                            : "border-[#2A2A2A] focus:border-black"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2A2A2A] mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        placeholder="03XX-XXXXXXX (optional)"
                        value={formData.whatsapp}
                        onChange={(e) => updateField("whatsapp", e.target.value)}
                        className={`w-full px-4 py-3.5 border text-sm text-black placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-200 ${
                          errors.whatsapp
                            ? "border-red-500"
                            : "border-[#2A2A2A] focus:border-black"
                        }`}
                      />
                      {errors.whatsapp && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.whatsapp}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2A2A2A] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email (optional)"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={`w-full px-4 py-3.5 border text-sm text-black placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-200 ${
                          errors.email
                            ? "border-red-500"
                            : "border-[#2A2A2A] focus:border-black"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2A2A2A] mb-1.5">
                        Complete Shipping Address{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="House #, Street, Area, Landmark"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className={`w-full px-4 py-3.5 border text-sm text-black placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-200 resize-none ${
                          errors.address
                            ? "border-red-500"
                            : "border-[#2A2A2A] focus:border-black"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2A2A2A] mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className={`w-full px-4 py-3.5 border text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-200 appearance-none ${
                          errors.city
                            ? "border-red-500"
                            : "border-[#2A2A2A] focus:border-black"
                        }`}
                      >
                        <option value="">Select city</option>
                        {cityOptions.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2A2A2A] mb-1.5">
                        Nearest Famous Place
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Nearest famous place (optional)"
                        value={formData.instructions}
                        onChange={(e) => updateField("instructions", e.target.value)}
                        className="w-full px-4 py-3.5 border border-[#2A2A2A] text-sm text-black placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 resize-none"
                      />
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      className="w-full py-4 bg-black text-white text-sm font-medium tracking-wider hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "PLACE ORDER"
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (product) {
                          setShowCheckout(false);
                        } else {
                          handleClose();
                        }
                      }}
                      className="w-full py-3 text-sm text-[#2A2A2A] hover:text-black transition-colors duration-150"
                    >
                      {product ? "Back to product" : "Close"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
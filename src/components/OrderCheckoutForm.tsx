import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BadgePercent, Check, Loader2, Sparkles, X } from "lucide-react";
import type { Product } from "@/data/products";
import { sendOrderToSheets } from "@/lib/orderService";
import { calculateOrderLineTotal, shouldApplyTieredDiscount } from "@/lib/pricing";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { Backdrop } from "@/components/Backdrop";

declare global {
  interface Window {
    fbq?: (event: string, name: string, params?: Record<string, unknown>) => void;
  }
}

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

export interface OrderLineItem {
  product: Product;
  quantity: number;
}

interface OrderCheckoutFormProps {
  orderItems: OrderLineItem[];
  onBack: () => void;
  onComplete: () => void;
  clearCartOnSuccess?: boolean;
  backLabel?: string;
}

export function OrderCheckoutForm({
  orderItems,
  onBack,
  onComplete,
  clearCartOnSuccess = false,
  backLabel = "Back",
}: OrderCheckoutFormProps) {
  const addToast = useToastStore((s) => s.addToast);
  const clearCart = useCartStore((s) => s.clearCart);
  const exitIntentHandledRef = useRef(false);
  const historyShieldRef = useRef(false);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showExitOffer, setShowExitOffer] = useState(false);
  const [exitDiscountApplied, setExitDiscountApplied] = useState(false);
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

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

  const FREE_DELIVERY_PRODUCT_NAMES = new Set([
    "3 in 1 multi functional vegetable cutter",
    "5 in 1 vegetable cutter",
    "5 in 1 stainless steel vegetable cutter",
  ]);

  const totalQuantity = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems]
  );

  const exitDiscountAmount = exitDiscountApplied ? 100 : 0;

  const hasFreeDeliveryProduct = useMemo(() => {
    return orderItems.some((item) => {
      const normalizedProductName = item.product.name.toLowerCase().replace(/\s+/g, " ").trim();

      if (item.product.id === "vegetable-cutter" || item.product.id === "stainless-steel-vegetable-cutter") {
        return true;
      }

      if (shouldApplyTieredDiscount(item.product) && item.quantity >= 2) {
        return true;
      }

      return FREE_DELIVERY_PRODUCT_NAMES.has(normalizedProductName);
    });
  }, [orderItems]);

  const deliveryFee = hasFreeDeliveryProduct ? 0 : 200;

  const orderSummarySubtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      return sum + calculateOrderLineTotal(item.product, item.quantity);
    }, 0);
  }, [orderItems]);

  const orderSummaryTotal = Math.max(
    0,
    Math.round(orderSummarySubtotal + deliveryFee - exitDiscountAmount)
  );

  const orderSummaryOriginalTotal = Math.round(orderSummarySubtotal + deliveryFee);

  const orderProductLabel = useMemo(
    () => orderItems.map((item) => `${item.product.name} x${item.quantity}`).join(" | "),
    [orderItems]
  );

  const orderQuantityLabel = useMemo(
    () => orderItems.map((item) => String(item.quantity)).join(" | "),
    [orderItems]
  );

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

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    const generatedOrderId = `AM-${Date.now().toString(36).toUpperCase()}`;
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
        price: orderSummaryTotal,
        instructions: formData.instructions.trim(),
      });

      setOrderId(generatedOrderId);
      setOrderSuccess(true);

      if (window.fbq) {
        window.fbq("track", "Purchase", {
          value: orderSummaryTotal,
          currency: "PKR",
        });
      }

      if (clearCartOnSuccess) {
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const shieldState = { checkoutExitShield: true };
    window.history.pushState(shieldState, "", window.location.href);
    historyShieldRef.current = true;

    const showOffer = () => {
      if (exitIntentHandledRef.current || exitDiscountApplied) {
        return;
      }

      setShowExitOffer(true);
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        showOffer();
      }
    };

    const handlePopState = () => {
      if (exitIntentHandledRef.current || exitDiscountApplied) {
        return;
      }

      showOffer();
      window.history.pushState(shieldState, "", window.location.href);
    };

    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("popstate", handlePopState);

      if (historyShieldRef.current) {
        window.history.back();
      }
    };
  }, [exitDiscountApplied]);

  const claimExitDiscount = () => {
    exitIntentHandledRef.current = true;
    setExitDiscountApplied(true);
    setShowExitOffer(false);
    addToast("Rs. 100 discount applied", "success");
  };

  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <Check size={32} className="text-green-600" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-semibold text-black">Order Placed Successfully!</h2>
        <p className="mt-2 max-w-md text-center text-sm text-[#2A2A2A]">
          Thank you for your order. We will contact you shortly to confirm.
        </p>
        <p className="mt-4 text-sm font-medium text-black">Order #{orderId}</p>
        <button
          onClick={onComplete}
          className="mt-8 bg-black px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#2A2A2A] active:scale-[0.98]"
          type="button"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] p-4 pt-8 md:p-12 md:pt-12">
      <h2 className="mb-6 text-xl font-semibold text-black md:text-2xl">Order Details</h2>

      {orderItems.length > 0 && (
        <div className="mb-6 bg-[#F3F4F6] p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
            Order Summary
          </p>
          {orderItems.map((item) => {
            const qty = item.quantity;
            const itemSubtotal = calculateOrderLineTotal(item.product, qty);

            return (
              <div key={item.product.id} className="flex justify-between py-1 text-sm">
                <span className="text-black">
                  {item.product.name} x{item.quantity}
                </span>
                <span className="font-medium text-black">
                  {formatPrice(Math.round(itemSubtotal))}
                </span>
              </div>
            );
          })}
          <div className="mt-2 flex justify-between border-t border-[#e5e7eb] pt-2">
            <span className="text-sm font-medium text-black">Subtotal</span>
            <span className="text-base font-semibold text-black">{formatPrice(Math.round(orderSummarySubtotal))}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-sm font-medium text-black">Delivery</span>
            <span className="font-bold text-green-600">
              {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
            </span>
          </div>
          {exitDiscountApplied ? (
            <div className="mb-2 flex justify-between rounded-lg bg-green-50 px-3 py-2 text-sm">
              <span className="font-medium text-green-700">Exit-intent discount</span>
              <span className="font-semibold text-green-700">- {formatPrice(exitDiscountAmount)}</span>
            </div>
          ) : null}
          <div className="mt-2 flex items-center justify-between border-t border-[#e5e7eb] pt-2">
            <span className="text-sm font-medium text-black">Total</span>
            <div className="text-right">
              {exitDiscountApplied ? (
                <span className="mb-0.5 block text-xs font-medium text-[#666] line-through">
                  {formatPrice(orderSummaryOriginalTotal)}
                </span>
              ) : null}
              <span className="text-base font-semibold text-black">
                {formatPrice(orderSummaryTotal)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-black/10 bg-black/5 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">Payment Method</p>
        <p className="mt-1 text-sm font-medium text-black">Cash On Delivery</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2A2A2A]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            className={`w-full border px-4 py-3.5 text-sm text-black placeholder:text-[#2A2A2A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 ${
              errors.fullName ? "border-red-500" : "border-[#2A2A2A] focus:border-black"
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2A2A2A]">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="03XX-XXXXXXX"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={`w-full border px-4 py-3.5 text-sm text-black placeholder:text-[#2A2A2A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 ${
              errors.phone ? "border-red-500" : "border-[#2A2A2A] focus:border-black"
            }`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2A2A2A]">WhatsApp Number</label>
          <input
            type="tel"
            placeholder="03XX-XXXXXXX (optional)"
            value={formData.whatsapp}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            className={`w-full border px-4 py-3.5 text-sm text-black placeholder:text-[#2A2A2A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 ${
              errors.whatsapp ? "border-red-500" : "border-[#2A2A2A] focus:border-black"
            }`}
          />
          {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2A2A2A]">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email (optional)"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={`w-full border px-4 py-3.5 text-sm text-black placeholder:text-[#2A2A2A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 ${
              errors.email ? "border-red-500" : "border-[#2A2A2A] focus:border-black"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2A2A2A]">
            Complete Shipping Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="House #, Street, Area, Landmark"
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            className={`w-full resize-none border px-4 py-3.5 text-sm text-black placeholder:text-[#2A2A2A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 ${
              errors.address ? "border-red-500" : "border-[#2A2A2A] focus:border-black"
            }`}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2A2A2A]">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={`w-full appearance-none border bg-white px-4 py-3.5 text-sm text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 ${
              errors.city ? "border-red-500" : "border-[#2A2A2A] focus:border-black"
            }`}
          >
            <option value="">Select city</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2A2A2A]">Nearest Famous Place</label>
          <textarea
            rows={3}
            placeholder="Enter nearest famous place"
            value={formData.instructions}
            onChange={(e) => updateField("instructions", e.target.value)}
            className="w-full resize-none border border-[#2A2A2A] px-4 py-3.5 text-sm text-black placeholder:text-[#2A2A2A] transition-all duration-200 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 bg-black py-4 text-sm font-medium tracking-wider text-white transition-colors duration-200 hover:bg-[#2A2A2A] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          type="button"
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
          onClick={onBack}
          className="w-full py-3 text-sm text-[#2A2A2A] transition-colors duration-150 hover:text-black"
          type="button"
        >
          {backLabel}
        </button>
      </div>

      {showExitOffer ? (
        <div className="fixed inset-0 z-[260] flex items-end justify-center p-4 md:items-center">
          <Backdrop onClick={() => setShowExitOffer(false)} zIndex={250} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative z-[260] w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#0B0B0B] text-white shadow-2xl shadow-black/30"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(242,169,59,0.18),_transparent_50%)]" />
            <button
              type="button"
              onClick={() => setShowExitOffer(false)}
              className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close offer"
            >
              <X size={16} />
            </button>
            <div className="relative space-y-4 p-5 md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F2A93B] px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                <BadgePercent size={14} />
                Special Checkout Offer
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.02em]">Rs. 100 OFF - Don't Miss Out!</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Complete your order now and unlock an instant checkout discount before leaving.
                </p>
              </div>
              <button
                type="button"
                onClick={claimExitDiscount}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F2A93B] px-4 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.01]"
              >
                <Sparkles size={16} />
                Claim Rs. 100 Discount
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
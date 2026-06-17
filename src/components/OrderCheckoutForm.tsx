import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { Product } from "@/data/products";
import { sendOrderToSheets } from "@/lib/orderService";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";

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

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const totalQuantity = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems]
  );

  const hasFreeDeliveryProduct = useMemo(() => {
    return orderItems.some((item) => {
      const productName = item.product.name.toLowerCase();
      
      if ('freeDelivery' in item.product && item.product.freeDelivery) {
        return true;
      }

      // Apne free delivery products ke keywords yahan daal sakte hain
      return (
        productName.includes("cutter") || 
        productName.includes("dusra-product-yahan-likhein")
      );
    });
  }, [orderItems]);

  const calculatedDeliveryCharge = (totalQuantity >= 2 || hasFreeDeliveryProduct) ? 0 : 200;

  const orderSummarySubtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      const basePrice = item.product.price;
      const qty = item.quantity;
      if (qty === 1) return sum + basePrice;
      if (qty === 2) return sum + basePrice * 0.8 * 2;
      if (qty >= 3) return sum + basePrice * 0.7 * qty;
      return sum;
    }, 0);
  }, [orderItems]);

  const orderSummaryTotal = Math.round(orderSummarySubtotal + calculatedDeliveryCharge);

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
            const basePrice = item.product.price;
            let itemSubtotal = basePrice;
            if (qty === 2) itemSubtotal = basePrice * 0.8 * 2;
            if (qty >= 3) itemSubtotal = basePrice * 0.7 * qty;

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
              {calculatedDeliveryCharge === 0 ? "Free" : formatPrice(calculatedDeliveryCharge)}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[#e5e7eb] pt-2">
            <span className="text-sm font-medium text-black">Total</span>
            <span className="text-base font-semibold text-black">
              {formatPrice(orderSummaryTotal)}
            </span>
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
    </div>
  );
}
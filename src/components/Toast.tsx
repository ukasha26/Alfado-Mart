import { useToastStore } from "@/stores/toastStore";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-4 md:bottom-6 inset-x-2 md:left-1/2 md:right-auto md:inset-x-auto md:-translate-x-1/2 z-[500] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full md:w-auto max-w-full flex items-center gap-2 bg-black text-white px-4 md:px-6 py-3 text-sm font-medium shadow-lg"
          >
            {toast.type === "success" && <CheckCircle size={16} className="text-green-400" />}
            {toast.type === "error" && <XCircle size={16} className="text-red-400" />}
            {toast.type === "info" && <Info size={16} className="text-blue-400" />}
            <span className="truncate">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

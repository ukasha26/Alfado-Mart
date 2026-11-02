import { motion } from "framer-motion";

interface BackdropProps {
  onClick: () => void;
  zIndex?: number;
}

export function Backdrop({ onClick, zIndex = 200 }: BackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black"
      style={{ zIndex }}
      onClick={onClick}
    />
  );
}

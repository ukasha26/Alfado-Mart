import { useEffect } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useUIStore } from "@/stores/uiStore";

export function ProductRoute() {
  // useMatch allows us to capture parameters even when rendered outside the main Routes tree
  const match = useMatch("/product/:id");
  const id = match?.params.id;
  const navigate = useNavigate();

  const openProductModal = useUIStore((s) => s.openProductModal);
  const closeProductModal = useUIStore((s) => s.closeProductModal);
  const selectedProductId = useUIStore((s) => s.selectedProductId);

  const productExists = !!id && products.some((p) => p.id === id);

  useEffect(() => {
    if (id) {
      if (productExists) {
        openProductModal(id);
      } else {
        // Handle invalid product IDs by redirecting to home
        closeProductModal();
        navigate("/", { replace: true });
      }
    } else if (selectedProductId) {
      // Automatically close modal if the URL no longer matches a product (e.g. browser back)
      closeProductModal();
    }
  }, [id, productExists, openProductModal, closeProductModal, navigate, selectedProductId]);

  // Layout stays on the same App; ProductModal is a modal overlay.
  // This component only ensures state is synchronized to the route.
  return null;
}

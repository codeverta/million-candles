// hooks/useProduct.ts

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getRelationships } from "utils";

/**
 * Custom hook to manage product-related client-side state
 * @param {object} initialProduct - The product data fetched on the server
 */
export default function useProduct(initialProduct) {
  const [product, setProduct] = useState(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  // ====================================================================
  // INI SOLUSINYA:
  // Gunakan useEffect untuk "mendengarkan" perubahan pada initialProduct.
  // Jika prop initialProduct dari halaman berubah, update state internal hook ini.
  // ====================================================================
  useEffect(() => {
    // 1. Update state 'product' internal dengan data produk yang baru.
    setProduct(initialProduct);

    // 2. Reset semua state yang berhubungan dengan produk sebelumnya.
    setSelectedVariant(null);
    setQty(1);
    setImagesLoaded(false); // Reset status gambar agar skeleton bisa muncul sebentar
  }, [initialProduct]); // Dependency array: Effect ini akan berjalan setiap kali initialProduct berubah.

  // Handle image loading status (logika ini tetap sama)
  useEffect(() => {
    if (product) {
      const documents =
        product.data[0]?.relationships?.documents.data.length > 0
          ? getRelationships(product, product.data[0], "documents")
          : [];

      if (documents.length === 0) {
        setImagesLoaded(true);
        return;
      }

      // Beri sedikit waktu agar transisi terlihat mulus
      const timer = setTimeout(() => {
        setImagesLoaded(true);
      }, 500); // Anda bisa sesuaikan durasi ini

      return () => clearTimeout(timer);
    }
  }, [product]); // Sekarang ini bergantung pada state 'product' yang sudah benar

  // Sisa logika hook tidak perlu diubah, karena sekarang akan menggunakan
  // state 'product' yang sudah ter-update dengan benar.

  const documents =
    product?.data[0]?.relationships?.documents.data.length > 0
      ? getRelationships(product, product.data[0], "documents")
      : [];

  const isDocumentExist =
    documents.length > 0 && !!documents[0]?.attributes.filename;

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product?.data[0]?.attributes.formattedPrice;

  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product?.data[0]?.attributes.stock;

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const incrementQuantity = () => setQty(qty + 1);
  const decrementQuantity = () => (qty > 1 ? setQty(qty - 1) : null);

  const prepareOrderMessage = () => {
    if (!product) return "";

    let message = `Halo saya ingin memesan \n${product.data[0].attributes.name} (${product.data[0].attributes.code}) ${qty}`;

    if (selectedVariant) {
      message += `\nVariant: ${selectedVariant.sku}`;
    }

    return message;
  };

  return {
    product,
    isLoading,
    imagesLoaded,
    documents,
    isDocumentExist,
    currentPrice,
    currentStock,
    selectedVariant,
    qty,
    handleVariantChange,
    decrementQuantity,
    incrementQuantity,
    prepareOrderMessage,
  };
}

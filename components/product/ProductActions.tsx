import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "context/CartContext";
import { currency } from "lib/currency";

// Format localized product and cart prices.
const formatPrice = (
  price: number,
  currencyCode = "IDR",
  locale: string = "id"
) => {
  const numberLocales: Record<string, string> = {
    id: "id-ID",
    en: "en-US",
    ja: "ja-JP",
    kr: "ko-KR",
    zh: "zh-CN",
  };
  const numberLocale = numberLocales[locale] || "id-ID";
  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: ["IDR", "JPY", "KRW"].includes(currencyCode) ? 0 : 2,
  }).format(price);
};

const ProductActions = ({ product, selectedVariant }: any) => {
  const { addToCart, beginCheckout } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();

  const productAttributes = product?.data[0].attributes;
  const productId = product?.data[0].id;
  const hasVariants =
    (productAttributes?.variant_combinations || []).length > 0;
  const activePrice = Number(
    selectedVariant?.priceInCurrency ??
      selectedVariant?.price ??
      productAttributes?.priceInCurrency ??
      0
  );
  const activeStock = Number(
    selectedVariant?.stock ?? productAttributes?.stock ?? 0
  );
  const currencyCode =
    (currency as Record<string, string>)[router.locale || "id"] || "IDR";
  const currencyLocale = router.locale || "id";

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < activeStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if ((hasVariants && !selectedVariant) || activeStock <= 0) return false;
    // Structure the product data in the format expected by Google Merchant
    const productForCart = {
      id: productId,
      cartKey: `${productId}:${selectedVariant?.id || "base"}`,
      attributes: {
        ...productAttributes,
        item_id: productId,
        item_name: productAttributes.name,
        price: activePrice,
        priceInCurrency: activePrice,
        stock: activeStock,
        currency: currencyCode,
        currencyCode,
        currencyLocale,
        image: productAttributes.thumbnail,
        item_category: "Candles", // You might want to get this from the API
        item_variant: selectedVariant?.sku || "Standard",
        variantCombinationId: selectedVariant?.id || null,
        variantSku: selectedVariant?.sku || null,
        quantity: quantity,
      },
    };

    const wasAdded = addToCart(productForCart, quantity);
    if (wasAdded) setAddedToCart(true);
    return wasAdded ? productForCart : null;
  };

  const handleBuyNow = () => {
    // Add to cart first
    const addedProduct = handleAddToCart();
    if (!addedProduct) return;
    beginCheckout(addedProduct, quantity);
    // Navigate to checkout page
    router.push("/checkout");
  };

  const ActionButtons = () => (
    <div className="flex gap-3 w-full">
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={(hasVariants && !selectedVariant) || activeStock <= 0}
        className="flex-1 bg-white text-green-500 border border-green-500 disabled:opacity-50 font-semibold text-sm py-2.5 px-4 md:py-2.5 md:px-2 rounded-lg hover:bg-gray-50 transition"
      >
        Beli
      </button>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={(hasVariants && !selectedVariant) || activeStock <= 0}
        className="flex-1 bg-green-600 text-white disabled:opacity-50 font-semibold text-sm py-2.5 px-4 md:py-2.5 md:px-2 rounded-lg hover:bg-green-700 transition"
      >
        + Keranjang
      </button>
    </div>
  );

  // Calculate subtotal
  const subtotal = activePrice * quantity;

  return (
    <div className="mx-auto border rounded-lg p-4 relative">
      {addedToCart && (
        <div className="absolute top-0 left-0 right-0 bg-green-100 text-green-700 p-2 rounded-t-lg text-center">
          Produk berhasil ditambahkan ke keranjang!
        </div>
      )}

      <h2 className="text-xl font-semibold mb-6">Atur jumlah dan catatan</h2>

      {/* Quantity selector */}
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={decreaseQuantity}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          aria-label="Decrease quantity"
        >
          <span className="text-lg">−</span>
        </button>
        <span className="mx-4 text-lg">{quantity}</span>
        <button
          type="button"
          onClick={increaseQuantity}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          aria-label="Increase quantity"
          disabled={quantity >= activeStock}
        >
          <span className="text-lg">+</span>
        </button>
        <span className="ml-4 text-amber-500 text-sm font-medium">
          Sisa {activeStock}
        </span>
      </div>

      {/* Pricing information */}
      <div className="mb-4">
        {/* Original price if discounted */}
        {productAttributes?.originalPrice &&
          productAttributes.originalPrice >
            productAttributes.priceInCurrency && (
            <p className="text-right text-sm text-gray-400 line-through">
              {formatPrice(
                productAttributes.originalPrice,
                currencyCode,
                currencyLocale
              )}
            </p>
          )}
        <div className="flex justify-between items-center">
          <span className="text-base">Subtotal</span>
          <span
            className="text-xl font-bold"
            itemProp="price"
            content={isNaN(subtotal) ? "0" : subtotal.toString()}
          >
            {formatPrice(subtotal, currencyCode, currencyLocale)}
          </span>
        </div>
      </div>

      {/* Desktop action buttons */}
      <div className={`mb-6 ${isMobile ? "hidden" : "block"}`}>
        <ActionButtons />
      </div>

      {/* Social actions */}
      {/* <div className="flex border-t border-gray-100 pt-4 text-sm text-gray-600">
        <div className="flex items-center mr-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Chat
        </div>
        <div className="flex items-center mr-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Wishlist
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </div>
      </div> */}

      {/* Mobile sticky footer */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
          <ActionButtons />
        </div>
      )}

      {/* Add spacer at the bottom when on mobile to prevent content from being hidden behind the sticky footer */}
      {isMobile && <div className="h-20"></div>}
    </div>
  );
};

export default ProductActions;

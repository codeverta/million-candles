import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Create Context
export const CartContext = createContext<any>(null);

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate cart totals
  const cartTotal = cart.reduce(
    (total, item) => total + item.attributes.priceInCurrency * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartCurrencyCode = cart[0]?.attributes.currencyCode || "IDR";
  const cartCurrencyLocale = cart[0]?.attributes.currencyLocale || "id";

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from localStorage:", e);
        }
      }
    }
  }, []);

  // Add item to cart
  const addToCart = (product: any, quantity: number) => {
    const productCurrencyCode = product.attributes.currencyCode || "IDR";
    const currentCurrencyCode = cart[0]?.attributes.currencyCode || "IDR";
    if (cart.length > 0 && productCurrencyCode !== currentCurrencyCode) {
      toast.error(
        "Kosongkan keranjang sebelum berbelanja dengan mata uang lain."
      );
      return false;
    }

    // Find if product already exists in cart
    const productCartKey = product.cartKey || String(product.id);
    const existingItemIndex = cart.findIndex(
      (item) => (item.cartKey || String(item.id)) === productCartKey
    );

    let updatedCart;

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      updatedCart = [...cart];
      const availableStock = Number(
        updatedCart[existingItemIndex].attributes.stock ?? Infinity
      );
      updatedCart[existingItemIndex].quantity = Math.min(
        updatedCart[existingItemIndex].quantity + quantity,
        availableStock
      );
    } else {
      // Add new product to cart
      updatedCart = [...cart, { ...product, quantity }];
    }

    // Update state and localStorage
    setCart(updatedCart);

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    // Track add_to_cart event for Google Merchant
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: productCurrencyCode,
          value: product.attributes.priceInCurrency * quantity,
          items: [
            {
              item_id: product.id,
              item_name: product.attributes.name,
              price: product.attributes.priceInCurrency,
              quantity: quantity,
              currency: productCurrencyCode,
              item_category: product.attributes.category || "Candles",
            },
          ],
        },
      });
    }

    // Show cart feedback
    setIsCartOpen(true);

    // Auto-close cart after delay
    setTimeout(() => {
      setIsCartOpen(false);
    }, 3000);
    return true;
  };

  // Remove item from cart
  const removeFromCart = (cartKey: string | number) => {
    const itemToRemove = cart.find(
      (item) => (item.cartKey || String(item.id)) === String(cartKey)
    );

    if (!itemToRemove) return;

    const updatedCart = cart.filter(
      (item) => (item.cartKey || String(item.id)) !== String(cartKey)
    );

    // Update state and localStorage
    setCart(updatedCart);

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Track remove_from_cart event for Google Merchant
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "remove_from_cart",
          ecommerce: {
            currency: itemToRemove.attributes.currencyCode || "IDR",
            value:
              itemToRemove.attributes.priceInCurrency * itemToRemove.quantity,
            items: [
              {
                item_id: itemToRemove.id,
                item_name: itemToRemove.attributes.name,
                price: itemToRemove.attributes.priceInCurrency,
                quantity: itemToRemove.quantity,
                currency: itemToRemove.attributes.currencyCode || "IDR",
              },
            ],
          },
        });
      }
    }
  };

  // Update item quantity
  const updateQuantity = (cartKey: string | number, newQuantity: number) => {
    // Ensure quantity is valid
    if (newQuantity < 1) return;

    const itemIndex = cart.findIndex(
      (item) => (item.cartKey || String(item.id)) === String(cartKey)
    );

    if (itemIndex === -1) return;

    const updatedCart = [...cart];
    const availableStock = Number(
      updatedCart[itemIndex].attributes.stock ?? Infinity
    );
    updatedCart[itemIndex].quantity = Math.min(newQuantity, availableStock);

    // Update state and localStorage
    setCart(updatedCart);

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  };

  // Begin checkout process
  const beginCheckout = (itemToAdd: any = null, quantityToAdd = 0) => {
    let checkoutCart = cart;
    if (itemToAdd) {
      const itemToAddKey = itemToAdd.cartKey || String(itemToAdd.id);
      const existingIndex = cart.findIndex(
        (item) => (item.cartKey || String(item.id)) === itemToAddKey
      );
      checkoutCart = [...cart];
      if (existingIndex >= 0) {
        const availableStock = Number(
          checkoutCart[existingIndex].attributes.stock ?? Infinity
        );
        checkoutCart[existingIndex] = {
          ...checkoutCart[existingIndex],
          quantity: Math.min(
            checkoutCart[existingIndex].quantity + quantityToAdd,
            availableStock
          ),
        };
      } else {
        checkoutCart.push({ ...itemToAdd, quantity: quantityToAdd });
      }
    }
    const checkoutTotal = checkoutCart.reduce(
      (total, item) => total + item.attributes.priceInCurrency * item.quantity,
      0
    );
    const checkoutCurrency =
      checkoutCart[0]?.attributes.currencyCode || cartCurrencyCode;

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: checkoutCurrency,
          value: checkoutTotal,
          items: checkoutCart.map((item) => ({
            item_id: item.id,
            item_name: item.attributes.name,
            price: item.attributes.priceInCurrency,
            quantity: item.quantity,
            currency: item.attributes.currencyCode || checkoutCurrency,
          })),
        },
      });
    }

    // You would typically navigate to checkout page here
    // router.push('/checkout');
  };

  // Complete purchase
  const completePurchase = (transactionId: string | number) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: transactionId,
          currency: cartCurrencyCode,
          value: cartTotal,
          tax: 0, // Add actual tax if applicable
          shipping: 0, // Add actual shipping if applicable
          items: cart.map((item) => ({
            item_id: item.id,
            item_name: item.attributes.name,
            price: item.attributes.priceInCurrency,
            quantity: item.quantity,
            currency: item.attributes.currencyCode || cartCurrencyCode,
          })),
        },
      });
    }

    // Clear cart after purchase
    clearCart();
  };

  // Format using the currency attached when the product entered the cart.
  const formatPrice = (price: number) => {
    const numberLocales: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ja: "ja-JP",
      kr: "ko-KR",
      zh: "zh-CN",
    };
    const numberLocale = numberLocales[cartCurrencyLocale] || "id-ID";
    return new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency: cartCurrencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: ["IDR", "JPY", "KRW"].includes(cartCurrencyCode)
        ? 0
        : 2,
    }).format(price);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        beginCheckout,
        completePurchase,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartItemsCount,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

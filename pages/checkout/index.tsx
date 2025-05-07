import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "context/CartContext";
import Layout from "components/layout/Landing"; // Adjust import path as needed

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, cartTotal, formatPrice, clearCart, completePurchase } =
    useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "bank_transfer",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.fullName.trim())
      newErrors.fullName = "Nama lengkap wajib diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }

    if (!formData.address.trim()) newErrors.address = "Alamat wajib diisi";
    if (!formData.city.trim()) newErrors.city = "Kota wajib diisi";
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Kode pos wajib diisi";
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Format kode pos tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);

    try {
      // Generate a transaction ID
      const transactionId = "TRX-" + Date.now();

      // In a real app, you would send this data to your backend
      // const response = await fetch('/api/create-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     customer: formData,
      //     items: cart,
      //     total: cartTotal,
      //     transactionId
      //   })
      // });

      // if (!response.ok) throw new Error('Order creation failed');
      // const orderData = await response.json();

      // For demo, simulate a successful order

      // Track purchase event for Google Merchant
      completePurchase(transactionId);

      // Redirect to success page
      router.push({
        pathname: "/checkout/success",
        query: {
          transactionId,
          amount: cartTotal,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty and we're still on this page, show loading
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Customer Information Form */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Pembeli</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap*
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 error-message">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nomor Telepon*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 error-message">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alamat Lengkap*
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kota*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 error-message">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kode Pos*
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1 error-message">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Metode Pembayaran</h3>

                <div className="space-y-3">
                  <label className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === "bank_transfer"}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium">Transfer Bank</p>
                      <p className="text-sm text-gray-600">
                        Pembayaran melalui transfer bank. Instruksi pembayaran
                        akan dikirim melalui email.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e_wallet"
                      checked={formData.paymentMethod === "e_wallet"}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium">E-Wallet</p>
                      <p className="text-sm text-gray-600">
                        Pembayaran melalui dompet digital (GoPay, OVO, DANA,
                        LinkAja).
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium">Bayar di Tempat (COD)</p>
                      <p className="text-sm text-gray-600">
                        Pembayaran dilakukan saat pesanan tiba. Hanya tersedia
                        untuk wilayah tertentu.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-8 md:hidden">
                <OrderSummary
                  cart={cart}
                  cartTotal={cartTotal}
                  formatPrice={formatPrice}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Memproses..." : "Selesaikan Pembelian"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3 hidden md:block">
          <OrderSummary
            cart={cart}
            cartTotal={cartTotal}
            formatPrice={formatPrice}
          />
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ cart, cartTotal, formatPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

      <div className="divide-y">
        {cart.map((item) => (
          <div key={item.id} className="py-3 flex items-center">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              {item.attributes.image && (
                <img
                  src={item.attributes.image}
                  alt={item.attributes.name}
                  className="w-full h-full object-cover"
                />
              )}
              {!item.attributes.image && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="ml-4 flex-grow">
              <h3 className="font-medium">{item.attributes.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              <p className="font-medium">
                {formatPrice(item.attributes.priceInCurrency * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Pajak</span>
          <span>Termasuk</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Pengiriman</span>
          <span>Gratis</span>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Pemberitahuan:</span> Pesanan Anda
            akan diproses dan dikirimkan dalam 1-3 hari kerja setelah pembayaran
            berhasil dikonfirmasi.
          </p>
        </div>
      </div>
    </div>
  );
};

CheckoutPage.getLayout = function (page) {
  return <Layout>{page}</Layout>;
};

export default CheckoutPage;

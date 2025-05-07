import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "context/CartContext";
import Layout from "components/layout/Landing";

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const { transactionId, amount } = router.query;
  const { formatPrice } = useCart();

  // Redirect if no transaction ID
  useEffect(() => {
    if (!transactionId && router.isReady) {
      router.push("/");
    }
  }, [transactionId, router]);

  if (!transactionId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Pesanan Berhasil!
          </h1>
          <p className="text-gray-600 mt-2">
            Terima kasih atas pembelian Anda. Detail pesanan telah dikirim ke
            email Anda.
          </p>
        </div>

        <div className="border rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">ID Transaksi:</span>
            <span className="font-medium">{transactionId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Total Pembayaran:</span>
            <span className="font-medium">
              {amount && formatPrice(Number(amount))}
            </span>
          </div>
        </div>

        {/* Instructions based on payment method would go here */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">
            Instruksi Pembayaran
          </h3>
          <p className="text-sm text-yellow-700">
            Silakan lakukan pembayaran dalam waktu 24 jam untuk menghindari
            pembatalan pesanan otomatis. Detail instruksi pembayaran telah
            dikirim ke email Anda.
          </p>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/orders"
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Lihat Pesanan Saya
          </Link>

          <Link
            href="/"
            className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

CheckoutSuccessPage.getLayout = function (page) {
  return <Layout>{page}</Layout>;
};

export default CheckoutSuccessPage;

import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import api from "utils/api";
import { getRelationship, getRelationships } from "utils";

const PrintOrder = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: () => {
      return api.get(`orders/${router.query.id}`, {
        include: "order-details.products,destination-users",
      });
    },
    onError: (err) => {
      return err;
    },
    refetchOnWindowFocus: false,
  });

  const orderData = getOrder.data?.data;
  const ordersGate = getOrder.isLoading || getOrder.isError;

  // Get order details relationship
  const orderDetails = useMemo(
    () =>
      getOrder.data
        ? getRelationships(orderData, orderData.data, "order-details")
        : null,
    [orderData]
  );
  if (orderData) {
    console.log(orderDetails);
  }
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Helper function to get product data
  const getProductForOrderDetail = (orderDetail) => {
    if (!orderData) return null;

    const productRelationship = orderDetail.relationships.products.data;
    return orderData.included?.find(
      (item) => item.type === "products" && item.id === productRelationship.id
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (loading || ordersGate) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!orderData || !orderDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        No order data found
      </div>
    );
  }

  const order = orderData.data.attributes;

  return (
    <div
      className="bg-white mx-auto"
      style={{ width: "210mm", minHeight: "297mm" }}
    >
      {/* Print Container */}
      <div className="p-4 border border-gray-800 rounded">
        {/* Header */}
        <div className="flex items-center mb-2 border-b border-black pb-1">
          <div className="mr-2">
            <div className="rounded-full border-2 border-red-600 w-12 h-12 flex items-center justify-center text-red-600 font-bold text-base">
              <span>MC</span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-red-600">
              UD MILLION CANDLES
            </h1>
            <p className="text-sm uppercase font-semibold">
              Menjual Berbagai Lilin Hias dan Aromaterapi
            </p>
            <p className="text-xs">
              Gg Melati 08E, Jl Kaliurang Km 9.3, Sleman - Yogyakarta 55581
            </p>
            <p className="text-xs">Telp. 081578956156</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex justify-between text-sm mb-2">
          <div>
            <p className="font-semibold">NOTA KONTAN NO. {order.code}</p>
          </div>
          <div className="text-right">
            <p>Yogyakarta, {formatDate(order.createdAt)}</p>
            <p>
              Kepada: <span className="font-semibold">{order.buyer_name}</span>
            </p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="mb-2">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-y border-black">
                <th className="text-left py-2 px-2 w-24">Qty</th>
                <th className="text-left py-2 px-2">Nama Barang</th>
                <th className="text-right py-2 px-2 w-32">Harga</th>
                <th className="text-right py-2 px-2 w-32">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((orderDetail, index) => {
                const product = getProductForOrderDetail(orderDetail);
                // Get variant combination data
                const variantCombination =
                  orderDetail.attributes.variantCombination || {};

                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-2">{orderDetail.attributes.qty}</td>
                    <td className="py-2 px-2">
                      ({product?.attributes.code}) {product?.attributes.name} (
                      {variantCombination.variant_sku})
                    </td>
                    <td className="text-right py-2 px-2">
                      {formatCurrency(orderDetail.attributes.price)}
                    </td>
                    <td className="text-right py-2 px-2">
                      {formatCurrency(
                        orderDetail.attributes.price *
                          orderDetail.attributes.qty
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Add empty rows for compactness */}
              {[...Array(5 - orderDetails.length)].map((_, index) => (
                <tr key={`empty-${index}`} className="border-b border-gray-200">
                  <td className="py-2 px-2">&nbsp;</td>
                  <td className="py-2 px-2">&nbsp;</td>
                  <td className="py-2 px-2">&nbsp;</td>
                  <td className="py-2 px-2">&nbsp;</td>
                </tr>
              ))}

              {/* Subtotal, Discount, Down Payment, Remaining Payment */}
              <tr className="border-t border-black">
                <td colSpan="2" className="py-2 px-2"></td>
                <td className="text-right py-2 px-2 font-semibold">
                  Subtotal:
                </td>
                <td className="text-right py-2 px-2 font-semibold">
                  {formatCurrency(order.price_amount)}
                </td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td colSpan="2" className="py-2 px-2"></td>
                  <td className="text-right py-2 px-2">
                    Discount:{" "}
                    {order.discount_type === "percentage"
                      ? `${order.discount}%`
                      : formatCurrency(order.discount)}
                  </td>
                  <td className="text-right py-2 px-2">
                    {order.discount_type === "percentage"
                      ? formatCurrency(
                          (order.price_amount * order.discount) / 100
                        )
                      : formatCurrency(order.discount)}
                  </td>
                </tr>
              )}
              {order.down_payment > 0 && (
                <tr>
                  <td colSpan="2" className="py-2 px-2"></td>
                  <td className="text-right py-2 px-2">Uang Muka:</td>
                  <td className="text-right py-2 px-2">
                    {formatCurrency(order.down_payment)}
                  </td>
                </tr>
              )}
              <tr className="border-t border-black">
                <td colSpan="1" className="py-2 px-2"></td>
                <td colSpan={2} className="text-right py-2 px-2 font-semibold">
                  Sisa Pembayaran:
                </td>
                <td className="text-right py-2 px-2 font-semibold">
                  {formatCurrency(order.remaining_payment)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-4 text-sm">
          <div className="w-1/3">
            <p className="font-semibold mb-8">Tanda Terima,</p>
            <p>____________________</p>
          </div>

          <div className="w-1/3 text-center">
            <div className="border border-black p-1 text-xs text-center">
              <p>
                Terima kasih atas kepercayaan Anda berbelanja di UD Million
                Candles.
              </p>
            </div>
          </div>

          <div className="w-1/3 text-right">
            <p className="font-semibold mb-8">Hormat kami,</p>
            <p className="">____________________</p>
          </div>
        </div>
      </div>

      {/* Print Button - Only visible on screen, not when printing */}
      <div className="print:hidden mt-4 text-center">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Print Nota
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintOrder;

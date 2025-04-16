import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import api from "utils/api";
import { useRouter } from "next/router";
import { getRelationship, getRelationships } from "utils";

const PrintOrder = () => {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const [state, setState] = useState({
    airwaybill: "",
  });
  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: () => {
      return api.get(`orders/${router.query.id}`, {
        include: "order-details.products,destination-users",
      });
    },
    onError: (err: any) => {
      return err;
    },
    refetchOnWindowFocus: false,
  });
  const orderData = getOrder.data?.data;
  const ordersGate = getOrder.isLoading || getOrder.isError;
  const orderDetails = useMemo(
    () =>
      !ordersGate
        ? getRelationships(
            getOrder.data.data,
            getOrder.data.data.data,
            "order-details"
          )
        : null,
    [getOrder]
  );

  React.useEffect(() => {
    // In a real application, this would be fetched from an API
    // For this example, we're using the provided data
    const mockData = {
      jsonapi: {
        version: "1.0",
      },
      links: {
        self: "http://localhost:8000/api/v1/orders/20",
      },
      data: {
        type: "orders",
        id: "20",
        attributes: {
          code: "INVPFTMAS20",
          order_type: "sell",
          snap_token: null,
          airwaybill: null,
          payments_type: "cash",
          buyer_name: "Linda",
          price_amount: 180000,
          is_validate_seller: true,
          is_validate_buyer: false,
          is_shipping: false,
          is_shipped: false,
          is_received: false,
          discount: 0,
          shipping_cost: 0,
          discount_type: "percentage",
          down_payment: 0,
          remaining_payment: 180000,
          createdAt: "2025-04-16T11:37:13.000000Z",
          updatedAt: "2025-04-16T11:37:13.000000Z",
        },
        relationships: {
          "order-details": {
            data: [
              {
                type: "order-details",
                id: "24",
              },
            ],
          },
        },
      },
      included: [
        {
          type: "order-details",
          id: "24",
          attributes: {
            qty: 30,
            price: 6000,
            total_price: null,
          },
          relationships: {
            products: {
              data: {
                type: "products",
                id: "1",
              },
            },
          },
        },
        {
          type: "products",
          id: "1",
          attributes: {
            name: "Million Kecil",
            code: "MK",
            price: 6000,
          },
        },
      ],
    };

    setLoading(false);
  }, []);

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

  if (!orderData) {
    return (
      <div className="flex items-center justify-center h-full">
        No order data found
      </div>
    );
  }

  const order = orderData.data.attributes;
  const product = orderData.included.find((item) => item.type === "products");

  // Check if optional fields exist and have non-zero values
  const hasDiscount = order.discount !== undefined && order.discount > 0;
  const hasShippingCost =
    order.shipping_cost !== undefined && order.shipping_cost > 0;
  const hasDownPayment =
    order.down_payment !== undefined && order.down_payment > 0;
  const hasDiscountType =
    order.discount_type !== undefined && order.discount_type !== "";

  return (
    <div
      className="w-full bg-white mx-auto"
      style={{ maxWidth: "97mm", height: "140mm" }}
    >
      {/* Print Container */}
      <div className="p-4 border border-gray-300 rounded shadow">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">INVOICE</h1>
          <div className="text-sm">{order.code}</div>
          <div className="text-xs mt-1">{formatDate(order.createdAt)}</div>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <div className="text-sm">
            <span className="font-semibold">Customer:</span> {order.buyer_name}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Payment Method:</span>{" "}
            {order.payments_type}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1">Item</th>
                <th className="text-right py-1">Qty</th>
                <th className="text-right py-1">Price</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((orderDetail: any) => {
                const product = getRelationship(
                  getOrder.data.data,
                  orderDetail,
                  "products"
                );
                return (
                  <tr className="border-b border-gray-200">
                    <td className="py-1">
                      {product.attributes.name} ({product.attributes.code})
                    </td>
                    <td className="text-right py-1">
                      {orderDetail.attributes.qty}
                    </td>
                    <td className="text-right py-1">
                      {formatCurrency(orderDetail.attributes.price)}
                    </td>
                    <td className="text-right py-1">
                      {formatCurrency(
                        orderDetail.attributes.price *
                          orderDetail.attributes.qty
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.price_amount)}</span>
          </div>

          {/* Conditionally show these fields only if they exist and have non-zero values */}
          {hasDiscount && (
            <div className="flex justify-between text-sm">
              <span>
                Discount {hasDiscountType ? `(${order.discount_type})` : ""}:
              </span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}

          {hasShippingCost && (
            <div className="flex justify-between text-sm">
              <span>Shipping Cost:</span>
              <span>{formatCurrency(order.shipping_cost)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300">
            <span>Total:</span>
            <span>{formatCurrency(order.price_amount)}</span>
          </div>

          {hasDownPayment && (
            <>
              <div className="flex justify-between text-sm mt-2">
                <span>Down Payment:</span>
                <span>{formatCurrency(order.down_payment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining Payment:</span>
                <span>{formatCurrency(order.remaining_payment)}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-center mt-6 pt-2 border-t border-gray-300">
          <p>Thank you for your purchase!</p>
        </div>
      </div>

      {/* Print Button - Only visible on screen, not when printing */}
      <div className="print:hidden mt-4 text-center">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Print Invoice
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            width: 97mm;
            height: 140mm;
            margin: 0;
            padding: 0;
          }
          @page {
            size: 97mm 140mm;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintOrder;

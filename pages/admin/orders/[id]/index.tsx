import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "components/layout/AdminLayout";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import api from "utils/api";
import dayjs from "dayjs";
import { getRelationship, getRelationships, toCurrency } from "utils";
import { toast } from "sonner";
import { getOrderStatus } from "utils/orders";
import PrintIcon from "@mui/icons-material/Print";

function OrderDetail() {
  const router = useRouter();
  const [state, setState] = useState({
    airwaybill: "",
  });

  const handlePrint = () => {
    router.push(`/admin/orders/${router.query.id}/print`);
  };

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
  const ordersGate = getOrder.isLoading || getOrder.isError;
  const orders = useMemo(
    () => (!ordersGate ? getOrder.data.data : null),
    [getOrder]
  );
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

  const handleSendOrder = () => {
    api
      .patch(`orders/${router.query.id}`, {
        data: {
          id: router.query.id,
          type: "orders",
          attributes: {
            is_shipping: true,
            airwaybill: state.airwaybill,
          },
        },
      })
      .then(() => {
        getOrder.refetch();
        toast.success("Penjualan Berhasil dikirim");
      })
      .catch((e) => {
        toast.error(JSON.stringify(e));
      });
  };

  const handleVerifyOrder = () => {
    api
      .patch(`orders/${router.query.id}`, {
        data: {
          id: router.query.id,
          type: "orders",
          attributes: {
            is_validate_seller: true,
          },
        },
      })
      .then(() => {
        getOrder.refetch();
        toast.success("Penjualan Berhasil Terverifikasi");
      })
      .catch((e) => {
        toast.error(JSON.stringify(e));
      });
  };

  const handleCompleteOrder = () => {
    api
      .patch(`orders/${router.query.id}`, {
        data: {
          id: router.query.id,
          type: "orders",
          attributes: {
            is_received: true,
            is_shipped: true,
          },
        },
      })
      .then(() => {
        getOrder.refetch();
        toast.success("Berhasil Menyelesaikan Penjualan");
      })
      .catch((e) => {
        toast.error(JSON.stringify(e));
      });
  };

  if (ordersGate) {
    return <LoadingBackdrop />;
  }

  const is_shipping = orders.data.attributes.is_shipping;
  const is_received = orders.data.attributes.is_received;
  const is_validate_seller = orders.data.attributes.is_validate_seller;
  const is_validate_buyer = orders.data.attributes.is_validate_buyer;

  return (
    <div className="pb-20">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>NO. INVOICE</TableCell>
            <TableCell>{orders.data.attributes.code}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Dibuat Pada</TableCell>
            <TableCell>
              {dayjs(orders.data.attributes.createdAt).format("LLLL")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pembeli</TableCell>
            <TableCell>
              {orders.data.attributes.buyer_name ??
                (getRelationship(
                  orders,
                  orders.data,
                  "destination-users",
                  "users"
                )?.attributes?.email ||
                  "N/A")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Status Penjualan</TableCell>
            <TableCell>
              <Chip
                label={getOrderStatus(orders.data).text}
                color={getOrderStatus(orders.data).color}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Metode Pembayaran</TableCell>
            <TableCell>{orders.data.attributes.payments_type}</TableCell>
          </TableRow>
          {orders.data.attributes.airwaybill && (
            <TableRow>
              <TableCell>Airwaybill</TableCell>
              <TableCell>
                {orders.data.attributes.airwaybill ?? "N/A"}
              </TableCell>
            </TableRow>
          )}
          {orders.data.attributes.discount > 0 && (
            <TableRow>
              <TableCell>Diskon</TableCell>
              <TableCell>
                {orders.data.attributes.discount}{" "}
                {orders.data.attributes.discount_type == "percentage"
                  ? "%"
                  : "IDR"}
              </TableCell>
            </TableRow>
          )}
          {orders.data.attributes.down_payment > 0 && (
            <TableRow>
              <TableCell>Uang Muka</TableCell>
              <TableCell>
                {toCurrency(orders.data.attributes.down_payment)}
              </TableCell>
            </TableRow>
          )}
          {orders.data.attributes.remaining_payment > 0 && (
            <TableRow>
              <TableCell>Sisa Pembayaran</TableCell>
              <TableCell>
                {toCurrency(orders.data.attributes.remaining_payment)}
              </TableCell>
            </TableRow>
          )}
          {orders.data.attributes.shipping_cost > 0 && (
            <TableRow>
              <TableCell>Biaya Pengiriman</TableCell>
              <TableCell>
                {toCurrency(orders.data.attributes.shipping_cost)}
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell style={{ verticalAlign: "top" }}>
              Detail Produk
            </TableCell>
            <TableCell></TableCell>
          </TableRow>

          {orderDetails.map((orderDetail: any) => {
            const products = getRelationship(
              getOrder.data.data,
              orderDetail,
              "products"
            );

            // Get variant combination data
            const variantCombination =
              orderDetail.attributes.variantCombination || {};

            return (
              <React.Fragment key={orderDetail.id}>
                <TableRow className="bg-gray-50">
                  <TableCell>
                    <p className="pl-4 font-medium">
                      - ({products.attributes.code}) {products.attributes.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    {toCurrency(orderDetail.attributes.price)} x{" "}
                    {orderDetail.attributes.qty}
                  </TableCell>
                </TableRow>

                {/* Variant Information Row */}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={2}>
                    <Box className="pl-8 py-2">
                      <Typography variant="subtitle2" className="mb-1">
                        Variant:{" "}
                        <span className="font-normal">
                          {orderDetail.attributes.variantSku || "N/A"}
                        </span>
                      </Typography>

                      {/* Product Variants Info */}
                      {products.attributes.product_variants && (
                        <Box className="ml-2 mt-2">
                          <Typography
                            variant="caption"
                            className="text-gray-600"
                          >
                            Product Variants:
                          </Typography>
                          <Box className="flex flex-wrap gap-2 mt-1">
                            {products.attributes.product_variants.map(
                              (variant: any) => (
                                <Box
                                  key={variant.id}
                                  className="bg-blue-50 p-2 rounded border border-blue-100"
                                >
                                  <Typography
                                    variant="body2"
                                    className="font-medium"
                                  >
                                    {variant.name}:
                                  </Typography>
                                  <Box className="flex flex-wrap gap-1 mt-1">
                                    {variant.product_variant_option.map(
                                      (option: any) => (
                                        <Chip
                                          key={option.id}
                                          label={option.name}
                                          size="small"
                                          variant="outlined"
                                          className="text-xs"
                                        />
                                      )
                                    )}
                                  </Box>
                                </Box>
                              )
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Selected Variant Combination */}
                      {variantCombination && variantCombination.sku && (
                        <Box className="ml-2 mt-3 p-2 bg-green-50 rounded border border-green-100">
                          <Typography
                            variant="caption"
                            className="text-gray-600"
                          >
                            Selected Variant Combination:
                          </Typography>
                          <Box className="mt-1">
                            <Typography variant="body2">
                              <span className="font-medium">SKU:</span>{" "}
                              {variantCombination.sku}
                            </Typography>
                            <Typography variant="body2">
                              <span className="font-medium">Price:</span>{" "}
                              {toCurrency(parseFloat(variantCombination.price))}
                            </Typography>
                            {variantCombination.values &&
                              variantCombination.values.length > 0 && (
                                <Box className="mt-1">
                                  <Typography
                                    variant="caption"
                                    className="font-medium"
                                  >
                                    Selected Options:
                                  </Typography>
                                  <Box className="flex flex-wrap gap-1 mt-1">
                                    {variantCombination.values.map(
                                      (value: any) =>
                                        value.product_variant_option && (
                                          <Chip
                                            key={value.id}
                                            label={`${
                                              value.product_variant_option
                                                .product_variant?.name || ""
                                            }: ${
                                              value.product_variant_option.name
                                            }`}
                                            size="small"
                                            color="primary"
                                            className="text-xs"
                                          />
                                        )
                                    )}
                                  </Box>
                                </Box>
                              )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="p-1">
                    <Divider />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
          <TableRow>
            <TableCell>Total Pembayaran</TableCell>
            <TableCell>
              {toCurrency(getOrder.data.data.data.attributes.price_amount)}
            </TableCell>
          </TableRow>
          {getOrder.data.data.data.attributes.is_validate_seller && (
            <TableRow>
              <TableCell colSpan={2}>
                <TextField
                  className="w-full"
                  onChange={(e: any) =>
                    setState({ ...state, airwaybill: e.target.value })
                  }
                  disabled={!!getOrder.data.data.data.attributes.airwaybill}
                  value={orders.data.attributes.airwaybill ?? state.airwaybill}
                  label="No Resi"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2 mt-4">
        {is_validate_buyer && !is_validate_seller && (
          <Button
            onClick={!is_shipping ? handleVerifyOrder : undefined}
            variant="contained"
            size="large"
            disabled={is_shipping}
            className={`w-full ${!is_shipping ? "bg-blue-500" : "bg-blue-900"}`}
          >
            Verifikasi Penjualan
          </Button>
        )}

        {is_validate_seller && (
          <Button
            onClick={!is_shipping ? handleSendOrder : undefined}
            variant="contained"
            size="large"
            disabled={is_shipping || !!!state.airwaybill}
            className={`w-full ${!is_shipping ? "bg-blue-500" : "bg-blue-900"}`}
          >
            {!is_shipping ? "Kirim" : "Terkirim"}
          </Button>
        )}

        {is_shipping && (
          <Button
            onClick={handleCompleteOrder}
            variant="contained"
            color="success"
            size="large"
            disabled={is_received}
            className={`w-full bg-yellow-500 my-1 hover:bg-yellow-600`}
          >
            Selesaikan Penjualan
          </Button>
        )}

        <Button
          onClick={handlePrint}
          variant="outlined"
          startIcon={<PrintIcon />}
          className="w-full"
        >
          Print Invoice
        </Button>
      </div>
    </div>
  );
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default OrderDetail;

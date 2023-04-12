import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
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

function OrderDetail() {
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
    <div>
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
                getRelationship(
                  orders,
                  orders.data,
                  "destination-users",
                  "users"
                ).attributes.email}
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
            return (
              <TableRow className="bg-gray-50" key={orderDetail.id}>
                <TableCell>
                  <p className="pl-4">- {products.attributes.name}</p>
                </TableCell>
                <TableCell>
                  {toCurrency(orderDetail.attributes.price)} x{" "}
                  {orderDetail.attributes.qty}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>Total Pembayaran</TableCell>
            <TableCell>
              {toCurrency(getOrder.data.data.data.attributes.price_amount)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <TextField
                className="w-full"
                onChange={(e: any) =>
                  setState({ ...state, airwaybill: e.target.value })
                }
                disabled={!!getOrder.data.data.data.attributes.airwaybill}
                value={orders.data.attributes.airwaybill}
                label="No Resi"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

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
    </div>
  );
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default OrderDetail;

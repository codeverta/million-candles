import { Button, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "components/layout/AdminLayout";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import api from "utils/api";
import dayjs from "dayjs";
import { getRelationship, getRelationships, toCurrency } from "utils";
import { toast } from "sonner";

function OrderDetail() {
  const router = useRouter();
  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: () => {
      return api.get(`orders/${router.query.id}`, {
        include: "order-details.products,destination-users",
      });
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

  if (ordersGate) {
    return <LoadingBackdrop />;
  }

  const is_shipping = orders.data.attributes.is_shipping;

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>No. Invoice</TableCell>
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
            <TableCell style={{ verticalAlign: "top" }}>
              Detail Produk
            </TableCell>
            <TableCell></TableCell>
          </TableRow>

          {orderDetails.map((orderDetail: any) => {
            console.log({ orderDetail });
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
        </TableBody>
      </Table>
      <Button
        onClick={!is_shipping ? handleSendOrder : undefined}
        variant="contained"
        size="large"
        disabled={is_shipping}
        className={`w-full ${!is_shipping ? "bg-blue-500" : "bg-blue-900"}`}
      >
        {!is_shipping ? "Kirim" : "Terkirim"}
      </Button>
    </div>
  );
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default OrderDetail;

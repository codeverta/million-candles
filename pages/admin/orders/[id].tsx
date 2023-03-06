import { Button, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "components/layout/AdminLayout";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import api from "utils/api";
import dayjs from "dayjs";
import { getRelationship, getRelationships, toCurrency } from "utils";

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

  if (ordersGate) {
    return <LoadingBackdrop />;
  }

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>NO INVOICE</TableCell>
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
                getRelationship(orders, orders.data, "destination-user")
                  .attributes.name}
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
              <TableRow key={orderDetail.id}>
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
      <Button variant="contained" size="large" className="w-full bg-blue-500">
        Kirim
      </Button>
    </div>
  );
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default OrderDetail;

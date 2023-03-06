import { Button, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "components/layout/AdminLayout";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import api from "utils/api";
import dayjs from "dayjs";

function OrderDetail() {
  const router = useRouter();
  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: () => {
      return api.get(`orders/${router.query.id}`, {
        include: "order-details.products",
      });
    },
    refetchOnWindowFocus: false,
  });
  const ordersGate = getOrder.isLoading || getOrder.isError;
  const orders = useMemo(
    () => (!ordersGate ? getOrder.data.data : null),
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
        </TableBody>
      </Table>
      <Button variant="text" size="large" className="w-full">
        Kirim
      </Button>
    </div>
  );
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default OrderDetail;

import React from "react";
import StoreLayout from "components/layout/StoreLayout";
import { toCurrency } from "utils";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Backdrop,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { getOrderStatus } from "utils/orders";

function OrderDetail() {
  const router = useRouter();
  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: () => {
      return api.get(`orders/${router.query.id}`);
    },
  });

  if (getOrder.isLoading || getOrder.isError) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  console.log({ getOrder });

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>No. Pembayaran</TableCell>
          <TableCell>{getOrder.data.data.data.attributes.code}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>
            <Chip
              color={getOrderStatus(getOrder.data.data.data).color}
              label={getOrderStatus(getOrder.data.data.data).text}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total Pembayaran</TableCell>
          <TableCell>
            {toCurrency(getOrder.data.data.data.attributes.price_amount)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default OrderDetail;

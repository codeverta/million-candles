import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { useRouter } from "next/router";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import AdminLayout from "components/layout/AdminLayout";
import { toCurrency } from "utils";
import dayjs from "dayjs";

function ProductDetail() {
  const router = useRouter();
  const getProduct = useQuery({
    queryKey: ["products", "detail"],
    queryFn: () => {
      return api.get(`products/${router.query.id}`);
    },
  });

  if (getProduct.isError || getProduct.isLoading) {
    return <LoadingBackdrop />;
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Nama</TableCell>
          <TableCell>{getProduct.data.data.data.attributes.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Harga</TableCell>
          <TableCell>
            {toCurrency(getProduct.data.data.data.attributes.price)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Stock</TableCell>
          <TableCell>{getProduct.data.data.data.attributes.stock}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ukuran</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Berat</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Terakhir Diperbarui</TableCell>
          <TableCell>
            {dayjs(getProduct.data.data.data.attributes.updatedAt).format(
              "LLLL"
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

ProductDetail.getLayout = (page: React.ReactNode) => {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProductDetail;

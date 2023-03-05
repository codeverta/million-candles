import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import AdminLayout from "components/layout/AdminLayout";
import React from "react";

function OrderDetail() {
  return <div>OrderDetail</div>;
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return (
    <AdminLayout>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>No Invoice</TableCell>
            <TableCell>INV 001</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </AdminLayout>
  );
};

export default OrderDetail;

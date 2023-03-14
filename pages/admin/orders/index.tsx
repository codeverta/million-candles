import AdminLayout from "components/layout/AdminLayout";
import React from "react";
import OrderTable from "components/molecules/OrderTable";

function Orders() {
  return <OrderTable />;
}

Orders.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Orders;

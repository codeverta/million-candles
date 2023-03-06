import AdminLayout from "components/layout/AdminLayout";
import React from "react";

function Orders() {
  return <div></div>;
}

Orders.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Orders;

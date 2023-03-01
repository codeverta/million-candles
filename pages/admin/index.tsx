// import BottomNav from 'components/mui/BottomNav';
import AdminLayout from "components/layout/AdminLayout";
import React from "react";
import OrderTable from "components/molecules/OrderTable";

export default function Home() {
  return <OrderTable />;
}

Home.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

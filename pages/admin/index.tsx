// import BottomNav from 'components/mui/BottomNav';
import AdminLayout from "components/layout/AdminLayout";
import React from "react";
import Table from "components/mui/Table";

export default function Home() {
  return <Table />;
}

Home.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

import AdminLayout from "components/layout/AdminLayout";
import React from "react";
import OrderTable from "components/molecules/OrderTable";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/orders");
  }, []);

  return <OrderTable />;
}

Home.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

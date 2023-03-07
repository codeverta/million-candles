import AdminLayout from "components/layout/AdminLayout";
import React from "react";

function Products() {
  return <div></div>;
}

Products.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Products;

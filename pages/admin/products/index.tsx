import AdminLayout from "components/layout/AdminLayout";
import React from "react";
import ProductsTable from "components/molecules/ProductsTable";
function Products() {
  return (
    <div>
      <ProductsTable />
    </div>
  );
}

Products.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Products;

import AdminLayout from "components/layout/AdminLayout";
import React from "react";

function CreateProduct() {
  return <div></div>;
}

CreateProduct.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateProduct;

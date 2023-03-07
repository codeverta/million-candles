import AdminLayout from "components/layout/AdminLayout";
import React from "react";

function CreateUser() {
  return <div></div>;
}

CreateUser.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateUser;

import AdminLayout from "components/layout/AdminLayout";
import UserTable from "components/molecules/UserTable";
import React from "react";

function Users() {
  return (
    <div>
      <UserTable />
    </div>
  );
}

Users.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Users;

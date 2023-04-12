import AdminLayout from "components/layout/AdminLayout";
import UsersTable from "components/molecules/UsersTable";
import React from "react";

function Users() {
  return (
    <div className="pb-24">
      <UsersTable />
    </div>
  );
}

Users.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Users;

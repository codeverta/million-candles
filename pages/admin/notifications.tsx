import AdminLayout from "components/layout/AdminLayout";
import React from "react";

function Notifications() {
  return <div></div>;
}

Notifications.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Notifications;

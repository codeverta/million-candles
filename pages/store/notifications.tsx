import React from "react";
import StoreLayout from "components/layout/StoreLayout";

function Notifications() {
  return <div>Notifications</div>;
}

Notifications.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Notifications;

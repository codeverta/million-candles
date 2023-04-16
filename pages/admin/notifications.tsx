import { Chip, List, ListItem, ListItemButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "components/layout/AdminLayout";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import React from "react";
import dayjs from "dayjs";
import api from "utils/api";

const notificationParams = {
  "page[size]": 10,
};
function Notifications() {
  const getNotifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => {
      return api.get("notifications", notificationParams);
    },
  });
  if (getNotifications.isError || getNotifications.isLoading) {
    return <LoadingBackdrop />;
  }

  return (
    <div className="pb-12">
      <List>
        {getNotifications.data.data.map((notification: any) => {
          return (
            <li key={notification.id}>
              {notification.data.destination_user ? (
                <ListItemButton key={notification.id}>
                  <p className="text-sm">
                    <span className="text-blue-600">
                      {notification.data.destination_user.email}
                    </span>{" "}
                    telah membuat order dengan kode {notification.data.code}
                  </p>
                  <p className="text-[0.65rem] whitespace-nowrap tracking-tighter">
                    {dayjs().to(dayjs(notification.created_at))}
                  </p>
                </ListItemButton>
              ) : (
                <ListItemButton key={notification.id}>
                  <p className="text-sm">
                    Penjualan kepada{" "}
                    <span className="text-blue-600">
                      {notification.data.buyer_name}
                    </span>{" "}
                    dengan kode{" "}
                    <span className="text-blue-600">
                      {notification.data.code}
                    </span>{" "}
                    telah dibuat
                  </p>
                  <p className="text-[0.65rem] whitespace-nowrap tracking-tighter">
                    {dayjs().to(dayjs(notification.created_at))}
                  </p>
                </ListItemButton>
              )}
            </li>
          );
        })}
      </List>
    </div>
  );
}

Notifications.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Notifications;

import { Chip, List, ListItem, ListItemButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "components/layout/AdminLayout";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import React from "react";
import api from "utils/api";

function Notifications() {
  const getNotifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => {
      return api.get("notifications");
    },
  });
  if (getNotifications.isError || getNotifications.isLoading) {
    return <LoadingBackdrop />;
  }

  console.log({ getNotifications });
  return (
    <div>
      <List>
        {getNotifications.data.data.map((notification: any) => {
          return (
            <>
              {notification.data.destination_user && (
                <ListItemButton className="py-4" key={notification.id}>
                  <p className="text-sm">
                    <span className="text-blue-600">
                      {notification.data.destination_user.email}
                    </span>{" "}
                    telah membuat order dengan kode {notification.data.code}
                  </p>
                </ListItemButton>
              )}
            </>
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

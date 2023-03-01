import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useGetFetchQuery } from "utils/hooks";

const adminList = [
  {
    to: "/admin",
    icon: <HomeIcon />,
    label: "Penjualan",
  },
  {
    to: "/admin/notifications",
    icon: <NotificationsNoneIcon />,
    label: "Notifikasi",
  },
  {
    to: "/admin/profile",
    icon: <AccountCircleIcon />,
    label: "Profile",
  },
];

const buyerList = [
  {
    to: "/store",
    icon: <HomeIcon />,
    label: "Penjualan",
  },
  {
    to: "/store/notifications",
    icon: <NotificationsNoneIcon />,
    label: "Notifikasi",
  },
  {
    to: "/store/profile",
    icon: <AccountCircleIcon />,
    label: "Profile",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const [value, setValue] = React.useState(undefined);
  const getSelf: any = useGetFetchQuery(["self"]);
  const routeList = React.useMemo(() => {
    return getSelf.data.roles.includes("merchant") ? adminList : buyerList;
  }, []);

  return (
    <Box sx={{ pb: 7 }}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
            router.push(newValue.to);
          }}
        >
          {routeList.map((it) => (
            <BottomNavigationAction
              value={it}
              key={it.to}
              label={it.label}
              icon={it.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

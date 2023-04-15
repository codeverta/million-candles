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
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useGetFetchQuery } from "utils/hooks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useEffect } from "react";

const adminList = [
  {
    to: "/admin",
    icon: <HomeIcon />,
    label: "Penjualan",
  },
  {
    to: "/admin/notifications",
    icon: <NotificationsIcon />,
    label: "Notifikasi",
  },
  {
    to: "/admin/pembelian",
    icon: <ShoppingCartIcon />,
    label: "Pembelian",
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
    label: "Home",
  },
  {
    to: "/store/orders",
    icon: <ReceiptIcon />,
    label: "Transaksi",
  },
  {
    to: "/store/cart",
    icon: <ShoppingCartIcon />,
    label: "Keranjang",
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
  const [routeList, setRouteList] = React.useState(buyerList);
  const getSelf: any = useGetFetchQuery(["self"]);

  useEffect(() => {
    setRouteList(
      getSelf?.data.roles.includes("merchant") ? adminList : buyerList
    );
  }, [getSelf]);

  return (
    <Paper className="fixed bottom-0 max-w-lg w-full" elevation={3}>
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
  );
}

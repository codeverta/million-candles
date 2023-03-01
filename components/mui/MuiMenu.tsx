import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

interface PropsI {
  open: boolean;
  handleClose: (event?: any) => void;
  anchorEl: HTMLElement | null;
}

export default function MuiMenu(props: PropsI) {
  const router = useRouter();
  const handleClose = () => {
    props.handleClose();
  };

  const handleLogout = () => {
    router.push("/");
    localStorage.removeItem("token");
  };

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

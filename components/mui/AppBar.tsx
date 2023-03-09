import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppDrawer from "./Drawer";
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import MoreIcon from "@mui/icons-material/MoreVert";
import MuiMenu from "./MuiMenu";
import { useRouter } from "next/router";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    background: "none",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  "& .MuiInputBase-input:focus": {
    outlineWidth: 0,
  },
}));

export default function ButtonAppBar() {
  const router = useRouter();
  const [state, setState] = useState({
    anchorEl: null,
  });
  const [open, setOpen] = useState({
    drawer: false,
    menu: false,
  });

  const handleDrawer = () => {
    setOpen({ ...open, drawer: !open.drawer });
  };

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen({ ...open, menu: !open.menu });
    if (event) {
      setState({ ...state, anchorEl: event.currentTarget as any });
    }
  };

  return (
    <>
      <AppDrawer open={open.drawer} handleDrawer={handleDrawer} />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className="flex justify-between">
            {router.pathname.includes("admin") && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawer}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              className="hidden lg:block"
              variant="h6"
              component="div"
            >
              Million Candles
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>

            <Box sx={{ display: "flex" }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <MuiMenu
        handleClose={handleMenu}
        anchorEl={state.anchorEl}
        open={open.menu}
      />
    </>
  );
}

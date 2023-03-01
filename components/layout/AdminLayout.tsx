import React from "react";
import BottomNav from "components/mui/BottomNav";
import ButtonAppBar from "components/mui/AppBar";
import SpeedDialTooltipOpen from "components/mui/SpeedDial";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ButtonAppBar />
      {children}
      <BottomNav />
      <SpeedDialTooltipOpen />
    </>
  );
}

export default AdminLayout;

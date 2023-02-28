import React from "react";
import BottomNav from "components/mui/BottomNav";
import ButtonAppBar from "components/mui/AppBar";
import SpeedDialTooltipOpen from "components/mui/SpeedDial";

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ButtonAppBar />
      {children}
      <BottomNav />
    </>
  );
}

export default StoreLayout;

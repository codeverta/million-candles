import React from "react";
import BottomNav from "components/mui/BottomNav";
import ButtonAppBar from "components/mui/AppBar";
import SpeedDialTooltipOpen from "components/mui/SpeedDial";

function StoreLayout({
  children,
  withoutHeader,
}: {
  children: React.ReactNode;
  withoutHeader?: boolean;
}) {
  return (
    <main className="max-w-lg m-auto pb-16">
      {!withoutHeader && <ButtonAppBar />}
      {children}
      <BottomNav />
    </main>
  );
}

export default StoreLayout;

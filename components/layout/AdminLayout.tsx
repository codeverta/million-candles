import React from "react";
import BottomNav from "components/mui/BottomNav";
import ButtonAppBar from "components/mui/AppBar";
import SpeedDialTooltipOpen from "components/mui/SpeedDial";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-lg m-auto pb-16 h-screen relative">
      <ButtonAppBar />
      {children}
      <BottomNav />
      <SpeedDialTooltipOpen />
    </main>
  );
}

export default AdminLayout;

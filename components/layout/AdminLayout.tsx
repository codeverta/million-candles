import React from "react";
import BottomNav from "components/mui/BottomNav";
import ButtonAppBar from "components/mui/AppBar";
import SpeedDialTooltipOpen from "components/mui/SpeedDial";
import Script from "next/script";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <>
      <main className="max-w-lg m-auto pb-16 relative">
        <ButtonAppBar />
        {children}
        <BottomNav />
        <SpeedDialTooltipOpen />
      </main>
      <Script
        type="text/javascript"
        src={
          isProduction
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
    </>
  );
}

export default AdminLayout;

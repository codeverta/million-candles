import React, { useEffect } from "react";
import AOS from "aos";
import Head from "next/head";
import Header from "../Header";
import Footer from "components/Footer";

interface Props {
  children: React.ReactNode;
}

export default function Landing({ children }: Props) {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: "ease-in-out", // Animation easing
      offset: 120, // Offset from the original trigger point
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <>
      <Head>
        <title>
          Produsen Lilin Terdekat di Jogja, Bandung, Semarang, Jakarta & Seluruh
          Indonesia
        </title>
        <meta
          name="description"
          content="Million Candles adalah produsen lilin aromaterapi handmade dengan wangi menenangkan, cocok untuk dekorasi, kado, dan relaksasi. Tersedia pengiriman ke Jogja, Jakarta, Bandung, Bali, dan seluruh Indonesia."
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}

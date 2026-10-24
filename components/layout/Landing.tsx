import React, { useEffect } from "react";
import Head from "next/head";
import Header from "../Header";
import Footer from "components/Footer";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { buildBusinessWhatsAppLink } from "utils/whatsapp.cjs";
import { trackWhatsAppClick } from "lib/gtag";
interface Props {
  children: React.ReactNode;
}

const WhatsAppButton = () => {
  const handleClick = () => {
    trackWhatsAppClick("unclassified", "floating-button");
    window.open(
      buildBusinessWhatsAppLink(
        "Halo, saya ingin bertanya tentang produk lilin."
      ),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 z-50"
      style={{
        background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
        boxShadow: "0 8px 25px rgba(37, 211, 102, 0.3)",
      }}
      aria-label="Hubungi via WhatsApp"
    >
      <WhatsAppIcon />
    </button>
  );
};

export default function Landing({ children }: Props) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" / */}
      </Head>
      <Header />
      {children}
      <WhatsAppButton />
      <Footer />
    </>
  );
}

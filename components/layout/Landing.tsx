import React, { useEffect } from "react";
import AOS from "aos";
import Head from "next/head";
import Header from "../Header";
import Footer from "components/Footer";
import { useRouter } from "next/router";

const DOMAIN = "https://www.souvenirlilin.id";
interface Props {
  children: React.ReactNode;
}

export default function Landing({ children }: Props) {
  const router = useRouter();
  const canonicalUrl = `${DOMAIN}${router.asPath.split("?")[0]}`;
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
        <link rel="canonical" href={canonicalUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}

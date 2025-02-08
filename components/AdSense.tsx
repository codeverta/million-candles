"use client"; // If using App Router

import { useEffect } from "react";

export default function AdSense() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2242816010232507"
      data-ad-slot="7002409118"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

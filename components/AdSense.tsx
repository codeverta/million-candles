"use client";

import { useEffect, useRef } from "react";

type AdType = "display" | "feed" | "in-article";

interface AdSenseProps {
  type?: AdType;
  className?: string;
  style?: React.CSSProperties;
}

// Configuration: Add your slots here to keep the component clean
const AD_CONFIG: Record<
  AdType,
  { slot: string; format: string; layout?: string }
> = {
  display: {
    slot: "7002409118",
    format: "auto",
  },
  feed: {
    slot: "2192935561",
    format: "autorelaxed",
  },
  "in-article": {
    slot: "1387120353",
    format: "fluid",
    layout: "in-article",
  },
};

const PUB_ID = "ca-pub-2242816010232507";

export default function AdSense({
  type = "display",
  className,
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Check if ad is already loaded in this slot to prevent "AdSense already loaded" error
      if (adRef.current && adRef.current.innerHTML === "") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {},
        );
      }
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, [type]); // Re-run if type changes

  const config = AD_CONFIG[type];
  return null;
  // return (
  //   <div
  //     className={`ad-container ${className || ""}`}
  //     style={{ minHeight: "100px", ...style }}
  //   >
  //     <ins
  //       ref={adRef}
  //       className="adsbygoogle"
  //       style={{ display: "block", textAlign: "center", ...style }}
  //       data-ad-client={PUB_ID}
  //       data-ad-slot={config.slot}
  //       data-ad-format={config.format}
  //       data-ad-layout={config.layout}
  //       data-full-width-responsive="true"
  //     />
  //   </div>
  // );
}

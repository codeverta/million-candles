import "../styles/globals.css";
import type { AppProps, AppLayoutProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "utils/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getRelationship, getRelationships } from "utils";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import AuthProvider from "components/layout/AuthProvider";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTimeFormat from "dayjs/plugin/relativeTime";
import indoFormat from "dayjs/locale/id";
import { NextSeo } from "next-seo";
import packageInfo from "../package.json";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const queryClient = new QueryClient();
dayjs.locale(indoFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTimeFormat);
api.init(process.env.NEXT_PUBLIC_BASE_API as string);

if (typeof window !== "undefined") {
  // @ts-ignore
  window.version = packageInfo.version;
}

export default function App({ Component, pageProps }: AppLayoutProps) {
  const appProps = { getRelationship, getRelationships };
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  const isProduction = process.env.NODE_ENV === "production";
  // seo
  const pageTitle =
    "UD Million Candles - Produsen Lilin Aromaterapi Souvenir Lilin Jogja, Lilin Warna, Lilin Hias dan Lain-lain";
  const pageDescription = `Kami adalah UMKM yang menyediakan berbagai macam jenis lilin
          berkualitas tinggi, mulai dari lilin aromaterapi, lilin souvenir, lilin warna, lilin hias
          dan masih banyak lagi. Kami menawarkan lilin hias yang indah untuk
          souvenir yang cocok untuk acara apa pun. Dari pernikahan hingga acara
          perusahaan atau perjalanan, lilin hias souvenir kami adalah pilihan
          yang tepat untuk membuat kenangan yang tak terlupakan.`;
  const ogImageUrl = "https://souvenirlilin.com/og-image.png";
  const siteName = "UD Million Candles";
  const siteUrl = "https://souvenirlilin.com";
  const twitterHandle = "@souvenirlilin";
  const keywords =
    "jual lilin, jual lilin jogja, lilin aromaterapi jogja, lilin batang, souvenir cantik, souvenir jogja, ud million candles, souvenir lilin, lilin warna, lilin hias, lilin berkualitas, umkm, lilin, toko lilin terdekat, toko lilin, jual lilin terdekat, toko lilin jogja, lilin aromaterapi, soy wax, lilin aromaterapi jogja, jual sumbu lilin terdekat, pabrik lilin, jual lilin besar terdekat, lilin estetik, jual lilin jogja, toko lilin aromaterapi terdekat, jual lilin aromaterapi terdekat, tempat jual lilin terdekat, bahan lilin, bahan lilin karakter, bahan pembuat lilin medan, bakery, beli aroma terapi di kaliurang jogja, beli lilin, beli lilin aromaterapi di jogja, candle lilin, candle wax, dagen toko lilin, foto lilin aromaterapi, gagang lilin, gelas lilin aromaterapi jogja, grosir lilin, jalan kapten haryadi gang teratai, gondangan, sardonoharjo, kabupaten sleman, daerah istimewa yogyakarta, jual gelas lilin terapi jogja, jual kebutuhan lilin jogja, jual lilin, jual lilin aromaterapi jogja, jual lilin besar jogja, jual lilin dingin di jogja, jual lilin elektrik di jogja, jual lilin elektrik terdekat, jual lilin lebah, jual lilin lebah yogyakarta, jual lilin merah terdekat, jual lilin natal di jogja, jual lilin natal jogja, jual lilin sawit dijogja, jual lilin ulang tahun jogja, jual lilin ulang tahun terdekat, jual lilin ultah terdekat, jual soy wax terdekat, jual sumbu lilin jogja, jual sumbu lilin terdekat di jogja, jual tatakan lilin jogja, jual tealight terdekat, lilin aroma terapi johja, lilin aromaterapi di dekat yogyakarta, kota yogyakarta, daerah istimewa yogyakarta, lilin aromaterapi grafis, lilin aromaterapi terdekat, lilin aromatherapy, lilin bar, lilin candle, lilin di keleng poncowinatan, lilin elektrik, lilin estetik jogja, lilin gelas, lilin jogja, lilin kontak, lilin merah, lilin natal jogja, lilin pilar, lilin scented kab. sleman, lilin sleman";

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={pageDescription}
        openGraph={{
          title: pageTitle,
          description: pageDescription,
          images: [
            {
              url: ogImageUrl,
              alt: pageTitle,
            },
          ],
          url: siteUrl,
          site_name: siteName,
        }}
        twitter={{
          handle: twitterHandle,
          site: siteUrl,
          cardType: "Jual Souvenir Lilin",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: keywords,
          },
        ]}
      />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Script src="https://www.google.com/recaptcha/api.js" />
          <Script
            type="text/javascript"
            src={
              isProduction
                ? "https://app.midtrans.com/snap/snap.js"
                : "https://app.sandbox.midtrans.com/snap/snap.js"
            }
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          />
          <Toaster position="top-center" richColors />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {getLayout(<Component {...pageProps} {...appProps} />)}
          </LocalizationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

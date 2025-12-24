import "../styles/globals.css";
import type { AppProps, AppLayoutProps } from "next/app";
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
import { appWithTranslation } from "next-i18next";
import CartProvider from "context/CartContext";
import { useRouter } from "next/router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});
dayjs.locale(indoFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTimeFormat);
api.init(process.env.NEXT_PUBLIC_BASE_API as string);

if (typeof window !== "undefined") {
  // @ts-ignore
  window.version = packageInfo.version;
}

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    if (e.message?.includes("Loading chunk")) {
      window.location.reload();
    }
  });
}

function App({ Component, pageProps }: AppLayoutProps) {
  const router = useRouter();
  const appProps = { getRelationship, getRelationships };
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  // seo
  const pageTitle =
    "Produsen Lilin Terdekat di Jogja, Jakarta & Seluruh Indonesia";
  const pageDescription = `Million Candles adalah produsen lilin aromaterapi handmade dengan wangi menenangkan, cocok untuk dekorasi, kado, dan relaksasi. Tersedia pengiriman ke Jogja, Jakarta, Bandung, Bali, dan seluruh Indonesia.`;
  const ogImageUrl = "https://souvenirlilin.id/og-image.png";
  const siteName = "UD Million Candles";
  const siteUrl = "https://souvenirlilin.id";
  const twitterHandle = "@souvenirlilin";
  const keywords =
    "jual lilin, jual lilin jogja, lilin aromaterapi jogja, lilin batang, souvenir cantik, souvenir jogja, ud million candles, souvenir lilin, lilin warna, lilin hias, lilin berkualitas";
  const canonicalUrl = `https://souvenirlilin.id${router.asPath}`;

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
              width: 1200,
              height: 630,
              alt: pageTitle,
            },
          ],
          url: siteUrl,
          type: "website",
          site_name: siteName,
          locale: "id_ID",
        }}
        twitter={{
          handle: twitterHandle,
          site: twitterHandle,
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: keywords,
          },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
          {
            name: "theme-color",
            content: "#2563eb",
          },
        ]}
        canonical={canonicalUrl}
      />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position="top-center" richColors />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CartProvider>
              {getLayout(<Component {...pageProps} {...appProps} />)}
            </CartProvider>
          </LocalizationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);

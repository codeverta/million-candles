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
import indoFormat from "dayjs/locale/id";
import { NextSeo } from "next-seo";
import dayjs from "dayjs";

const queryClient = new QueryClient();
dayjs.locale(indoFormat);
dayjs.extend(localizedFormat);
api.init(process.env.NEXT_PUBLIC_BASE_API as string);

export default function App({ Component, pageProps }: AppLayoutProps) {
  const appProps = { getRelationship, getRelationships };
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  // seo
  const pageTitle =
    "UD Million Candles - Souvenir Lilin, Lilin Warna, Lilin Hias dan Lain-lain";
  const pageDescription =
    "UD Million Candles menyediakan lilin untuk souvenir, lilin warna, lilin hias dan lain-lain. Temukan koleksi lilin berkualitas dengan harga terjangkau di UD Million Candles.";
  const ogImageUrl = "https://souvenirlilin.com/og-image.png";
  const siteName = "UD Million Candles";
  const siteUrl = "https://souvenirlilin.com";
  const twitterHandle = "@souvenirlilin";
  const keywords =
    "ud million candles, souvenir lilin, lilin warna, lilin hias, lilin berkualitas";

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
          cardType: "summary_large_image",
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
          <Script
            type="text/javascript"
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key="SB-Mid-client-kRWWsc4NnDa_F5Us"
          />
          <Toaster position="top-center" richColors />
          {getLayout(<Component {...pageProps} {...appProps} />)}
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

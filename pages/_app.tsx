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
import { TourProvider } from "@reactour/tour";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { appWithTranslation } from "next-i18next";
import "aos/dist/aos.css";
import "./posts/toc.css";
import CartProvider from "context/CartContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
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

const steps = [
  {
    selector: ".first-step",
    content: "Klik untuk memunculkan menu",
  },
  {
    selector: ".second-step",
    content: "Kode Order",
  },
  {
    selector: ".third-step",
    content: "Status Order",
  },
  {
    selector: ".fourth-step",
    content: "Daftar Menu",
  },
];

function App({ Component, pageProps }: AppLayoutProps) {
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
          <TourProvider
            steps={steps}
            nextButton={({
              Button,
              currentStep,
              stepsLength,
              setIsOpen,
              setCurrentStep,
              steps,
            }: any) => {
              const last = currentStep === stepsLength - 1;
              return (
                <Button
                  hideArrow={true}
                  onClick={() => {
                    if (last) {
                      setIsOpen(false);
                      localStorage.setItem("has_onboarding", "true");
                    } else {
                      setCurrentStep((s: any) =>
                        s === steps?.length - 1 ? 0 : s + 1
                      );
                    }
                  }}
                >
                  {last ? "Tutup" : <ArrowForwardIosIcon />}
                </Button>
              );
            }}
            prevButton={({ currentStep, setCurrentStep, steps }: any) => {
              const first = currentStep === 0;
              return (
                <button
                  onClick={() => {
                    if (first) {
                      setCurrentStep((s: any) => steps.length - 1);
                    } else {
                      setCurrentStep((s: any) => s - 1);
                    }
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
              );
            }}
            showPrevNextButtons={true}
            className="!p-10 rounded-lg"
          >
            <Toaster position="top-center" richColors />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CartProvider>
                {getLayout(<Component {...pageProps} {...appProps} />)}
              </CartProvider>
            </LocalizationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </TourProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);

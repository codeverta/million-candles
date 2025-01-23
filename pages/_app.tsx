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
import "aos/dist/aos.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Number of retries for failed queries
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

export default function App({ Component, pageProps }: AppLayoutProps) {
  const appProps = { getRelationship, getRelationships };
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  // seo
  const pageTitle =
    "UD Million Candles - Produsen Supplier Lilin Aromaterapi Souvenir Lilin Jogja, Lilin Warna, Lilin Hias, DEKORASI, HAMPERS, LILIN AROMATERAPI, SOUVENIR MURAH JOGJA, Home decor, Home Decor | Scented Candle | Hampers | Souvenir | Bouquet dan Lain-lain";
  const pageDescription = `DEKORASI, HAMPERS, LILIN AROMATERAPI, SOUVENIR MURAH JOGJA, Home decor, Home Decor | Scented Candle | Hampers | Souvenir | Bouquet. Kami adalah UMKM yang menyediakan berbagai macam jenis lilin
          berkualitas tinggi, mulai dari lilin aromaterapi, lilin souvenir, lilin warna, lilin hias
          dan masih banyak lagi. Kami menawarkan lilin hias yang indah untuk
          souvenir yang cocok untuk acara apa pun. Dari pernikahan hingga acara
          perusahaan atau perjalanan, lilin hias souvenir kami adalah pilihan
          yang tepat untuk membuat kenangan yang tak terlupakan. `;
  const ogImageUrl = "https://souvenirlilin.com/og-image.png";
  const siteName = "UD Million Candles";
  const siteUrl = "https://souvenirlilin.com";
  const twitterHandle = "@souvenirlilin";
  const keywords =
    "DEKORASI, HAMPERS, LILIN AROMATERAPI, SOUVENIR MURAH JOGJA, Home decor, Home Decor | Scented Candle | Hampers | Souvenir | Bouquet, jual lilin, jual lilin jogja, lilin aromaterapi jogja, lilin batang, souvenir cantik, souvenir jogja, ud million candles, souvenir lilin, lilin warna, lilin hias, lilin berkualitas, umkm, lilin, toko lilin terdekat, toko lilin, jual lilin terdekat, toko lilin jogja, lilin aromaterapi, soy wax, lilin aromaterapi jogja, jual sumbu lilin terdekat, pabrik lilin, jual lilin besar terdekat, lilin estetik, jual lilin jogja, toko lilin aromaterapi terdekat, jual lilin aromaterapi terdekat, tempat jual lilin terdekat, bahan lilin, bahan lilin karakter, bahan pembuat lilin medan, bakery, beli aroma terapi di kaliurang jogja, beli lilin, beli lilin aromaterapi di jogja, candle lilin, candle wax, dagen toko lilin, foto lilin aromaterapi, gagang lilin, gelas lilin aromaterapi jogja, grosir lilin, jalan kapten haryadi gang teratai, gondangan, sardonoharjo, kabupaten sleman, daerah istimewa yogyakarta, jual gelas lilin terapi jogja, jual kebutuhan lilin jogja, jual lilin, jual lilin aromaterapi jogja, jual lilin besar jogja, jual lilin dingin di jogja, jual lilin elektrik di jogja, jual lilin elektrik terdekat, jual lilin lebah, jual lilin lebah yogyakarta, jual lilin merah terdekat, jual lilin natal di jogja, jual lilin natal jogja, jual lilin sawit dijogja, jual lilin ulang tahun jogja, jual lilin ulang tahun terdekat, jual lilin ultah terdekat, jual soy wax terdekat, jual sumbu lilin jogja, jual sumbu lilin terdekat di jogja, jual tatakan lilin jogja, jual tealight terdekat, lilin aroma terapi jogja, lilin aromaterapi di dekat yogyakarta, kota yogyakarta, daerah istimewa yogyakarta, lilin aromaterapi grafis, lilin aromaterapi terdekat, lilin aromatherapy, lilin bar, lilin candle, lilin di keleng poncowinatan, lilin elektrik, lilin estetik jogja, lilin gelas, lilin jogja, lilin kontak, lilin merah, lilin natal jogja, lilin pilar, lilin scented kab. sleman, lilin sleman";

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
              {getLayout(<Component {...pageProps} {...appProps} />)}
            </LocalizationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </TourProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

function Close({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="absolute right-0 bottom-0 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Skip
    </button>
  );
}

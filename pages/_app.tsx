import "../styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "utils/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getRelationship, getRelationships } from "utils";
import { Toaster } from "sonner";

const queryClient = new QueryClient();
api.init(process.env.NEXT_PUBLIC_BASE_API as string);

export default function App({ Component, pageProps }: AppProps) {
  const appProps = { getRelationship, getRelationships };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Script
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-kRWWsc4NnDa_F5Us"
        />
        <Toaster />
        <Component {...pageProps} {...appProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

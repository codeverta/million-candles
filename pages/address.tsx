// import { useRef, useEffect } from 'react'
import dynamic from "next/dynamic";
import Layout from "components/layout/Landing";
import Head from "next/head";
const DynamicMap = dynamic(() => import("components/Map"), {
  ssr: false,
});

function Address(props: any) {
  return (
    <main>
      <Head>
        <title>
          Alamat Kami | UD Million Candles - Produsen Lilin Aromaterapi Souvenir
          Lilin Jogja, Lilin Warna, Lilin Hias dan Lain-lain
        </title>
      </Head>
      <DynamicMap {...props} />
    </main>
  );
}

Address.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Address;

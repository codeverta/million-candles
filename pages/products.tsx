import Layout from "components/layout/Landing";
import Head from "next/head";
import { Content } from "../components";

function Product() {
  return (
    <>
      <Head>
        <title>
          Produk Kami | UD Million Candles - Produsen Lilin Aromaterapi Souvenir
          Lilin Jogja, Lilin Warna, Lilin Hias dan Lain-lain
        </title>
      </Head>
      <div className="pt-24 dark:bg-gray-900">
        <Content />
      </div>
    </>
  );
}

Product.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Product;

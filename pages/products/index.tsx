import Layout from "components/layout/Landing";
import Head from "next/head";
import { Content } from "components";
import ProductsTable from "components/molecules/landing/ProductsTable";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function Product() {
  const router = useRouter();
  const handleRowClick = (row: any) => {
    router.push(`/products/${row.attributes.slug}`);
  };
  return (
    <>
      <Head>
        <title>
          Produk Kami | UD Million Candles - Produsen Lilin Aromaterapi Souvenir
        </title>
      </Head>
      <main className="flex justify-center dark:bg-gray-900 bg-white">
        <ProductsTable handleRowClick={handleRowClick} />
      </main>
    </>
  );
}

Product.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "order"])),
    },
  };
}

export default Product;

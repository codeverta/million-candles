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
          Produk Lilin Aromaterapi Premium | UD Million Candles - Produsen Lilin
          Aromaterapi Souvenir
        </title>
        <meta
          name="description"
          content="Temukan koleksi lilin aromaterapi premium handmade kami dengan berbagai pilihan wangi dan bentuk. Ideal untuk souvenir pernikahan, acara khusus, atau hadiah personal. Kualitas terbaik dengan harga terjangkau."
        />
        <meta
          property="og:title"
          content="Produk Lilin Aromaterapi Premium | UD Million Candles"
        />
        <meta
          property="og:description"
          content="Lilin aromaterapi handmade berkualitas tinggi dengan berbagai pilihan wangi dan bentuk. Sempurna untuk souvenir atau hadiah spesial."
        />
        <meta property="og:type" content="website" />
        <meta
          name="keywords"
          content="lilin aromaterapi, scented candles, souvenir pernikahan, wedding favors, handmade candles, lilin wangi, hadiah personal"
        />
      </Head>
      <main className="flex flex-col items-center px-4 py-8 dark:bg-gray-900 bg-white">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Koleksi Produk Lilin Kami
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Nikmati koleksi lilin handmade kami yang dibuat dengan bahan alami
            berkualitas tinggi. Tersedia dalam berbagai macam wangi, bentuk, dan
            ukuran untuk memenuhi kebutuhan Anda - dari souvenir pernikahan,
            ibadah, kebutuhan darurat mati lampu hingga dekorasi rumah atau
            hadiah spesial.
          </p>
        </div>
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

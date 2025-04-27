import Layout from "components/layout/Landing";
import Head from "next/head";
import { marked } from "marked";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

function About() {
  const { t } = useTranslation("common");
  const text = marked.parse(t("about_us.content"));
  return (
    <>
      <Head>
        <title>
          Tentang Kami | UD Million Candles - Produsen Lilin Aromaterapi
        </title>
      </Head>
      <div className="w-full dark:bg-gray-900 bg-white text-gray-600 dark:text-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            className="py-16 md:py-24 prose prose-lg md:prose-xl dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 m-auto"
            dangerouslySetInnerHTML={{ __html: text }}
          ></article>
        </div>
      </div>
    </>
  );
}

About.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "order"])), // <- fixed to load 'order' not 'common'
    },
  };
}

export default About;

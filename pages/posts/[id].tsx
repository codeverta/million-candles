import Layout from "components/layout/Landing";
import { getAllPostIds, getPostData } from "lib/posts";
import Head from "next/head";
import { NextSeo } from "next-seo";

export default function Post({ postData }: any) {
  const SEO = {
    title: postData.title,
    description: postData.desc,
    openGraph: {
      type: "website",
      url: "https://www.souvenirlilin.com/og-image.png",
      title: postData.title,
      description: postData.desc,
    },
  };
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <NextSeo
          title={SEO.title}
          description={SEO.description}
          openGraph={SEO.openGraph}
        />
      </Head>
      <div className="max-w-3xl mx-auto pt-8">
        <p className=" dark:text-white font-semibold text-6xl">
          {postData.title}
        </p>
        <p className="dark:text-gray-300 mb-16">{postData.date}</p>
      </div>
      <article className="max-w-3xl mx-auto pb-32">
        <div
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </Layout>
  );
}

//
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

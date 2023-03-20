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
      <p className="text-center font-semibold text-xl">{postData.title}</p>
      <p className="text-center text-xs mb-16">{postData.date}</p>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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

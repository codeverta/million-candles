import Layout from "components/layout/Landing";
import { getAllPostIds, getPostData } from "lib/posts";
import Head from "next/head";

export default function Post({ postData }: any) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
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

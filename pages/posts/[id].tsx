import Layout from "components/layout/Landing";
import { getAllPostIds, getPostData } from "lib/posts";
import Head from "next/head";
import { NextSeo } from "next-seo";
// import AdSense from "components/AdSense";
// import Comments from "components/Comments";
// import { TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon } from 'react-share';
import { useState, useEffect } from "react";

interface PostData {
  id: string;
  title: string;
  date: string;
  contentHtml: string;
  desc: string;
  tags: string;
}

export default function Post({ postData }: { postData: PostData }) {
  const [readingTime, setReadingTime] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  // useEffect(() => {
  //   // Calculate reading time
  //   const wordsPerMinute = 200;
  //   const words = postData.contentHtml.replace(/<[^>]*>/g, '').split(/\s+/).length;
  //   setReadingTime(Math.ceil(words / wordsPerMinute));

  // Set share URL
  //   setShareUrl(window.location.href);
  // }, [postData.contentHtml]);

  const siteUrl = "https://www.souvenirlilin.id";
  const ogImage = `${siteUrl}/og-image.png`;
  const currentUrl = `${siteUrl}/posts/${postData.id}`;

  const SEO = {
    title: `${postData.title} | Million Candles`,
    description: postData.desc,
    openGraph: {
      type: "article",
      url: currentUrl,
      title: postData.title,
      description: postData.desc,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: postData.title,
        },
      ],
      site_name: "Million Candles",
      locale: "id_ID",
      publishedTime: postData.date,
      modifiedTime: postData.date,
    },
    twitter: {
      handle: "@millioncandles",
      site: "@millioncandles",
      cardType: "summary_large_image",
    },
  };

  return (
    <Layout>
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content={SEO.openGraph.type} />
        <meta property="og:url" content={SEO.openGraph.url} />
        <meta property="og:title" content={SEO.openGraph.title} />
        <meta property="og:description" content={SEO.openGraph.description} />
        <meta property="og:image" content={SEO.openGraph.images[0].url} />
        <meta property="og:site_name" content={SEO.openGraph.site_name} />
        <meta property="og:locale" content={SEO.openGraph.locale} />
        <meta
          property="article:published_time"
          content={SEO.openGraph.publishedTime}
        />
        <meta
          property="article:modified_time"
          content={SEO.openGraph.modifiedTime}
        />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={SEO.twitter.cardType} />
        <meta name="twitter:site" content={SEO.twitter.site} />
        <meta name="twitter:creator" content={SEO.twitter.handle} />
        <meta name="twitter:title" content={SEO.openGraph.title} />
        <meta name="twitter:description" content={SEO.openGraph.description} />
        <meta name="twitter:image" content={SEO.openGraph.images[0].url} />

        {/* Additional Meta Tags */}
        <meta name="author" content="Rabih Utomo" />
        <meta name="keywords" content={`lilin, ${postData.tags}`} />
        <link rel="canonical" href={currentUrl} />
      </Head>
      <NextSeo
        title={SEO.title}
        description={SEO.description}
        openGraph={SEO.openGraph}
        twitter={SEO.twitter}
      />
      <main className="dark:bg-gray-800 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {postData.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {postData.date}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {readingTime} min read
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {postData.tags}
                </div>
              </div>
            </div>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Social Share Buttons */}
          {/* <div className="flex items-center space-x-4 mb-8">
            <span className="text-gray-600 dark:text-gray-400">Share:</span>
            <TwitterShareButton url={shareUrl} title={postData.title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={postData.title}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div> */}

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-12 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              RU
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Rabih Utomo
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Author</p>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose dark:prose-invert max-w-none prose-lg prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />

          {/* Bottom Ad */}
          {/* <div className="mt-12">
            <AdSense adType={3} />
          </div> */}

          {/* Comments Section */}
          {/* <Comments postId={postData.id} postTitle={postData.title} /> */}
        </article>
      </main>
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

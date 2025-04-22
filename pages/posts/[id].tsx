// pages/posts/[id].jsx
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { getPostData, getAllPostIds } from "lib/posts";
import {
  Calendar,
  User,
  Tag,
  Home,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import CopyLinkButton from "./CopyLinkButton";
import Layout from "components/layout/Landing";
import RelatedPosts from "./RelatedPosts"; // Import the new component

// Utility function to convert date
const convertDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Utility function for reading time estimation
const estimateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

// Dynamic Breadcrumb Component
const Breadcrumb = ({ postTitle, slug }) => {
  return (
    <nav
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
      aria-label="Breadcrumb"
    >
      <Link
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
        href="/"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        href="/posts"
      >
        Blog
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="font-semibold truncate max-w-[200px]">{postTitle}</span>
    </nav>
  );
};

function Post({ postData, slug }) {
  // Generate a random background image URL from Lorem Picsum
  const backgroundImageUrl = `https://picsum.photos/seed/${slug}/1600/900`;

  // Reading time calculation
  const readingTime = estimateReadingTime(
    postData.contentHtml.replace(/<[^>]*>/g, "")
  );

  return (
    <>
      <NextSeo
        title={`${postData.title} | Million Candles`}
        description={postData.desc}
        openGraph={{
          title: postData.title,
          description: postData.desc,
          url: `https://www.souvenirlilin.id/blog/${slug}`,
          siteName: "Million Candles",
          images: [
            {
              url:
                postData.image || `https://picsum.photos/seed/${slug}/1200/630`,
              width: 1200,
              height: 630,
              alt: postData.title,
            },
          ],
          locale: "en_US",
          type: "article",
        }}
        twitter={{
          card: "summary_large_image",
          title: postData.title,
          description: postData.desc,
          creator: "@souvenirlilin",
          images: [
            postData.image || `https://picsum.photos/seed/${slug}/1200/630`,
          ],
        }}
      />

      <main className="relative min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 max-w-[1200px] mx-auto my-4">
        {/* Decorative Emoji Floating Elements */}
        <div className="fixed top-20 left-10 text-6xl opacity-20 rotate-12 hidden md:block">
          🚀
        </div>
        <div className="fixed top-40 right-10 text-7xl opacity-20 -rotate-12 hidden md:block">
          💡
        </div>
        <div className="fixed bottom-20 left-20 text-5xl opacity-20 rotate-6 hidden md:block">
          ✨
        </div>

        <div className="">
          <article
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl rounded-xl 
            overflow-hidden p-6 sm:p-8 md:p-12 border border-gray-200 dark:border-gray-700"
          >
            {/* Breadcrumb */}
            <Breadcrumb postTitle={postData.title} slug={slug} />
            {/* Header Image */}
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
              {postData.image ? (
                <img
                  src={postData.image}
                  alt={`${postData.title} header image`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <img
                  src={backgroundImageUrl}
                  alt={`${postData.title} header image`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>
            {/* Header Section */}
            <header className="mb-10 border-b pb-6 dark:border-gray-700 relative">
              <div className="absolute top-0 right-0 text-4xl">
                {postData.tags && postData.tags.split(",").includes("tech")
                  ? "💻"
                  : "📝"}
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 
                leading-tight mb-6 transition-colors duration-300 relative"
              >
                <span className="block">{postData.title}</span>
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{convertDate(postData.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Million Candles 👨‍💻</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{readingTime} min read</span>
                </div>

                {/* Copy Link Button */}
                <CopyLinkButton />

                {/* Tags */}
                {postData.tags && postData.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <div className="flex space-x-2">
                      {postData.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Content Section */}
            <div
              className="prose text-base md:text-md dark:prose-invert prose-lg max-w-none 
              prose-headings:text-gray-900 dark:prose-headings:text-gray-100
              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-strong:text-gray-900 dark:prose-strong:text-gray-100
              prose-code:text-gray-800 dark:prose-code:text-gray-200
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
              selection:bg-blue-100 dark:selection:bg-blue-900"
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />
          </article>

          {/* Related Posts - Using our new component */}
          {postData.relatedPosts && postData.relatedPosts.length > 0 && (
            <RelatedPosts posts={postData.relatedPosts} />
          )}
        </div>

        {/* Footer Decoration */}
        <div className="fixed bottom-10 right-10 text-4xl opacity-20 hidden md:block">
          🌈
        </div>
      </main>
    </>
  );
}

Post.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Post;

// In Pages Router, we use getStaticProps instead of directly fetching data in component
export async function getStaticProps({ params }) {
  const slug = params.id;
  const postData = await getPostData(slug);

  return {
    props: {
      postData,
      slug,
    },
  };
}

// getStaticPaths replaces generateStaticParams - they're functionally similar
export async function getStaticPaths() {
  const paths = getAllPostIds().map((postId) => ({
    params: {
      id: postId.params.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

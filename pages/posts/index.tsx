import Head from "next/head";
import Layout from "components/layout/Landing";
import { getSortedPostsData } from "lib/posts";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TextField, Button } from "@mui/material";

interface PostMeta {
  id: string;
  date: string;
  title: string;
  desc: string;
}

const POSTS_PER_PAGE = 5;

export default function Home({ allPostsData }: { allPostsData: PostMeta[] }) {
  const router = useRouter();
  const { search } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>(allPostsData);
  const [currentPage, setCurrentPage] = useState(1);

  // Update search term when URL query changes
  useEffect(() => {
    if (search && typeof search === "string") {
      setSearchTerm(search);
    } else {
      setSearchTerm("");
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [search]);

  // Filter posts based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(allPostsData);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = allPostsData.filter(
        (post) =>
          post.title.toLowerCase().includes(lowercaseSearch) ||
          post.desc.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, allPostsData]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Handle search input change and form submission
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search parameter
    router.push({
      pathname: router.pathname,
      query: searchTerm ? { search: searchTerm } : {},
    });
  };

  return (
    <Layout>
      <Head>
        <meta
          name="description"
          content="Kumpulan cerita dan tips mengenai lilin"
        />
      </Head>
      <main className="dark:bg-gray-900 min-h-screen">
        <section className="px-6 max-w-4xl mx-auto py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-6">
              Kumpulan Cerita dan Tips Mengenai Lilin
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Kumpulan blog yang membahas tentang berbagai aspek lilin, mulai
              dari sejarah dan berbagai jenis lilin, hingga cara membuat lilin
              sendiri dan bagaimana memilih lilin yang tepat untuk berbagai
              keperluan.
            </p>

            {/* Search form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex max-w-md mx-auto mb-8"
            >
              <div className="flex-grow">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Cari artikel..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    style: {
                      backgroundColor: "white",
                      borderRadius: "4px 0 0 4px",
                    },
                  }}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                className="!bg-blue-500"
                color="primary"
                style={{
                  borderRadius: "0 4px 4px 0",
                  marginLeft: "-1px",
                }}
              >
                Cari
              </Button>
            </form>

            {/* Show search results info if searching */}
            {searchTerm && (
              <div className="text-left mb-8 text-gray-600 dark:text-gray-300">
                {filteredPosts.length > 0 ? (
                  <p>
                    Menemukan {filteredPosts.length} hasil untuk pencarian
                    &quot;{searchTerm}&quot;
                  </p>
                ) : (
                  <p>
                    Tidak ada hasil untuk pencarian &quot;{searchTerm}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-8">
              {currentPosts.map(({ id, date, title, desc }: PostMeta) => (
                <article
                  key={id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                >
                  <Link href={`/posts/${id}`}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-2">
                      {title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {desc}
                  </p>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {date}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Tidak ada artikel yang ditemukan.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

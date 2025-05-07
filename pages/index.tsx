import { Content, Hero } from "components";
import Layout from "components/layout/Landing";
import {
  CheckRounded,
  CloudDone,
  RoundaboutLeft,
  EnergySavingsLeaf,
  Favorite,
  AccessTime,
  Star,
  StarHalf,
  Percent,
  HeadsetMic,
} from "@mui/icons-material";
import { getSortedPostsData } from "lib/posts";
import { Avatar } from "@mui/material";
import Head from "next/head";
import { LocalBusinessJsonLd, LogoJsonLd } from "next-seo";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import BusinessStats from "components/molecules/landing/BusinessStats";

// import AdSense from "components/AdSense";

function Home(props: any) {
  const { t } = useTranslation();
  const { posts } = props;
  const testimonials = [
    {
      quote: "testimonials.sarah_johnson.quote",
      name: "testimonials.sarah_johnson.name",
      position: "testimonials.sarah_johnson.position",
      imageUrl: "https://randomuser.me/api/portraits/women/43.jpg",
      rating: [<Star />, <Star />, <Star />, <Star />, <Star />],
    },
    {
      quote: "testimonials.emily_chen.quote",
      name: "testimonials.emily_chen.name",
      position: "testimonials.emily_chen.position",
      imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: [<Star />, <Star />, <Star />, <Star />, <Star />],
    },
    {
      quote: "testimonials.michael_rodriguez.quote",
      name: "testimonials.michael_rodriguez.name",
      position: "testimonials.michael_rodriguez.position",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: [<Star />, <Star />, <Star />, <Star />, <StarHalf />],
    },
  ];

  const features = [
    {
      name: t("quality_section.product_quality"),
      description: t("quality_section.product_quality_description"),
      icon: RoundaboutLeft,
    },
    {
      name: t("quality_section.size_and_color"),
      description: t("quality_section.size_and_color_description"),
      icon: CloudDone,
    },
    {
      name: t("quality_section.calming_aroma"),
      description: t("quality_section.calming_aroma_description"),
      icon: CheckRounded,
    },
  ];

  return (
    <Layout>
      <Head>
        {/* FAQ Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Apakah lilin dari Million Candles aman digunakan di dalam ruangan?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ya, lilin kami menggunakan bahan alami seperti soy wax dan palm wax yang aman dan tidak menghasilkan asap berbahaya.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Apakah tersedia pengiriman ke seluruh Indonesia?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tentu! Kami melayani pengiriman ke seluruh Indonesia termasuk Jogja, Jakarta, Bali, Bandung, dan kota lainnya.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Apakah bisa request custom lilin atau gift set?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Bisa! Kami menyediakan layanan custom label, aroma, dan kemasan khusus untuk keperluan hadiah atau souvenir event.",
                  },
                },
              ],
            }),
          }}
        />
        <LocalBusinessJsonLd
          type="Store"
          id="https://souvenirlilin.id"
          name="Supplier Lilin Jogja"
          description="Toko lilin hias dan souvenir terbaik di Jogja."
          url="https://souvenirlilin.id"
          telephone="+6281578956156"
          address={{
            streetAddress: "Jl. Kaliurang Km. 9,5",
            addressLocality: "Yogyakarta",
            addressRegion: "DIY",
            postalCode: "55581",
            addressCountry: "ID",
          }}
          geo={{
            latitude: "-7.7248921",
            longitude: "110.3979528",
          }}
          images={[
            "https://souvenirlilin.id/Million-Candles/Lilin-Gelas-Biru/1.png",
            "https://souvenirlilin.id/Million-Candles/Lilin-Gelas-Biru/2.png",
            "https://souvenirlilin.id/Million-Candles/Lilin-Gelas-Biru/3.png",
            "https://souvenirlilin.id/Million-Candles/Lilin-Gelas-Biru/4.png",
          ]}
          openingHours={[
            {
              opens: "09:00",
              closes: "21:00",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              validFrom: "2023-01-01",
              validThrough: "2030-12-31",
            },
          ]}
          rating={{
            ratingValue: "4.8",
            ratingCount: "150",
          }}
          review={[
            {
              author: "Andi Pratama",
              datePublished: "2023-09-15",
              name: "Lilin berkualitas tinggi",
              reviewBody:
                "Lilin dari toko ini sangat berkualitas dan aromanya menenangkan. Cocok untuk hadiah maupun dekorasi rumah.",
              reviewRating: {
                bestRating: "5",
                worstRating: "1",
                ratingValue: "5",
              },
            },
            {
              author: "Siti Nurhaliza",
              datePublished: "2023-10-01",
              name: "Pelayanan ramah",
              reviewBody:
                "Pelayanan di toko ini sangat ramah dan membantu. Saya sangat puas dengan pembelian saya.",
              reviewRating: {
                bestRating: "5",
                worstRating: "1",
                ratingValue: "5",
              },
            },
          ]}
          makesOffer={[
            {
              priceSpecification: {
                type: "UnitPriceSpecification",
                priceCurrency: "IDR",
                price: "50000-200000",
              },
              itemOffered: {
                name: "Lilin Hias",
                description:
                  "Lilin hias dengan berbagai aroma dan desain unik untuk dekorasi dan souvenir.",
              },
            },
            {
              priceSpecification: {
                type: "UnitPriceSpecification",
                priceCurrency: "IDR",
                price: "60000-500000",
              },
              itemOffered: {
                name: "Paket Souvenir Lilin",
                description:
                  "Paket lilin custom untuk acara pernikahan, ulang tahun, dan event lainnya.",
              },
            },
          ]}
          areaServed={[
            {
              geoMidpoint: {
                latitude: "-7.7248921",
                longitude: "110.3979528",
              },
              geoRadius: "50",
            },
          ]}
          action={{
            actionName: "potentialAction",
            actionType: "ReviewAction",
            target: "https://souvenirlilin.id",
          }}
        />
        <LogoJsonLd
          logo="https://www.souvenirlilin.id/logolilin.png"
          url="https://www.souvenirlilin.id"
        />
      </Head>
      <div className="dark:bg-gray-900 bg-white text-gray-900 dark:text-white">
        <Hero />
        <Content />
        <BusinessStats />
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <EnergySavingsLeaf className="text-amber-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("features.eco_friendly")}
                </h3>
                <p className="text-gray-600">{t("features.made_from")}</p>
              </div>
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <Favorite className="text-amber-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("features.handmade")}
                </h3>
                <p className="text-gray-600">
                  {t("features.crafted_with_love")}
                </p>
              </div>
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <AccessTime className="text-amber-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("features.long_lasting")}
                </h3>
                <p className="text-gray-600">{t("features.burn_time")}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <span className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium rounded-full text-sm">
                  {t("features.handcrafted_with_love")}
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {t("features.make_beautiful_memories")}{" "}
                  <span className="text-amber-600 dark:text-amber-400">
                    {t("features.our_candle")}
                  </span>
                </h1>
                <div className="h-1 w-24 bg-amber-500 rounded-full"></div>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("features.souvenir_description")}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("description")}
                </p>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-900/30 dark:to-amber-700/20 blur-3xl opacity-30 rounded-3xl animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="overflow-hidden rounded-2xl shadow-xl transform hover:scale-[1.03] transition-all duration-500">
                    <img
                      className="w-full h-full object-cover"
                      src="/assets/lilin1.webp"
                      alt="Lilin Kristal Sedang Warna Warni"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-xl mt-12 transform hover:scale-[1.03] transition-all duration-500">
                    <img
                      className="w-full h-full object-cover"
                      src="/assets/lilin2.webp"
                      alt={t("shipping.package")}
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center gap-3 transform hover:scale-105 transition-all duration-300">
                    <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-600 dark:text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t("shipping.fast_shipping")}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t("shipping.nationwide")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* feature */}
          <div className="overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-white to-amber-50 dark:from-gray-900 dark:to-gray-800">
            <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-lg grid-cols-1 gap-y-16 gap-x-12 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
                <div className="lg:pr-8 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                      {t("premium_collection.title")}
                    </span>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-4xl leading-tight">
                      {t("premium_collection.subtitle").split(" ")[0]}{" "}
                      <span className="text-amber-600 dark:text-amber-400">
                        {t("premium_collection.subtitle")
                          .split(" ")
                          .slice(1)
                          .join(" ")}
                      </span>
                    </h2>
                    <div className="mt-6 h-1 w-20 bg-amber-500 rounded-full"></div>
                    <p className="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600">
                      {t("premium_collection.description")}
                    </p>
                    <dl className="mt-10 max-w-xl space-y-6 text-base leading-7 text-gray-600 lg:max-w-none">
                      {features.map((feature) => (
                        <div
                          key={feature.name}
                          className="relative p-12 rounded-xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                        >
                          <dt className="font-semibold dark:text-white text-gray-900 text-lg mb-1">
                            {t(feature.name)}
                          </dt>
                          <dd className="dark:text-gray-400 text-gray-600">
                            {t(feature.description)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-900/30 dark:to-amber-700/20 blur-3xl opacity-30 rounded-3xl"></div>
                  <div className="relative">
                    <img
                      src="/assets/lilin.webp"
                      alt={t("premium_collection.subtitle")}
                      className="w-full max-w-none rounded-2xl shadow-2xl ring-1 ring-gray-400/10 object-cover lg:w-[48rem] h-[30rem] transform hover:scale-[1.02] transition-transform duration-500"
                      width={2432}
                      height={1442}
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-amber-600 dark:text-amber-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {t("lifespan.title")}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t("lifespan.description")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-600 dark:text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t("natural.title")}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t("natural.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="grosir" className="py-16 bg-amber-50">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                  <h2 className="text-3xl font-bold mb-6">
                    {t("business_opportunity.title")}
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    {t("business_opportunity.description")}
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckRounded className="text-amber-500 mt-1 mr-3" />
                      <span>{t("business_opportunity.custom_branding")}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckRounded className="text-amber-500 mt-1 mr-3" />
                      <span>
                        {t("business_opportunity.no_moq_white_label")}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    {t("wholesale_benefits.title")}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <Percent className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {t("wholesale_benefits.competitive_price")}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {t(
                            "wholesale_benefits.competitive_price_description"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <Star className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {t("wholesale_benefits.exclusive_aromas")}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {t("wholesale_benefits.exclusive_aromas_description")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <HeadsetMic className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {t("wholesale_benefits.dedicated_support")}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {t(
                            "wholesale_benefits.dedicated_support_description"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Blog */}
          <div className=" py-24 sm:py-32">
            <div className="mx-auto max-w-screen-lg px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("blog_section.title")}
                </h2>
                <p className="mt-2 text-lg leading-8 dark:text-gray-400 text-gray-600">
                  {t("blog_section.description")}
                </p>
              </div>
              <div className="mx-auto dark:text-white mt-10 grid max-w-7xl grid-cols-1 gap-y-10 gap-x-6 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: any) => (
                  <article
                    key={post.id}
                    className="flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={`https://picsum.photos/seed/${post.id}/800/500`}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          {post.category || t("blog_section.title")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                          <a
                            href={`/posts/${post.id}`}
                            className="cursor-pointer hover:underline"
                          >
                            {post.title}
                          </a>
                        </h3>
                        <p className="mt-3 text-base leading-6 text-gray-500 dark:text-gray-300 line-clamp-3">
                          {post.desc}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`https://picsum.photos/seed/author${post.id}/40/40`}
                            alt="Author"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {post.author || t("brand")}
                          </p>
                          <div className="flex text-xs text-gray-500 dark:text-gray-400">
                            <time
                              dateTime={post.date || new Date().toISOString()}
                            >
                              {post.date || "Recent"}
                            </time>
                            <span className="mx-1">•</span>
                            <span>{post.readTime || "5 min read"}</span>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <button className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          {/* Testimonial */}

          {/* Testimonial */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">
                {t("testimonials.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.name}
                    className="bg-gray-50 p-6 rounded-lg"
                  >
                    <div className="flex items-center mb-4"></div>
                    <p className="text-gray-700 mb-4">{t(testimonial.quote)}</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.imageUrl}
                        alt={`Foto Testimonial ${t(testimonial.name)}`}
                        className="w-10 h-10 rounded-full mr-3"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-medium">{t(testimonial.name)}</h4>
                        <p className="text-gray-600 text-sm">
                          {t(testimonial.position)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="relative isolate overflow-hidden py-24 px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <figure className="mt-10">
                <blockquote className="text-center text-xl font-semibold leading-8 dark:text-gray-300 text-gray-900 sm:text-2xl sm:leading-9">
                  <p>{t("testimonials.wedding_customer.quote")}</p>
                </blockquote>
                <figcaption className="mt-10">
                  <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                    <svg
                      viewBox="0 0 2 2"
                      width={3}
                      height={3}
                      aria-hidden="true"
                      className="fill-gray-900"
                    >
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <div className="dark:text-gray-50 text-gray-600">
                      - {t("testimonials.wedding_customer.name")}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}

export default Home;

export async function getStaticProps({ locale }) {
  const posts = getSortedPostsData(locale);
  if (posts.length == 0) {
    return {
      props: {
        posts: getSortedPostsData("en"),
        ...(await serverSideTranslations(locale, ["common", "order"])),
      },
    };
  }
  return {
    props: {
      posts: posts.slice(0, 6),
      ...(await serverSideTranslations(locale, ["common", "order"])),
    },
  };
}

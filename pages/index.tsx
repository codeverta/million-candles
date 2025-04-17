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
  LocalShipping,
  HeadsetMic,
} from "@mui/icons-material";
import { getSortedPostsData } from "lib/posts";
import { Avatar } from "@mui/material";
import Head from "next/head";
// import AdSense from "components/AdSense";

const features = [
  {
    name: "Kualitas Produk.",
    description:
      "Kami hanya menggunakan bahan-bahan berkualitas tinggi untuk membuat lilin hias kami, dan setiap produk kami diuji untuk memastikan keamanan dan ketahanannya. Kami juga memiliki tim seniman yang berbakat yang menghiasi setiap lilin dengan desain yang indah dan unik, membuatnya menjadi souvenir yang spesial.",
    icon: RoundaboutLeft,
  },
  {
    name: "Ukuran dan warna.",
    description:
      "Lilin hias kami hadir dalam berbagai ukuran, mulai dari yang kecil dan portabel hingga yang besar dan indah. Kami juga memiliki berbagai warna yang berbeda, termasuk putih, biru, hijau, merah, dan banyak lagi, sehingga Anda dapat memilih yang sesuai dengan tema acara Anda.",
    icon: CloudDone,
  },
  {
    name: "Aroma yang Menenangkan.",
    description:
      "Lilin hias kami juga memberikan aroma yang menenangkan, membawa kedamaian dan ketenangan ke dalam ruangan. Kami menggunakan minyak wangi berkualitas tinggi untuk memberikan aroma yang tahan lama dan menyenangkan..",
    icon: CheckRounded,
  },
];

function Home(props: any) {
  const { posts } = props;
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
      </Head>
      <div className="dark:bg-gray-900 bg-white text-gray-900 dark:text-white">
        <Content />
        <Hero />
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <EnergySavingsLeaf className="text-amber-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">
                  Made with 100% natural soy wax and essential oils
                </p>
              </div>
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <Favorite className="text-amber-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Handcrafted</h3>
                <p className="text-gray-600">
                  Each candle is carefully poured by our artisans
                </p>
              </div>
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <AccessTime className="text-amber-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Long Lasting</h3>
                <p className="text-gray-600">
                  Up to 12 hours of burn time per candle
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="">
          <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-lg lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
            <div className="font-light text-gray-400 sm:text-lg dark:text-gray-400">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Buat Kenangan Indah dengan Lilin Kami
              </h2>
              <p className="mb-4">
                Dengan Lilin Hias Souvenir kami, Anda dapat membawa pulang
                kenangan indah dari acara atau perjalanan Anda. Setiap lilin
                kami dibuat dengan bahan berkualitas tinggi dan dihiasi dengan
                indah oleh para seniman kami. Lilin kami hadir dalam berbagai
                ukuran dan warna yang berbeda, dan tahan lama untuk memberikan
                aroma yang menenangkan selama berjam-jam.
              </p>
              <p>
                Kami menawarkan lilin hias yang indah untuk souvenir yang
                sempurna untuk acara apa pun. Dari pernikahan hingga acara
                perusahaan atau perjalanan, lilin hias souvenir kami adalah
                pilihan yang sempurna untuk membuat kenangan yang tak
                terlupakan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <img
                className="w-full rounded-lg"
                src="/assets/lilin1.webp"
                height={500}
                width={500}
                alt="Gambar Lilin Kristal Sedang Warna Warni"
              />
              <img
                className="mt-4 w-full lg:mt-10 rounded-lg"
                src="/assets/lilin2.webp"
                height={500}
                width={500}
                alt="Gambar Paket Pengiriman Lilin"
              />
            </div>
          </div>
          {/* feature */}
          <div className="overflow-hidden  py-24 sm:py-32">
            <div className="mx-auto max-w-screen-lg px-6 lg:px-8">
              <div className="mx-auto grid max-w-lg grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <h2 className="mt-2 text-3xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-4xl">
                      Produk Kami
                    </h2>
                    <p className="mt-6 text-lg leading-8 dark:text-gray-400 text-gray-600">
                      Beberapa keunggulan produk lilin kami.
                    </p>
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      {features.map((feature) => (
                        <div key={feature.name} className="relative pl-9">
                          <dt className="inline dark:text-white font-semibold text-gray-400">
                            <feature.icon
                              className="absolute top-1 left-1 h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                            {feature.name}
                          </dt>{" "}
                          <dd className="dark:text-gray-400 inline">
                            {feature.description}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <img
                  src="/assets/lilin.webp"
                  alt="Product screenshot"
                  className="w-[24rem] max-w-none mx-auto rounded-2xl shadow-2xl ring-1 ring-gray-400/10 sm:w-[40rem] md:-ml-4 lg:-ml-0"
                  width={2432}
                  height={1442}
                />
              </div>
            </div>
          </div>

          <section id="wholesale" className="py-16 bg-amber-50">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                  <h2 className="text-3xl font-bold mb-6">
                    Wholesale Opportunities
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Elevate your business with our premium candle collection.
                    Perfect for hotels, spas, boutiques, and gift shops.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckRounded className="text-amber-500 mt-1 mr-3" />
                      <span>Custom branding options available</span>
                    </li>
                    <li className="flex items-start">
                      <CheckRounded className="text-amber-500 mt-1 mr-3" />
                      <span>Volume discounts starting at 25+ units</span>
                    </li>
                    <li className="flex items-start">
                      <CheckRounded className="text-amber-500 mt-1 mr-3" />
                      <span>Flexible MOQs and white-label services</span>
                    </li>
                  </ul>
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition">
                    Request Wholesale Catalog
                  </button>
                </div>
                <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Wholesale Benefits
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <Percent className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Competitive Pricing</h4>
                        <p className="text-gray-600 text-sm">
                          Enjoy up to 40% off retail prices for bulk orders
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <LocalShipping className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Reliable Shipping</h4>
                        <p className="text-gray-600 text-sm">
                          Free shipping on orders over $500
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <Star className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Exclusive Scents</h4>
                        <p className="text-gray-600 text-sm">
                          Access to wholesale-only fragrance options
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <HeadsetMic className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Dedicated Support</h4>
                        <p className="text-gray-600 text-sm">
                          Personal account manager for wholesale clients
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
                  Cerita Kami
                </h2>
                <p className="mt-2 text-lg leading-8 dark:text-gray-400 text-gray-600">
                  Kumpulan blog yang membahas tentang berbagai aspek lilin,
                  mulai dari sejarah dan berbagai jenis lilin, hingga cara
                  membuat lilin sendiri dan bagaimana memilih lilin yang tepat
                  untuk berbagai keperluan. Anda juga akan menemukan cerita
                  inspiratif tentang bagaimana lilin dapat menjadi simbol
                  harapan dan kehangatan dalam kehidupan sehari-hari. Mari kita
                  eksplorasi keajaiban lilin bersama-sama dan pelajari cara
                  menggunakannya untuk menerangi kehidupan kita.
                </p>
              </div>
              <div className="mx-auto dark:text-white mt-10 grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {posts.map((post: any) => (
                  <article
                    key={post.id}
                    className="flex max-w-xl flex-col items-start justify-between"
                  >
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 dark:text-gray-200 dark:hover:text-white text-gray-900 dark:group-hover:text-gray-50 group-hover:text-gray-600">
                        <a
                          href={"posts/" + post.id}
                          className="cursor-pointer hover:underline"
                        >
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                      </h3>
                      <p className="mt-5 text-sm leading-6 dark:text-gray-300 text-gray-600 line-clamp-3">
                        {post.desc}
                      </p>
                    </div>
                    <div className="relative mt-8 flex items-center gap-x-4"></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          {/* Testimonial */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">
                What Our Customers Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-amber-500 mr-2 flex">
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "Our hotel guests constantly compliment the beautiful scent
                    in our lobby. The Vanilla Dream candles create such a
                    welcoming atmosphere."
                  </p>
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/women/43.jpg"
                      alt="Sarah Johnson"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <p className="text-gray-600 text-sm">
                        Hotel Manager, The Grand Plaza
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-amber-500 mr-2 flex">
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "As a boutique owner, I appreciate the quality and
                    presentation of these candles. They've become our
                    best-selling gift item!"
                  </p>
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/women/65.jpg"
                      alt="Emily Chen"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-medium">Emily Chen</h4>
                      <p className="text-gray-600 text-sm">
                        Owner, The Curated Corner
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-amber-500 mr-2 flex">
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                      <StarHalf />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "The burn time is incredible and the scents are perfectly
                    balanced - not too overpowering. I've bought every fragrance
                    in the collection!"
                  </p>
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Michael Rodriguez"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-medium">Michael Rodriguez</h4>
                      <p className="text-gray-600 text-sm">Happy Customer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="relative isolate overflow-hidden  py-24 px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <Avatar sx={{ bgcolor: "002233" }} className="mx-auto h-18 w-18">
                A
              </Avatar>
              <figure className="mt-10">
                <blockquote className="text-center text-xl font-semibold leading-8 dark:text-gray-300 text-gray-900 sm:text-2xl sm:leading-9">
                  <p>
                    “Terima kasih @souvenirlilin untuk produk yang indah! Lilin
                    yang saya beli untuk pernikahan saya benar-benar menambahkan
                    sentuhan yang sempurna ke acara tersebut, dan tamu-tamu saya
                    sangat menyukainya”
                  </p>
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
                      - Pelanggan
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

export async function getStaticProps() {
  const posts = getSortedPostsData();
  return {
    props: {
      posts: posts.slice(0, 3),
    },
  };
}

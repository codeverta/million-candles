import { Content, Hero } from "components";
import Footer from "components/Footer";
import Layout from "components/layout/Landing";
import { CheckRounded, CloudDone, RoundaboutLeft } from "@mui/icons-material";
import { getSortedPostsData } from "lib/posts";
import api from "utils/api";

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
  const { products, posts } = props;
  console.log({ products });
  return (
    <Layout>
      <div className="dark:bg-gray-900 bg-white text-gray-900 dark:text-white">
        <Hero />
        <Content products={products} />
        <section className="">
          <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
            <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
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
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
                alt="office content 1"
              />
              <img
                className="mt-4 w-full lg:mt-10 rounded-lg"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
                alt="office content 2"
              />
            </div>
          </div>
          {/* feature */}
          <div className="overflow-hidden  py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
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
                  src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
                  alt="Product screenshot"
                  className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                  width={2432}
                  height={1442}
                />
              </div>
            </div>
          </div>
          {/* Blog */}
          <div className=" py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
              {/* <div className="mx-auto dark:text-white mt-10 grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {posts.map((post: any) => (
                <article
                  key={post.id}
                  className="flex max-w-xl flex-col items-start justify-between"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.datetime} className="text-gray-500">
                      {post.date}
                    </time>
                    <a
                      href={post.category.href}
                      className="relative z-10 rounded-full dark:bg-white bg-gray-50 py-1.5 px-3 font-medium text-gray-600 hover:bg-gray-100"
                    >
                      {post.category.title}
                    </a>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 dark:text-gray-200 dark:hover:text-white text-gray-900 dark:group-hover:text-gray-50 group-hover:text-gray-600">
                      <a href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-5 text-sm leading-6 dark:text-gray-300 text-gray-600 line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <img
                      src={post.author.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded-full bg-gray-50"
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold dark:text-gray-50 text-gray-900">
                        <a href={post.author.href}>
                          <span className="absolute inset-0" />
                          {post.author.name}
                        </a>
                      </p>
                      <p className="dark:text-gray-50 text-gray-600">
                        {post.author.role}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div> */}
            </div>
          </div>
          {/* Testimonial */}
          <section className="relative isolate overflow-hidden  py-24 px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              {/* <img
              className="mx-auto h-12"
              src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg"
              alt=""
            /> */}
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
                      - Anonim
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </section>
        </section>
        <Footer />
      </div>
    </Layout>
  );
}

export default Home;

export async function getServerSideProps() {
  try {
    const products = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/products?include=documents`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      }
    ).then((res) => res.json());
    console.log({ products });
    const posts = getSortedPostsData();
    return {
      props: {
        products: products,
        posts: posts.slice(0, 3),
      },
    };
  } catch (error) {
    console.log({ error });
    return {
      props: {
        products: {},
        posts: [],
      },
    };
  }
}

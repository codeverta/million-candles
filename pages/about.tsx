import Layout from "components/layout/Landing";
import Head from "next/head";
import { marked } from "marked";

const text = marked.parse(`
# Tentang Million Candles

Million Candles adalah perusahaan lilin asal Yogyakarta yang menyediakan berbagai jenis lilin dengan desain yang unik dan berkualitas tinggi. Kami menggunakan bahan-bahan berkualitas tinggi dan teknik pembuatan yang baik untuk menciptakan lilin yang indah dan harum.

Kami menawarkan berbagai pilihan lilin, mulai dari lilin kecil hingga lilin besar yang dapat digunakan untuk acara spesial seperti pernikahan, pesta ulang tahun, acara ibadah gereja, atau mati lampu. Selain itu, kami juga menyediakan lilin parfum yang dapat digunakan untuk menciptakan suasana yang menenangkan di rumah Anda.

Kami memiliki berbagai pilihan warna dan desain yang dapat disesuaikan dengan selera Anda. Kami juga dapat membuat lilin dengan desain yang sesuai dengan keinginan Anda.

Kami sangat menghargai kualitas dan keselamatan pelanggan, sehingga kami selalu berusaha untuk menggunakan bahan-bahan yang aman dan tidak merusak lingkungan.

Jika Anda ingin menambah suasana romantis di rumah Anda atau mencari hadiah yang unik untuk acara spesial, jangan ragu untuk mengunjungi website kami dan melihat pilihan lilin yang kami tawarkan. Kami akan senang untuk membantu Anda menemukan lilin yang tepat untuk kebutuhan Anda.
`);

function About() {
  return (
    <>
      <Head>
        <title>
          Tentang Kami | UD Million Candles - Produsen Lilin Aromaterapi
          Souvenir Lilin Jogja, Lilin Warna, Lilin Hias dan Lain-lain
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

export default About;

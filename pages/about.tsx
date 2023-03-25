import Layout from "components/layout/Landing";
import Head from "next/head";
import { marked } from "marked";

const text = marked.parse(`
# Tentang Million Candles

Million Candles adalah perusahaan lilin asal Yogyakarta yang menyediakan berbagai jenis lilin dengan desain yang unik dan berkualitas tinggi. Kami menggunakan bahan-bahan berkualitas tinggi dan teknik pembuatan yang baik untuk menciptakan lilin yang indah dan harum.

Kami menawarkan berbagai pilihan lilin, mulai dari lilin tealight hingga lilin besar yang dapat digunakan untuk acara spesial seperti pernikahan atau pesta ulang tahun. Selain itu, kami juga menyediakan lilin parfum yang dapat digunakan untuk menciptakan suasana yang menenangkan di rumah Anda.

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
      <div className="w-screen dark:bg-gray-900 bg-white text-gray-600 dark:text-white">
        <article
          className="  dark:prose-headings:text-white prose-p:text-gray-400 py-32 prose prose-xl m-auto"
          dangerouslySetInnerHTML={{ __html: text }}
        ></article>
      </div>
    </>
  );
}

About.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default About;

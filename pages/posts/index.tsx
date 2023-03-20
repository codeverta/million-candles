import Head from "next/head";
import Layout from "components/layout/Landing";
import { getSortedPostsData } from "lib/posts";
import Link from "next/link";

interface PostMeta {
  id: string;
  date: string;
  title: string;
  desc: string;
}

export default function Home({ allPostsData }: any) {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>

      <section className="">
        <h2 className={`text-center font-bold text-lg mt-2 mb-8`}>
          Menerangi Kehidupan dengan Lilin: Kumpulan Cerita dan Tips Mengenai
          Lilin
        </h2>
        <p>
          Kumpulan blog yang membahas tentang berbagai aspek lilin, mulai dari
          sejarah dan berbagai jenis lilin, hingga cara membuat lilin sendiri
          dan bagaimana memilih lilin yang tepat untuk berbagai keperluan. Anda
          juga akan menemukan cerita inspiratif tentang bagaimana lilin dapat
          menjadi simbol harapan dan kehangatan dalam kehidupan sehari-hari.
          Mari kita eksplorasi keajaiban lilin bersama-sama dan pelajari cara
          menggunakannya untuk menerangi kehidupan kita.
        </p>
        <ul>
          {allPostsData.map(({ id, date, title, desc }: PostMeta) => (
            <li key={id} className="mb-4">
              <Link href={`/posts/${id}`}>
                <p className="text-xl cursor-pointer">{title}</p>
              </Link>
              <p>{desc}</p>
              <p className="text-xs">{date}</p>
            </li>
          ))}
        </ul>
      </section>
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

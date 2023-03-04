import { Content, Hero } from "components";
import Footer from "components/Footer";
import Layout from "components/layout/Landing";

function Home() {
  return (
    <>
      <Hero />
      <Content />
      <Footer />
    </>
  );
}

Home.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Home;

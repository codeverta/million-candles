import Layout from "components/layout/Landing";
import api from "utils/api";
import { Content } from "../components";

function Product({ products }: any) {
  return (
    <div className="pt-24 dark:bg-gray-900">
      <Content products={products} />
    </div>
  );
}

Product.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Product;

export async function getStaticProps() {
  const products = await api.get("products", {
    include: "documents",
  });

  return {
    props: {
      products: products.data,
    },
  };
}

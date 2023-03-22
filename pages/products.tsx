import Layout from "components/layout/Landing";
import { Content } from "../components";

function Product() {
  return (
    <div className="pt-24 dark:bg-gray-900">
      <Content />
    </div>
  );
}

Product.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Product;

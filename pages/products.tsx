import Layout from "components/layout/Landing";
import { Content } from "../components";

function Product() {
  return <Content />;
}

Product.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Product;

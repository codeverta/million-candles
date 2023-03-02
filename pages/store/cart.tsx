import React from "react";
import StoreLayout from "components/layout/StoreLayout";

function Cart() {
  return <div>Cart</div>;
}

Cart.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Cart;

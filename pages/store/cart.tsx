import React from "react";
import StoreLayout from "components/layout/StoreLayout";

function Cart() {
  return (
    <div>
      Wah, keranjang belanjamu kosong Yuk, isi dengan barang-barang impianmu!
    </div>
  );
}

Cart.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Cart;

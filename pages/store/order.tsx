import React, { useEffect, useMemo, useState } from "react";
import StoreLayout from "components/layout/StoreLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "utils/api";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  IconButton,
  ButtonGroup,
  Checkbox,
} from "@mui/material";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { getRelationship, getRelationships } from "utils";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { toCurrency } from "utils";
import { useRouter } from "next/router";

const cartsParam = {
  include: "products.documents",
};

const EmptyCart = () => (
  <article className="absolute top-0 min-h-screen w-screen flex items-center ">
    <div className="text-center m-auto">
      <h1 className="mt-4 text-xl tracking-tight font-bold text-gray-900 md:text-4xl">
        Wah, keranjang belanjamu kosong
      </h1>
      <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
        Yuk, isi dengan barang-barang impianmu!
      </p>
    </div>
  </article>
);

function Cart() {
  const router = useRouter();
  const updateCart = useMutation((payload: any) => {
    return api.patch(`carts/${payload.data.id}`, payload);
  });
  const getCarts = useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const res = await api.get("carts", cartsParam);
      setCarts(res.data);
      computeTotalPrice();
      return res;
    },
  });

  const cartsGate = getCarts.isLoading || getCarts.isError;

  const [carts, setCarts] = useState<any>(null);
  const [state, setState] = useState<any>({
    checked: [],
    ordered: [],
    total: 0,
  });

  useEffect(() => {
    // if (getCarts.status == "success" && !cartsGate) {
    //   ;
    // }
  }, [carts]);

  if (cartsGate || !carts) return <LoadingBackdrop />;

  const computeTotalPrice = () => {
    const total = carts.data.reduce((total: number, cart: any) => {
      const product = getRelationship(carts, cart, "products");
      return (
        total +
        parseInt(cart.attributes.quantity as any | 0) * product.attributes.price
      );
    }, 0);
    setState({ ...state, total });
  };

  const handleCounter = ({ type, cart, index }: any) => {
    const _carts = JSON.parse(JSON.stringify(carts));
    if (type == "increment") {
      _carts.data[index].attributes.quantity++;
    } else if (
      type == "decrement" &&
      _carts.data[index].attributes.quantity != 1
    ) {
      _carts.data[index].attributes.quantity--;
    }
    setCarts(_carts);
    updateCart.mutate({
      data: {
        id: cart.id,
        type: "carts",
        attributes: {
          quantity: _carts.data[index].attributes.quantity,
        },
      },
    });
  };

  const handleCreateOrder = () => {
    console.log({ carts });
  };

  return (
    <>
      {carts.data.length > 0 ? (
        <>
          {/* <h1 className="text-3xl mx-1 mt-5 font-bold text-gray-900">
            Keranjangmu
          </h1> */}
          {carts.data.map((cart: any, index: number) => {
            const product = getRelationship(carts, cart, "products");
            const documents = getRelationships(carts, product, "documents");
            const url = `${process.env.NEXT_PUBLIC_BASE}/storage/${documents?.[0].attributes.filename}`;
            return (
              <List key={cart.id}>
                <ListItem disablePadding>
                  <Checkbox
                    color="primary"
                    inputProps={{
                      "aria-labelledby": product.attributes.name,
                    }}
                  />
                  <ListItemText
                    className="justify-between text-xs flex items-center"
                    primary={
                      <span className="flex">
                        <img
                          className="w-12 mx-2 shadow-lg"
                          src={url}
                          onError={(e: any) =>
                            (e.target.src = "/assets/image-1@2x.jpg")
                          }
                        />
                        <span className="truncate text-xs">
                          {product.attributes.name}
                          <br />
                          {toCurrency(product.attributes.price)}
                        </span>
                      </span>
                    }
                    secondary={
                      <>
                        <ButtonGroup component={"span"}>
                          <Button
                            onClick={() =>
                              handleCounter({ type: "decrement", index, cart })
                            }
                          >
                            -
                          </Button>
                          <Button>{cart.attributes.quantity}</Button>
                          <Button
                            onClick={() =>
                              handleCounter({ type: "increment", index, cart })
                            }
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </>
                    }
                  />
                </ListItem>
              </List>
            );
          })}
          <div className="w-full flex items-center justify-between">
            <h1 className="font-bold text-xl">
              Total {toCurrency(state.total)}
            </h1>
            <Button
              startIcon={<ShoppingBasketIcon />}
              className="bg-blue-500"
              variant="contained"
              onClick={handleCreateOrder}
            >
              Beli
            </Button>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </>
  );
}

Cart.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Cart;

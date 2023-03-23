import React, { useEffect, useMemo, useState } from "react";
import StoreLayout from "components/layout/StoreLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Typography,
} from "@mui/material";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { getRelationship, getRelationships } from "utils";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { toCurrency } from "utils";
import { useGetFetchQuery } from "utils/hooks";
import { toast } from "sonner";
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";

const cartsParam = {
  include: "products.documents",
};

const EmptyCart = () => (
  <article className="fixed top-0 left-0 w-screen min-h-screen flex items-center ">
    <div className="text-center m-auto">
      <h1 className="mt-4 text-lg tracking-tight font-bold text-gray-900">
        Wah, keranjang belanjamu kosong
      </h1>
      <p className="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
        Yuk, isi dengan barang-barang impianmu!
      </p>
    </div>
  </article>
);

function Cart() {
  const router = useRouter();
  const getSelf: any = useGetFetchQuery(["self"]);
  const createOrder = useMutation((payload: any) => {
    return api.post(`orders`, payload);
  });
  const updateCart = useMutation((payload: any) => {
    return api.patch(`carts/${payload.data.id}`, payload);
  });
  const getCarts = useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const res = await api.get("carts", cartsParam);
      setCarts(res.data);
      return res;
    },
  });
  const getUsers = useQuery({
    queryKey: ["users", "merchant"],
    queryFn: async () => {
      return api.get("users", {
        "filter[roles]": "merchant",
      });
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
    if (getCarts.status == "success" && !getCarts.isLoading && carts?.data) {
      computeTotalPrice();
    }
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
    if (getUsers.isLoading || getUsers.isError || !getSelf.data) {
      throw new Error("Terjadi kesalahan");
    }
    const user = getUsers.data.data.data[0];
    const currUser = getSelf.data;

    const payload = {
      data: {
        type: "orders",
        attributes: {
          price_amount: state.total,
        },
        relationships: {
          "origin-users": {
            data: {
              type: "users",
              id: user.id,
            },
          },
          "destination-users": {
            data: {
              type: "users",
              id: currUser.me.id + "",
            },
          },
        },
      },
    };
    createOrder.mutate(payload, {
      onSuccess: async (res: any) => {
        const batchDeleteCart = carts.data.map((it: any) => {
          return api.delete(`carts/${it.id}`);
        });
        const batchCreateOrderDetails = carts.data.map((cart: any) => {
          const product = getRelationship(carts, cart, "products");
          return api.post(`order-details`, {
            data: {
              type: "order-details",
              attributes: {
                qty: parseInt(cart.attributes.quantity),
                price: product.attributes.price,
                total_price:
                  cart.attributes.quantity * product.attributes.price,
              },
              relationships: {
                products: {
                  data: {
                    type: "products",
                    id: cart.relationships.products.data.id,
                  },
                },
                orders: {
                  data: {
                    type: "orders",
                    id: res.data.data.id,
                  },
                },
              },
            },
          });
        });
        await Promise.all([...batchDeleteCart, ...batchCreateOrderDetails]);
        toast.success("Barang berhasil dibeli");
        router.push(`/store/orders/${res.data.data.id}`);
      },
      onError: (err: any) => {
        err.response.data.errors.forEach((it: any) => {
          toast.error(it.detail);
        });
      },
      onSettled: () => {
        getCarts.refetch();
      },
    });
  };

  const handleDeleteCart = async (cart: any) => {
    try {
      await api.delete(`carts/${cart.id}`);
      getCarts.refetch();
      toast.success("Produk Berhasil Dihapus dari Keranjang");
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <>
      {carts.data.length > 0 ? (
        <>
          <List>
            <ListItem>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Penjualan
              </Typography>
            </ListItem>
          </List>
          {carts.data.map((cart: any, index: number) => {
            const product = getRelationship(carts, cart, "products");
            const documents = getRelationships(carts, product, "documents");
            const url = `${process.env.NEXT_PUBLIC_BASE}/storage/${documents?.[0]?.attributes.filename}`;
            return (
              <List key={cart.id}>
                <ListItem disablePadding>
                  <IconButton onClick={() => handleDeleteCart(cart)}>
                    <DeleteIcon className="hover:text-red-600" />
                  </IconButton>
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
                        <ButtonGroup className="mr-4" component={"span"}>
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
          <List>
            <ListItem>
              <div className="w-full flex items-center justify-between">
                <Typography
                  sx={{ flex: "1 1 100%" }}
                  variant="subtitle1"
                  id="tableTitle"
                  component="div"
                >
                  Total {toCurrency(state.total)}
                </Typography>
                <Button
                  onClick={handleCreateOrder}
                  startIcon={<ShoppingBasketIcon />}
                  className="bg-blue-500 w-full"
                  size="large"
                  variant="contained"
                >
                  Beli
                </Button>
              </div>
            </ListItem>
          </List>
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

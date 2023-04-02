import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputBase,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import StoreLayout from "components/layout/StoreLayout";
import React, { useMemo, useState } from "react";
import SearchInput from "components/mui/SearchInput";
import { toCurrency } from "utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "utils/api";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "sonner";
import { useGetFetchQuery } from "utils/hooks";
import { useRouter } from "next/router";

const productParams = {
  "fields[products]": "name,price",
  // "page[size]": 5,
};

const userParams = {
  // "page[size]": 5,
};

const paymentsType = [
  {
    label: "Cash",
    value: "cash",
  },
  {
    label: "Transfer",
    value: "transfer",
  },
  {
    label: "Midtrans",
    value: "midtrans",
  },
];
function CreateOrder() {
  const router = useRouter();
  const [state, setState] = useState<{
    buyerName: string;
    destinationUser: any;
    isBuyer: boolean;
    paymentType: string;
    selectedProducts: any;
  }>({
    buyerName: "",
    destinationUser: {},
    paymentType: "",
    isBuyer: false,
    selectedProducts: [],
  });
  const getSelf: any = useGetFetchQuery(["self"]);
  const createOrder = useMutation({
    mutationKey: ["order", "create"],
    mutationFn: (payload: any) => {
      return api.post("orders", payload);
    },
  });
  const getProducts = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return api.get("products", productParams);
    },
  });
  const getUsers = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return api.get("users", userParams);
    },
  });
  const productsGate = getProducts.isLoading || getProducts.isError;
  const usersGate = getUsers.isLoading || getUsers.isError;
  const users = useMemo(
    () => (!usersGate ? getUsers.data.data : null),
    [getUsers]
  );
  const products = useMemo(
    () => (!productsGate ? getProducts.data.data : null),
    [getProducts]
  );
  const totalPrice = useMemo(() => {
    return !productsGate
      ? state.selectedProducts.reduce(
          (total: any, current: any) =>
            total + current.attributes.quantity * current.attributes.price,
          0
        )
      : null;
  }, [state]);

  const usersOptions = useMemo(() => {
    if (usersGate) {
      return [
        {
          label: "",
          value: "",
        },
      ];
    }
    return users.data.map((it: any) => ({
      label: `${it.attributes.email}`,
      value: it.id,
    }));
  }, [getUsers]);

  const productOptions = useMemo(() => {
    if (productsGate) {
      return [
        {
          label: "",
          value: "",
        },
      ];
    }
    return products.data.map((it: any) => ({
      label: `${it.attributes.name} - ${toCurrency(it.attributes.price)}`,
      value: it.id,
    }));
  }, [getProducts]);

  const onAppendProduct = (_: any, value: { label: string; value: string }) => {
    if (!value) {
      return;
    }
    const newProduct = products.data.find((it: any) => it.id == value.value);
    newProduct.attributes.quantity = 1;
    setState({
      ...state,
      selectedProducts: [...state.selectedProducts, newProduct],
    });
  };

  const handleDeleteRow = (it: any) => {
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter(
        (selected: any) => selected.id != it.id
      ),
    });
  };

  const handleChangePaymentType = (event: any) => {
    setState({ ...state, paymentType: event.target.value });
  };

  const handleChangeBuyer: any = (e: any, newValue: any) => {
    if (newValue) {
      setState({ ...state, destinationUser: newValue });
    } else {
      setState({ ...state, buyerName: e.target.value });
    }
  };

  const handleProductQty = (e: any, index: number) => {
    const selectedProducts = state.selectedProducts;
    const selectedProduct = state.selectedProducts[index];
    selectedProduct.attributes.quantity = e.target.value;
    selectedProducts[index] = selectedProduct;
    setState({ ...state, selectedProducts });
  };

  const handleSubmit = () => {
    const payload = {
      data: {
        type: "orders",
        attributes: {
          price_amount: totalPrice,
          is_validate_seller: true,
          payments_type: state.paymentType,
          buyer_name: state.isBuyer ? undefined : state.buyerName,
        },
        relationships: {
          "origin-users": {
            data: {
              type: "users",
              id: getSelf.data.me.id + "",
            },
          },
          "destination-users": state.isBuyer
            ? {
                data: {
                  type: "users",
                  id: state.destinationUser.value + "",
                },
              }
            : undefined,
        },
      },
    };

    createOrder.mutate(payload, {
      onSuccess: async (res) => {
        toast.success("Order berhasil dibuat");
        // todo bikin post ke order details
        const batchCreateOrderDetails = state.selectedProducts.map(
          (product: any) => {
            return api.post(`order-details`, {
              data: {
                type: "order-details",
                attributes: {
                  qty: parseInt(product.attributes.quantity),
                  price: product.attributes.price,
                  total_price:
                    product.attributes.quantity * product.attributes.price,
                },
                relationships: {
                  products: {
                    data: {
                      type: "products",
                      id: product.id,
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
          }
        );

        await Promise.all(batchCreateOrderDetails);
        router.push("/admin");
      },
      onError: () => {
        toast.error("Terjadi error pada sistem, silakan hubungi pemilik toko");
      },
    });
  };

  const isSubmitAllowed = (): boolean => {
    const hasProduct = state.selectedProducts.length > 0;
    const hasBuyer = state.buyerName || state.destinationUser.value;
    const hasPayment = state.paymentType;
    if (hasBuyer && hasProduct && hasPayment) {
      return true;
    }
    return false;
  };

  if (productsGate) {
    return <LoadingBackdrop />;
  }

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="whitespace-nowrap" colSpan={2}>
              <p>Pembeli sudah terdaftar?</p>
            </TableCell>
            <TableCell colSpan={1} className="!flex !justify-end">
              <Switch
                color="primary"
                checked={state.isBuyer}
                onChange={(e: any) =>
                  setState({ ...state, isBuyer: e.target.checked })
                }
              />
            </TableCell>
          </TableRow>
          {state.isBuyer ? (
            <TableRow>
              <TableCell colSpan={3}>
                <SearchInput
                  options={usersOptions}
                  onChange={handleChangeBuyer}
                  label="Pilih Pembeli"
                  className="!w-full"
                />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={3}>
                <TextField
                  className="w-full"
                  onChange={handleChangeBuyer}
                  id="outlined-basic"
                  label="Nama Pembeli"
                  variant="outlined"
                  required
                />
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={3}>
              <SearchInput
                onChange={onAppendProduct}
                options={productOptions}
                classes={{
                  root: "!w-full",
                }}
                label="Cari Produk"
                required
              />
            </TableCell>
          </TableRow>
          {state.selectedProducts.length > 0 && (
            <>
              {state.selectedProducts.map((it: any, index: number) => {
                return (
                  <TableRow className="relative" key={index}>
                    <TableCell colSpan={2}>
                      <IconButton
                        onClick={() => handleDeleteRow(it)}
                        className="!absolute -top-5 -left-1"
                      >
                        <CancelIcon className="text-red-500" />
                      </IconButton>
                      <p className="pr-10">{it.attributes.name}</p>
                      {toCurrency(it.attributes.price)}
                    </TableCell>
                    <TableCell colSpan={1}>
                      <InputBase
                        value={it.attributes.quantity}
                        onChange={(e) => handleProductQty(e, index)}
                        classes={{
                          input:
                            "!rounded-sm !py-[16.5px] !px-[14px] border !border-gray-400 !ring-1 !focus:ring-2 !focus:ring-blue-500 !ring-gray-400",
                        }}
                        placeholder="Jumlah"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          )}
          <TableRow>
            <TableCell colSpan={2} style={{ verticalAlign: "top" }}>
              Pilih Metode Pembayaran
              {!state.paymentType && (
                <FormHelperText className="text-red-400">
                  Wajib diisi
                </FormHelperText>
              )}
            </TableCell>
            <TableCell>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={state.paymentType}
                  onChange={handleChangePaymentType}
                >
                  {paymentsType.map(
                    (type: { label: string; value: string }) => {
                      return (
                        <FormControlLabel
                          key={type.value}
                          value={type.value}
                          control={<Radio size="small" />}
                          label={type.label}
                        />
                      );
                    }
                  )}
                </RadioGroup>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total Penjualan</TableCell>
            <TableCell>{toCurrency(totalPrice)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        onClick={handleSubmit}
        disabled={!isSubmitAllowed()}
        className="bg-blue-500 w-full mb-20"
        variant="contained"
      >
        Tambah Penjualan
      </Button>
    </div>
  );
}

CreateOrder.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default CreateOrder;

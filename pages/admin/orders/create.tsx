import {
  Button,
  IconButton,
  InputBase,
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
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "components/mui/AppBar";
import SearchIcon from "@mui/icons-material/Search";
import { toCurrency } from "utils";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

const productParams = {
  "fields[products]": "name,price",
};

function CreateOrder() {
  const [state, setState] = useState<{
    isBuyer: boolean;
    selectedProducts: any;
  }>({
    isBuyer: false,
    selectedProducts: [],
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
      return api.get("users");
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
            total + current.attributes.orderQty * current.attributes.price,
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
    newProduct.attributes.orderQty = 1;
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

  const handleProductQty = (e: any, index: number) => {
    const selectedProducts = state.selectedProducts;
    const selectedProduct = state.selectedProducts[index];
    selectedProduct.attributes.orderQty = e.target.value;
    selectedProducts[index] = selectedProduct;
    setState({ ...state, selectedProducts });
  };

  const handleSubmit = () => {
    console.log("here");
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
            <TableCell colSpan={1} className="flex justify-end">
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
                  label="Pilih Pembeli"
                  className="w-full"
                />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={3}>
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Nama Pembeli"
                  variant="outlined"
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
                  root: "w-full",
                }}
                label="Cari Produk"
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
                        className="absolute -top-5 -left-1"
                      >
                        <CancelIcon className="text-red-500" />
                      </IconButton>
                      <p className="pr-10">{it.attributes.name}</p>
                      {toCurrency(it.attributes.price)}
                    </TableCell>
                    <TableCell colSpan={1}>
                      <InputBase
                        value={it.attributes.orderQty}
                        onChange={(e) => handleProductQty(e, index)}
                        classes={{
                          input:
                            "rounded-sm border border-gray-400 ring-1 focus:ring-2 focus:ring-blue-500 !ring-gray-400",
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
            <TableCell colSpan={2}>Total Penjualan</TableCell>
            <TableCell>{toCurrency(totalPrice)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        onSubmit={handleSubmit}
        disabled={!state.selectedProducts.length}
        className="bg-blue-500 w-full"
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

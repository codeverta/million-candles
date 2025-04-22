import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputBase,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import StoreLayout from "components/layout/StoreLayout";
import React, { useMemo, useState } from "react";
import SearchInput from "components/mui/SearchInput";
import { toCurrency } from "utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "utils/api";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "sonner";
import { useGetFetchQuery } from "utils/hooks";
import { useRouter } from "next/router";
import { paymentsType } from "./functions";

function CreateOrder() {
  const router = useRouter();
  const [state, setState] = useState<any>({
    buyerName: "",
    destinationUser: {},
    paymentType: "",
    isBuyer: false,
    selectedProducts: [],
    discount: 0,
    discountType: "percentage",
    shippingCost: 0,
    downPayment: 0,
    printInvoice: true,
  });

  // Add a state to track variant selection modal
  const [variantSelectionData, setVariantSelectionData] = useState<any>({
    isOpen: false,
    product: null,
    selectedVariantCombination: null,
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
      return api.get("products");
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

  // Helper function to check if a product has variants
  const hasVariants = (product) => {
    return product?.attributes?.variant_combinations?.length > 0;
  };

  const totalPrice = useMemo(() => {
    const productTotal = state.selectedProducts.reduce(
      (total: any, current: any) => {
        const price = current.selectedVariantCombination
          ? parseFloat(current.selectedVariantCombination.price)
          : current.attributes.price;
        return total + current.attributes.quantity * price;
      },
      0
    );

    const discountValue =
      state.discountType === "percentage"
        ? (productTotal * state.discount) / 100
        : state.discount;

    return productTotal - discountValue + state.shippingCost;
  }, [state]);

  const remainingPayment = useMemo(() => {
    return totalPrice - state.downPayment;
  }, [totalPrice, state.downPayment]);

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
      label: `(${it.attributes.code}) ${it.attributes.name} - ${toCurrency(
        it.attributes.price
      )}`,
      value: it.id,
    }));
  }, [getProducts]);

  const onAppendProduct = (_: any, value: { label: string; value: string }) => {
    if (!value) {
      return;
    }

    const newProduct = products.data.find((it: any) => it.id == value.value);

    // Check if product has variants
    if (hasVariants(newProduct)) {
      // Open variant selection modal
      setVariantSelectionData({
        isOpen: true,
        product: newProduct,
        selectedVariantCombination: null,
      });
    } else {
      // Regular product without variants
      newProduct.attributes.quantity = 1;
      setState({
        ...state,
        selectedProducts: [
          ...state.selectedProducts,
          { ...newProduct, selectedVariantCombination: null },
        ],
      });
    }
  };

  const handleVariantSelectionConfirm = () => {
    if (
      !variantSelectionData.product ||
      !variantSelectionData.selectedVariantCombination
    ) {
      return;
    }

    const productWithVariant = {
      ...variantSelectionData.product,
      selectedVariantCombination:
        variantSelectionData.selectedVariantCombination,
      attributes: {
        ...variantSelectionData.product.attributes,
        quantity: 1,
      },
    };

    setState({
      ...state,
      selectedProducts: [...state.selectedProducts, productWithVariant],
    });

    // Reset variant selection state
    setVariantSelectionData({
      isOpen: false,
      product: null,
      selectedVariantCombination: null,
    });
  };

  const handleVariantSelectionCancel = () => {
    setVariantSelectionData({
      isOpen: false,
      product: null,
      selectedVariantCombination: null,
    });
  };

  const handleVariantCombinationChange = (variantCombination) => {
    setVariantSelectionData({
      ...variantSelectionData,
      selectedVariantCombination: variantCombination,
    });
  };

  const handleDeleteRow = (it: any) => {
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter(
        (selected: any) =>
          selected.id != it.id ||
          // If same product but different variant combination
          (selected.id === it.id &&
            selected.selectedVariantCombination?.id !==
              it.selectedVariantCombination?.id)
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

  const handleDiscountChange = (e: any) => {
    setState({ ...state, discount: parseFloat(e.target.value) || 0 });
  };

  const handleDiscountTypeChange = (e: any) => {
    setState({ ...state, discountType: e.target.value });
  };

  const handleShippingCostChange = (e: any) => {
    setState({ ...state, shippingCost: parseFloat(e.target.value) || 0 });
  };

  const handleDownPaymentChange = (e: any) => {
    setState({ ...state, downPayment: parseFloat(e.target.value) || 0 });
  };

  const handlePrint = () => {
    if (state.printInvoice) {
      window.print();
    }
  };

  const handleSubmit = () => {
    const payload = {
      data: {
        type: "orders",
        attributes: {
          price_amount: totalPrice,
          discount: state.discount,
          discount_type: state.discountType,
          shipping_cost: state.shippingCost,
          down_payment: state.downPayment,
          remaining_payment: remainingPayment,
          is_validate_seller: true,
          payments_type: state.paymentType,
          buyer_name: state.isBuyer ? undefined : state.buyerName,
        },
        relationships: {
          "origin-users": {
            data: {
              type: "users",
              id: getSelf?.data.me.id + "",
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
        const orderId = res.data.data.id;

        // Create order details with variant information if available
        const batchCreateOrderDetails = state.selectedProducts.map(
          (product: any) => {
            const price = product.selectedVariantCombination
              ? parseFloat(product.selectedVariantCombination.price)
              : product.attributes.price;

            const payload = {
              data: {
                type: "order-details",
                attributes: {
                  qty: parseInt(product.attributes.quantity),
                  price: price,
                  total_price: product.attributes.quantity * price,
                  variant_combination_id:
                    product.selectedVariantCombination?.id || null,
                  variant_sku: product.selectedVariantCombination?.sku || null,
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
            };

            return api.post(`order-details`, payload);
          }
        );

        await Promise.all(batchCreateOrderDetails);

        toast.success("Order berhasil dibuat");
        handlePrint();
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

  // Format the display of variant options
  const getVariantDisplayText = (variantCombination) => {
    if (!variantCombination) return "";
    return variantCombination.sku || "Default";
  };

  // Get price to display for a product
  const getProductPrice = (product) => {
    if (product.selectedVariantCombination) {
      return toCurrency(parseFloat(product.selectedVariantCombination.price));
    }
    return toCurrency(product.attributes.price);
  };

  return (
    <div>
      {/* Product Variant Selection Modal */}
      {variantSelectionData.isOpen && variantSelectionData.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Choose Variant</h2>
            <p className="mb-4">
              {variantSelectionData.product.attributes.name} -{" "}
              {variantSelectionData.product.attributes.code}
            </p>

            <div className="mb-6">
              <FormControl fullWidth className="mb-4">
                <Select
                  value={
                    variantSelectionData.selectedVariantCombination?.id || ""
                  }
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedVariant =
                      variantSelectionData.product.attributes.variant_combinations.find(
                        (v) => v.id.toString() === selectedId.toString()
                      );
                    handleVariantCombinationChange(selectedVariant);
                  }}
                  displayEmpty
                  className="mb-2"
                >
                  <MenuItem value="" disabled>
                    Select variant
                  </MenuItem>
                  {variantSelectionData.product.attributes.variant_combinations.map(
                    (variant) => (
                      <MenuItem key={variant.id} value={variant.id}>
                        {variant.sku} - {toCurrency(parseFloat(variant.price))}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {variantSelectionData.selectedVariantCombination && (
                <div className="mb-4 p-2 bg-gray-100 rounded">
                  <p>
                    <strong>Price:</strong>{" "}
                    {toCurrency(
                      parseFloat(
                        variantSelectionData.selectedVariantCombination.price
                      )
                    )}
                  </p>
                  <p>
                    <strong>Stock:</strong>{" "}
                    {variantSelectionData.selectedVariantCombination.stock}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleVariantSelectionCancel} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleVariantSelectionConfirm}
                variant="contained"
                disabled={!variantSelectionData.selectedVariantCombination}
                className="bg-blue-500"
              >
                Add to Order
              </Button>
            </div>
          </div>
        </div>
      )}

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
                  <TableRow
                    className="relative"
                    key={`${it.id}-${
                      it.selectedVariantCombination?.id || "default"
                    }`}
                  >
                    <TableCell colSpan={2}>
                      <IconButton
                        onClick={() => handleDeleteRow(it)}
                        className="!absolute -top-5 -left-1"
                      >
                        <CancelIcon className="text-red-500" />
                      </IconButton>
                      <p className="pr-10">
                        ({it.attributes.code}) {it.attributes.name}
                        {it.selectedVariantCombination && (
                          <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                            {getVariantDisplayText(
                              it.selectedVariantCombination
                            )}
                          </span>
                        )}
                      </p>
                      {getProductPrice(it)}
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
            <TableCell>Diskon</TableCell>
            <TableCell colSpan={2}>
              <div className="flex items-center gap-4">
                <InputBase
                  value={state.discount}
                  onChange={handleDiscountChange}
                  classes={{
                    input:
                      "!rounded-sm !py-[16.5px] !px-[14px] border !border-gray-400 !ring-1 !focus:ring-2 !focus:ring-blue-500 !ring-gray-400",
                  }}
                  placeholder="Masukkan diskon"
                />
                <FormControl>
                  <RadioGroup
                    row
                    value={state.discountType}
                    onChange={handleDiscountTypeChange}
                  >
                    <FormControlLabel
                      value="nominal"
                      control={<Radio size="small" />}
                      label="Nominal (IDR)"
                    />
                    <FormControlLabel
                      value="percentage"
                      control={<Radio size="small" />}
                      label="Persentase (%)"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ongkir</TableCell>
            <TableCell colSpan={2}>
              <InputBase
                value={state.shippingCost}
                onChange={handleShippingCostChange}
                classes={{
                  input:
                    "!rounded-sm !py-[16.5px] !px-[14px] border !border-gray-400 !ring-1 !focus:ring-2 !focus:ring-blue-500 !ring-gray-400",
                }}
                placeholder="Masukkan ongkir"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jumlah Dibayar/DP</TableCell>
            <TableCell colSpan={2}>
              <InputBase
                value={state.downPayment}
                onChange={handleDownPaymentChange}
                classes={{
                  input:
                    "!rounded-sm !py-[16.5px] !px-[14px] border !border-gray-400 !ring-1 !focus:ring-2 !focus:ring-blue-500 !ring-gray-400",
                }}
                placeholder="Masukkan DP"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sisa Pembayaran</TableCell>
            <TableCell colSpan={2}>{toCurrency(remainingPayment)}</TableCell>
          </TableRow>
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

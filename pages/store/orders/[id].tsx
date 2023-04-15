import React, { useState } from "react";
import StoreLayout from "components/layout/StoreLayout";
import { getRelationships, getRelationship, toCurrency } from "utils";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Backdrop,
  CircularProgress,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { getOrderStatus } from "utils/orders";
import { toast } from "sonner";

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

function OrderDetail() {
  const router = useRouter();
  const [state, setState] = useState({
    payment_type: "",
    isConfirmationOpen: false,
  });
  const updateOrder = useMutation((payload: any) => {
    return api.patch(`orders/${payload.data.id}`, payload);
  });
  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: () => {
      return api.get(`orders/${router.query.id}`, {
        include: "order-details.products",
      });
    },
    onSuccess: (res) => {
      setState({
        ...state,
        payment_type: res.data.data.attributes.payments_type,
      });
    },
    refetchOnWindowFocus: false,
  });

  if (getOrder.isLoading || getOrder.isError) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const handleChangePaymentType = (event: any) => {
    setState({ ...state, payment_type: event.target.value });
  };

  const handleVerify = () => {
    if (!state.payment_type) {
      return;
    }
    updateOrder.mutate(
      {
        data: {
          type: "orders",
          id: getOrder.data.data.data.id,
          attributes: {
            is_validate_buyer: true,
            payments_type: state.payment_type,
          },
        },
      },
      {
        onSuccess: (res) => {
          getOrder.refetch();
          handleConfirmation();
          toast.success(
            "Terima kasih, pesanan anda sedang diproses oleh sistem, harap tunggu konfirmasi dari penjual"
          );
          if (state.payment_type !== "midtrans") {
            return;
          }
          // @ts-ignore
          snap.pay(res.data.data.attributes.snap_token, {
            onSuccess: function (_result: any) {
              /* You may add your own implementation here */
              toast.success(
                "Pembayaran Berhasil! penjual akan segera memverifikasi pesanan anda. Terima kasih telah menggunakan layanan kami."
              );
            },
            onPending: function (_result: any) {
              /* You may add your own implementation here */
              toast.success(
                "Terima kasih telah melakukan pembayaran. Kami sedang menunggu konfirmasi dari penjual untuk memverifikasi pembayaran Anda. Harap bersabar dan tunggu pemberitahuan selanjutnya dari kami. Terima kasih telah menggunakan layanan kami."
              );
            },
            onError: function (_result: any) {
              /* You may add your own implementation here */
              toast.error("Pembayaran Gagal! Silakan hubungi penjual");
            },
            onClose: function () {
              /* You may add your own implementation here */
              alert("you closed the popup without finishing the payment");
            },
          });
        },
        onError: () => {
          toast.error("Maaf terjadi gangguan sistem, harap hubungi penjual");
        },
      }
    );
  };

  const handleConfirmation = () => {
    setState({ ...state, isConfirmationOpen: !state.isConfirmationOpen });
  };

  const orderDetails = getRelationships(
    getOrder.data.data,
    getOrder.data.data.data,
    "order-details"
  );

  return (
    <>
      <Dialog
        open={state.isConfirmationOpen}
        onClose={handleConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Perhatian"}</DialogTitle>
        <DialogContent>
          <DialogContentText className="text-sm" id="alert-dialog-description">
            Apakah anda yakin ingin verifikasi pembayaran ini? Setelah
            pembayaran terverifikasi maka akan langsung diproses oleh penjual.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmation}>Kembali</Button>
          <Button onClick={handleVerify} autoFocus>
            Verifikasi
          </Button>
        </DialogActions>
      </Dialog>
      <Box className="">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>No. Pembayaran</TableCell>
              <TableCell>{getOrder.data.data.data.attributes.code}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                <Chip
                  color={getOrderStatus(getOrder.data.data.data).color}
                  label={getOrderStatus(getOrder.data.data.data).text}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: "top" }}>
                Detail Produk
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            {orderDetails.map((orderDetail: any) => {
              const products = getRelationship(
                getOrder.data.data,
                orderDetail,
                "products"
              );
              return (
                <TableRow className="bg-gray-50" key={orderDetail.id}>
                  <TableCell>
                    <p className="pl-4">- {products.attributes.name}</p>
                  </TableCell>
                  <TableCell>
                    {toCurrency(orderDetail.attributes.price)} x{" "}
                    {orderDetail.attributes.qty}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell>Total Pembayaran</TableCell>
              <TableCell>
                {toCurrency(getOrder.data.data.data.attributes.price_amount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: "top" }}>
                Pilih Metode Pembayaran
                {!state.payment_type && (
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
                    value={state.payment_type}
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
                            disabled={
                              (!!state.payment_type &&
                                getOrder.data.data.data.attributes
                                  .is_validate_buyer) ||
                              getOrder.data.data.data.attributes
                                .is_validate_seller
                            }
                          />
                        );
                      }
                    )}
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          variant="contained"
          onClick={handleConfirmation}
          className="bg-blue-500 w-full"
          disabled={
            !state.payment_type ||
            !!getOrder.data.data.data.attributes.payments_type
          }
        >
          Verifikasi Pembayaran
        </Button>
      </Box>
    </>
  );
}

OrderDetail.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default OrderDetail;

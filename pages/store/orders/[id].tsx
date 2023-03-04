import React, { useState } from "react";
import StoreLayout from "components/layout/StoreLayout";
import { toCurrency } from "utils";
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
} from "@mui/material";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { getOrderStatus } from "utils/orders";
import { toast } from "sonner";

function OrderDetail() {
  const router = useRouter();
  const [state, setState] = useState({
    paymentMethod: undefined,
    isConfirmationOpen: false,
  });
  const updateOrder = useMutation((payload: any) => {
    return api.patch(`orders/${payload.id}`, payload);
  });
  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: () => {
      return api.get(`orders/${router.query.id}`);
    },
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

  const handleChangePaymentMethod = (event: any) => {};

  const handleVerify = () => {
    updateOrder.mutate(
      {
        data: {
          type: "orders",
          id: getOrder.data.data.data.id,
          attributes: {
            is_validate_buyer: true,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success(
            "Terima kasih, pesanan anda sedang diproses oleh sistem, harap tunggu konfirmasi dari penjual"
          );
        },
        onError: () => {
          toast.error("Maaf terjadi gangguan, harap hubungi toko");
        },
      }
    );
  };

  const handleConfirmation = () => {
    setState({ ...state, isConfirmationOpen: !state.isConfirmationOpen });
  };
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
          <Button onClick={handleConfirmation} autoFocus>
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
              <TableCell>Total Pembayaran</TableCell>
              <TableCell>
                {toCurrency(getOrder.data.data.data.attributes.price_amount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: "top" }}>
                Pilih Metode Pembayaran
              </TableCell>
              <TableCell>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={state.paymentMethod}
                    onChange={handleChangePaymentMethod}
                  >
                    <FormControlLabel
                      value="transfer"
                      control={<Radio size="small" />}
                      label="Transfer"
                    />
                    <FormControlLabel
                      value="whatsapp"
                      control={<Radio size="small" />}
                      label="Whatsapp"
                    />
                    <FormControlLabel
                      value="midtrans"
                      control={<Radio size="small" />}
                      label="Midtrans"
                    />
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

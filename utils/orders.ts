export function getOrderStatus(order: any): any {
  console.log({ order });
  const isValidateBuyer = order.attributes.is_validate_buyer;
  const isValidateSeller = order.attributes.is_validate_seller;
  const isShipping = order.attributes.is_shipping;
  const isShipped = order.attributes.is_shipped;

  if (isShipping) {
    return {
      text: "Dalam Pengiriman",
      color: "info",
    };
  }

  if (isShipped) {
    return {
      text: "Sampai Tujuan",
      color: "success",
    };
  }

  if (isValidateSeller) {
    return {
      text: "Terverifikasi Penjual",
      color: "secondary",
    };
  } else if (isValidateBuyer) {
    return {
      text: "Menunggu Verifikasi Penjual",
      color: "primary",
    };
  }

  return {
    text: "Belum Terverifikasi Pembeli",
    color: "warning",
  };
}

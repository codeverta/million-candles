export function getOrderSequence(order: any): {
  priority: number;
  text: string;
} {
  if (order.attributes.is_received) {
    return { priority: 5, text: "Order berhasil diterima" };
  } else if (order.attributes.is_shipped) {
    return { priority: 4, text: "Order telah sampai tujuan" };
  } else if (order.attributes.is_shipping) {
    return { priority: 3, text: "Order berhasil dikirim oleh penjual" };
  } else if (order.attributes.is_validate_seller) {
    return { priority: 2, text: "Order berhasil terverifikasi oleh penjual" };
  } else if (order.attributes.is_validate_buyer) {
    return {
      priority: 1,
      text: "Menunggu verifikasi oleh penjual agar order dapat diproses",
    };
  } else {
    return { priority: 1, text: "" };
  }
}
export function getOrderStatus(order: any): any {
  const isValidateBuyer = order.attributes.is_validate_buyer;
  const isValidateSeller = order.attributes.is_validate_seller;
  const isShipping = order.attributes.is_shipping;
  const isShipped = order.attributes.is_shipped;
  const isReceived = order.attributes.is_received;

  if (isReceived) {
    return {
      text: "Selesai",
      color: "success",
    };
  }

  if (isShipped) {
    return {
      text: "Sampai Tujuan",
      color: "success",
    };
  }

  if (isShipping) {
    return {
      text: "Dalam Pengiriman",
      color: "info",
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

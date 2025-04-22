import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { useRouter } from "next/router";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import AdminLayout from "components/layout/AdminLayout";
import { toCurrency } from "utils";
import dayjs from "dayjs";

function ProductDetail() {
  const router = useRouter();
  const getProduct = useQuery({
    queryKey: ["products", "detail", router.query.id],
    queryFn: () => {
      return api.get(`products/${router.query.id}`);
    },
    enabled: !!router.query.id,
  });

  if (getProduct.isError || getProduct.isLoading) {
    return <LoadingBackdrop />;
  }

  const productData = getProduct.data.data.data.attributes;
  const variantCombinations = productData.variant_combinations || [];
  const productVariants = productData.product_variants || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Product Details
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell>{productData.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Kode</TableCell>
            <TableCell>{productData.code}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Deskripsi</TableCell>
            <TableCell>{productData.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Harga</TableCell>
            <TableCell>{toCurrency(productData.price)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Stock</TableCell>
            <TableCell>{productData.stock}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Terakhir Diperbarui</TableCell>
            <TableCell>{dayjs(productData.updatedAt).format("LLLL")}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Product Variants
      </Typography>

      {productVariants.length > 0 ? (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Variant Types
          </Typography>
          <Table sx={{ mb: 3 }}>
            <TableBody>
              {productVariants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>
                    <strong>{variant.name}</strong>
                  </TableCell>
                  <TableCell>
                    {variant.product_variant_option
                      .map((option) => option.name)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : null}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Variant Combinations
      </Typography>
      {variantCombinations.length > 0 ? (
        <Table>
          <TableBody>
            {variantCombinations.map((combination, index) => (
              <React.Fragment key={combination.id}>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Combination {index + 1}: {combination.sku}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>{combination.sku}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>{toCurrency(combination.price)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Stock</TableCell>
                  <TableCell>{combination.stock}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Variant Options</TableCell>
                  <TableCell>
                    {combination.values &&
                      combination.values.map((value) => (
                        <div key={value.id}>
                          {value.product_variant_option?.product_variant?.name}:{" "}
                          {value.product_variant_option?.name}
                        </div>
                      ))}
                  </TableCell>
                </TableRow>
                {index < variantCombinations.length - 1 && (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ py: 1 }}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>
          No variant combinations available for this product
        </Typography>
      )}
    </Box>
  );
}

ProductDetail.getLayout = (page: React.ReactNode) => {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProductDetail;

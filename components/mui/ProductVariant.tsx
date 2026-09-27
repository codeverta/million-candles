import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { findMatchingVariantCombination } from "utils/variants";

const ProductVariants = ({ product, onVariantChange }: any) => {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string | number>
  >({});
  const [currentCombination, setCurrentCombination] = useState<any>(null);
  const variants = product?.attributes?.product_variants || [];
  const combinations = product?.attributes?.variant_combinations || [];

  useEffect(() => {
    if (!variants.length || !combinations.length) {
      setSelectedVariants({});
      setCurrentCombination(null);
      onVariantChange?.(null);
      return;
    }

    const firstAvailable =
      combinations.find((combination: any) => Number(combination.stock) > 0) ||
      combinations[0];
    const optionIds = new Set(
      (firstAvailable.values || []).map((value: any) =>
        String(
          value.product_variant_option_id ?? value.product_variant_option?.id
        )
      )
    );
    const initialSelections: Record<string, string | number> = {};
    variants.forEach((variant: any) => {
      const selectedOption = (variant.product_variant_option || []).find(
        (option: any) => optionIds.has(String(option.id))
      );
      if (selectedOption) initialSelections[variant.id] = selectedOption.id;
    });
    setSelectedVariants(initialSelections);
  }, [product?.id]);

  useEffect(() => {
    const match = findMatchingVariantCombination(
      combinations,
      selectedVariants
    );
    setCurrentCombination(match);
    onVariantChange?.(match);
  }, [selectedVariants, combinations, onVariantChange]);

  if (!variants.length) return null;

  return (
    <div className="product-variants mb-6">
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Pilih variant
      </Typography>
      {variants.map((variant: any) => (
        <div key={variant.id} className="mb-3">
          <FormControl fullWidth size="small">
            <InputLabel id={`variant-label-${variant.id}`}>
              {variant.name}
            </InputLabel>
            <Select
              labelId={`variant-label-${variant.id}`}
              id={`variant-select-${variant.id}`}
              value={selectedVariants[variant.id] || ""}
              label={variant.name}
              onChange={(event) =>
                setSelectedVariants((current) => ({
                  ...current,
                  [variant.id]: event.target.value,
                }))
              }
            >
              {(variant.product_variant_option || []).map((option: any) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ))}

      {currentCombination ? (
        <Box mt={2} p={2} bgcolor="rgba(0,0,0,0.05)" borderRadius={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            SKU: {currentCombination.sku || "-"}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight="bold">
            {currentCombination.formattedPrice ||
              `Rp ${Number(currentCombination.price).toLocaleString("id-ID")}`}
          </Typography>
          <Typography variant="body2">
            {Number(currentCombination.stock) > 0
              ? `Stok: ${currentCombination.stock}`
              : "Stok habis"}
          </Typography>
        </Box>
      ) : (
        <Typography color="error" variant="body2">
          Kombinasi variant ini tidak tersedia.
        </Typography>
      )}
    </div>
  );
};

export default ProductVariants;

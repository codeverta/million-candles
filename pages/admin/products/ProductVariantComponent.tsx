import { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Chip,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { toast } from "sonner";
import { buildVariantCombinations, combinationKey } from "utils/variants";

const prepareInitialState = (
  existingVariants: any[],
  existingCombinations: any[]
) => {
  const variants = (existingVariants || []).map((variant) => ({
    id: variant.id,
    name: variant.name,
    options: (variant.product_variant_option || []).map((option: any) => ({
      key: String(option.id),
      name: option.name,
    })),
  }));
  const combinations = (existingCombinations || []).map((combination) => ({
    id: combination.id,
    optionKeys: (combination.values || []).map((value: any) =>
      String(
        value.product_variant_option_id ?? value.product_variant_option?.id
      )
    ),
    sku: combination.sku || "",
    price: Number(combination.price || 0),
    stock: Number(combination.stock || 0),
  }));
  return { variants, combinations };
};

const ProductVariantComponent = ({
  existingVariants = [],
  existingCombinations = [],
  onChange,
}: any) => {
  const initial = prepareInitialState(existingVariants, existingCombinations);
  const [variants, setVariants] = useState<any[]>(initial.variants);
  const [combinations, setCombinations] = useState<any[]>(initial.combinations);
  const [currentVariant, setCurrentVariant] = useState<any>({
    name: "",
    options: [],
    currentOption: "",
  });
  const keySequence = useRef(0);

  useEffect(() => {
    const generated = buildVariantCombinations(variants);
    setCombinations((current) =>
      generated.map((combination: any) => {
        const existing = current.find(
          (item) =>
            combinationKey(item.optionKeys) ===
            combinationKey(combination.optionKeys)
        );
        return {
          id: existing?.id,
          optionKeys: combination.optionKeys,
          optionNames: combination.optionNames,
          sku: existing?.sku || "",
          price: Number(existing?.price || 0),
          stock: Number(existing?.stock || 0),
        };
      })
    );
  }, [variants]);

  useEffect(() => {
    onChange?.({ variants, combinations });
  }, [variants, combinations, onChange]);

  const addOption = () => {
    const optionName = currentVariant.currentOption.trim();
    if (!optionName) {
      toast.error("Nama opsi wajib diisi.");
      return;
    }
    if (
      currentVariant.options.some(
        (option: any) => option.name.toLowerCase() === optionName.toLowerCase()
      )
    ) {
      toast.error("Opsi tersebut sudah ada.");
      return;
    }

    keySequence.current += 1;
    setCurrentVariant({
      ...currentVariant,
      currentOption: "",
      options: [
        ...currentVariant.options,
        { key: `new-${Date.now()}-${keySequence.current}`, name: optionName },
      ],
    });
  };

  const addVariant = () => {
    const variantName = currentVariant.name.trim();
    if (!variantName || currentVariant.options.length === 0) {
      toast.error("Isi nama variant dan minimal satu opsi.");
      return;
    }
    if (
      variants.some(
        (variant) => variant.name.toLowerCase() === variantName.toLowerCase()
      )
    ) {
      toast.error("Nama variant tersebut sudah ada.");
      return;
    }

    setVariants([
      ...variants,
      { name: variantName, options: currentVariant.options },
    ]);
    setCurrentVariant({ name: "", options: [], currentOption: "" });
  };

  const updateCombination = (index: number, field: string, value: any) => {
    setCombinations((current) =>
      current.map((combination, combinationIndex) =>
        combinationIndex === index
          ? { ...combination, [field]: value }
          : combination
      )
    );
  };

  return (
    <div className="w-full">
      <Typography variant="h6" gutterBottom>
        Variant dan Kombinasi
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Contoh: variant Warna berisi Merah dan Biru, lalu variant Ukuran berisi
        Kecil dan Besar. Semua kombinasi dibuat otomatis.
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nama variant"
              placeholder="Warna, Ukuran"
              value={currentVariant.name}
              onChange={(event) =>
                setCurrentVariant({
                  ...currentVariant,
                  name: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nama opsi"
              placeholder="Merah, Kecil"
              value={currentVariant.currentOption}
              onChange={(event) =>
                setCurrentVariant({
                  ...currentVariant,
                  currentOption: event.target.value,
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addOption();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={addOption}
              startIcon={<Add />}
              sx={{ height: "56px" }}
            >
              Opsi
            </Button>
          </Grid>
        </Grid>

        {currentVariant.options.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {currentVariant.options.map((option: any, index: number) => (
              <Chip
                key={option.key}
                label={option.name}
                onDelete={() =>
                  setCurrentVariant({
                    ...currentVariant,
                    options: currentVariant.options.filter(
                      (_item: any, optionIndex: number) => optionIndex !== index
                    ),
                  })
                }
              />
            ))}
          </Box>
        )}

        <Button
          type="button"
          variant="contained"
          onClick={addVariant}
          sx={{ mt: 2 }}
        >
          Tambah Variant
        </Button>
      </Paper>

      {variants.map((variant, index) => (
        <Paper
          key={`${variant.name}-${index}`}
          elevation={1}
          sx={{ p: 2, mb: 2 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">{variant.name}</Typography>
            <IconButton
              type="button"
              aria-label={`Hapus variant ${variant.name}`}
              onClick={() =>
                setVariants((current) =>
                  current.filter(
                    (_item, variantIndex) => variantIndex !== index
                  )
                )
              }
            >
              <Delete />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {variant.options.map((option: any) => (
              <Chip key={option.key} label={option.name} />
            ))}
          </Box>
        </Paper>
      ))}

      {combinations.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Kombinasi Variant
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Kombinasi</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Harga</TableCell>
                  <TableCell>Stok</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combinations.map((combination, index) => (
                  <TableRow key={combinationKey(combination.optionKeys)}>
                    <TableCell>
                      {combination.optionNames?.join(" / ")}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={combination.sku}
                        onChange={(event) =>
                          updateCombination(index, "sku", event.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={combination.price}
                        onChange={(event) =>
                          updateCombination(
                            index,
                            "price",
                            Number(event.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={combination.stock}
                        onChange={(event) =>
                          updateCombination(
                            index,
                            "stock",
                            Number(event.target.value)
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

export default ProductVariantComponent;

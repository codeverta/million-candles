import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  Chip,
  Box,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import api from "utils/api";
import { toast } from "sonner";

const ProductVariantComponent = ({
  productId,
  existingVariants = [],
  onChange,
}) => {
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    name: "",
    options: [],
    currentOption: "",
  });
  const [combinations, setCombinations] = useState([]);

  // Load existing variants on component mount if productId exists
  useEffect(() => {
    if (productId) {
      loadExistingVariants();
    }
  }, [productId]);

  // Generate combinations when variants change
  useEffect(() => {
    if (variants.length > 0) {
      generateCombinations();
    }
  }, [variants]);

  const loadExistingVariants = async () => {
    try {
      // Fetch product variants
      const variantsResponse = await api.get(
        `product-variants?product_id=${productId}`
      );

      // Transform data structure to match our component state
      const loadedVariants = [];

      for (const variant of variantsResponse.data) {
        // Fetch options for this variant
        const optionsResponse = await api.get(
          `product-variant-options?product_variant_id=${variant.id}`
        );

        loadedVariants.push({
          id: variant.id,
          name: variant.name,
          options: optionsResponse.data.map((option) => ({
            id: option.id,
            name: option.name,
          })),
        });
      }

      setVariants(loadedVariants);

      // Fetch combinations
      const combinationsResponse = await api.get(
        `variant-combinations?product_id=${productId}`
      );
      setCombinations(
        combinationsResponse.data.map((combo) => ({
          id: combo.id,
          sku: combo.attributes.sku,
          price: combo.attributes.price,
          stock: combo.attributes.stock,
          option_ids: combo.relationships.options.data.map((opt) => opt.id),
        }))
      );
    } catch (error) {
      console.error("Error loading variants:", error);
      toast.error("Failed to load product variants");
    }
  };

  // Add a new variant
  const addVariant = () => {
    if (!currentVariant.name.trim()) {
      toast.error("Variant name cannot be empty");
      return;
    }

    if (currentVariant.options.length === 0) {
      toast.error("Please add at least one option");
      return;
    }

    setVariants([...variants, { ...currentVariant }]);
    setCurrentVariant({ name: "", options: [], currentOption: "" });
  };

  // Add option to current variant
  const addOption = () => {
    if (!currentVariant.currentOption.trim()) {
      toast.error("Option name cannot be empty");
      return;
    }

    setCurrentVariant({
      ...currentVariant,
      options: [
        ...currentVariant.options,
        { name: currentVariant.currentOption },
      ],
      currentOption: "",
    });
  };

  // Remove variant
  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  // Remove option from current variant
  const removeOption = (index) => {
    const newOptions = [...currentVariant.options];
    newOptions.splice(index, 1);
    setCurrentVariant({ ...currentVariant, options: newOptions });
  };

  // Generate all possible combinations of options
  const generateCombinations = () => {
    if (variants.length === 0) {
      setCombinations([]);
      return;
    }

    const generateCombos = (
      variantIndex,
      currentCombo = [],
      currentOptions = []
    ) => {
      if (variantIndex >= variants.length) {
        // We've gone through all variants, add this combination
        return [
          {
            options: [...currentOptions],
            optionNames: currentCombo.join(" / "),
            sku: "",
            price: 0,
            stock: 0,
          },
        ];
      }

      const variant = variants[variantIndex];
      let combos = [];

      for (const option of variant.options) {
        const newCombo = [...currentCombo, option.name];
        const newOptions = [
          ...currentOptions,
          {
            variantName: variant.name,
            optionName: option.name,
            optionId: option.id,
          },
        ];

        combos = combos.concat(
          generateCombos(variantIndex + 1, newCombo, newOptions)
        );
      }

      return combos;
    };

    // Generate all combinations
    const newCombos = generateCombos(0);

    // Preserve existing values for combinations that already exist
    const preservedCombos = newCombos.map((combo) => {
      const optionIds = combo.options
        .map((opt) => opt.optionId)
        .filter((id) => id);

      // Find existing combination with matching options
      const existing = combinations.find((c) => {
        if (!c.option_ids || c.option_ids.length !== optionIds.length)
          return false;
        return optionIds.every((id) => c.option_ids.includes(id));
      });

      if (existing) {
        return {
          ...combo,
          sku: existing.sku || "",
          price: existing.price || 0,
          stock: existing.stock || 0,
        };
      }

      return combo;
    });

    setCombinations(preservedCombos);

    // Inform parent component
    if (onChange) {
      onChange({ variants, combinations: preservedCombos });
    }
  };

  // Update combination values
  const updateCombination = (index, field, value) => {
    const newCombinations = [...combinations];
    newCombinations[index][field] = value;
    setCombinations(newCombinations);

    // Inform parent component
    if (onChange) {
      onChange({ variants, combinations: newCombinations });
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Product Variants
      </Typography>

      {/* Current variant form */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add New Variant
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Variant Name"
              placeholder="e.g. Color, Size"
              value={currentVariant.name}
              onChange={(e) =>
                setCurrentVariant({ ...currentVariant, name: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Option"
              placeholder="e.g. Red, Small"
              value={currentVariant.currentOption}
              onChange={(e) =>
                setCurrentVariant({
                  ...currentVariant,
                  currentOption: e.target.value,
                })
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addOption();
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={addOption}
              startIcon={<Add />}
              sx={{ height: "56px" }}
            >
              Add Option
            </Button>
          </Grid>
        </Grid>

        {/* Current variant options */}
        {currentVariant.options.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Options:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {currentVariant.options.map((option, index) => (
                <Chip
                  key={index}
                  label={option.name}
                  onDelete={() => removeOption(index)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={addVariant}
          disabled={!currentVariant.name || currentVariant.options.length === 0}
          sx={{ mt: 2 }}
        >
          Add Variant
        </Button>
      </Paper>

      {/* Variant list */}
      {variants.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Added Variants
          </Typography>

          {variants.map((variant, index) => (
            <Box
              key={index}
              sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">{variant.name}</Typography>
                <IconButton onClick={() => removeVariant(index)} size="small">
                  <Delete fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {variant.options.map((option, optIndex) => (
                  <Chip key={optIndex} label={option.name} size="small" />
                ))}
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {/* Combinations table */}
      {combinations.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Variant Combinations
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Combination</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combinations.map((combo, index) => (
                  <TableRow key={index}>
                    <TableCell>{combo.optionNames}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={combo.sku}
                        onChange={(e) =>
                          updateCombination(index, "sku", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={combo.price}
                        onChange={(e) =>
                          updateCombination(
                            index,
                            "price",
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={combo.stock}
                        onChange={(e) =>
                          updateCombination(
                            index,
                            "stock",
                            Number(e.target.value)
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

const optionId = (value) =>
  String(
    value?.product_variant_option_id ??
      value?.product_variant_option?.id ??
      value?.id ??
      ""
  );

const getCombinationOptionIds = (combination) =>
  (combination?.values || []).map(optionId).filter(Boolean).sort();

const findMatchingVariantCombination = (combinations, selectedOptionIds) => {
  const selected = Object.values(selectedOptionIds || {})
    .map(String)
    .filter(Boolean)
    .sort();

  if (selected.length === 0) return null;

  return (
    (combinations || []).find((combination) => {
      const combinationOptions = getCombinationOptionIds(combination);
      return (
        combinationOptions.length === selected.length &&
        combinationOptions.every((id, index) => id === selected[index])
      );
    }) || null
  );
};

const buildVariantCombinations = (variants) => {
  if (
    !variants?.length ||
    variants.some((variant) => !variant.options?.length)
  ) {
    return [];
  }

  return variants.reduce(
    (combinations, variant) =>
      combinations.flatMap((combination) =>
        variant.options.map((option) => ({
          optionKeys: [...combination.optionKeys, option.key],
          optionNames: [...combination.optionNames, option.name],
        }))
      ),
    [{ optionKeys: [], optionNames: [] }]
  );
};

const combinationKey = (optionKeys) =>
  (optionKeys || []).map(String).sort().join("|");

module.exports = {
  buildVariantCombinations,
  combinationKey,
  findMatchingVariantCombination,
  getCombinationOptionIds,
};

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildVariantCombinations,
  combinationKey,
  findMatchingVariantCombination,
} = require("../utils/variants");

test("buildVariantCombinations creates the cartesian product", () => {
  const combinations = buildVariantCombinations([
    {
      name: "Warna",
      options: [
        { key: "red", name: "Merah" },
        { key: "blue", name: "Biru" },
      ],
    },
    {
      name: "Ukuran",
      options: [
        { key: "small", name: "Kecil" },
        { key: "large", name: "Besar" },
      ],
    },
  ]);

  assert.equal(combinations.length, 4);
  assert.deepEqual(
    combinations.map((combination) => combination.optionNames.join(" / ")),
    ["Merah / Kecil", "Merah / Besar", "Biru / Kecil", "Biru / Besar"]
  );
});

test("findMatchingVariantCombination requires every selected option", () => {
  const combinations = [
    {
      id: 1,
      values: [
        { product_variant_option_id: 10 },
        { product_variant_option_id: 20 },
      ],
    },
    {
      id: 2,
      values: [
        { product_variant_option_id: 10 },
        { product_variant_option_id: 21 },
      ],
    },
  ];

  assert.equal(
    findMatchingVariantCombination(combinations, { color: 10, size: 21 }).id,
    2
  );
  assert.equal(
    findMatchingVariantCombination(combinations, { color: 10 }),
    null
  );
});

test("combinationKey is stable regardless of option order", () => {
  assert.equal(
    combinationKey(["size-large", "color-red"]),
    "color-red|size-large"
  );
});

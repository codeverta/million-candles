<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVariantCombinationRequest;
use App\Http\Requests\SyncProductVariantsRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductVariantOption;
use App\Models\VariantCombination;
use App\Models\VariantCombinationValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VariantCombinationController extends Controller
{
    public function index(Request $request)
    {
        return VariantCombination::with('values.productVariantOption.productVariant')
            ->when(
                $request->filled('product_id'),
                fn ($query) => $query->where('product_id', $request->integer('product_id'))
            )
            ->get();
    }

    public function sync(SyncProductVariantsRequest $request, Product $product)
    {
        $data = $request->validated();
        $variantCount = count($data['variants']);
        $expectedCombinationCount = $variantCount === 0
            ? 0
            : array_product(array_map(
                fn ($variant) => count($variant['options']),
                $data['variants']
            ));

        if (count($data['combinations']) !== $expectedCombinationCount) {
            throw ValidationException::withMessages([
                'combinations' => 'Semua kombinasi opsi harus dikirim lengkap.',
            ]);
        }

        $optionVariantIndexes = [];
        foreach ($data['variants'] as $variantIndex => $variant) {
            foreach ($variant['options'] as $option) {
                if (isset($optionVariantIndexes[$option['key']])) {
                    throw ValidationException::withMessages([
                        'variants' => 'Setiap opsi harus memiliki key yang unik.',
                    ]);
                }
                $optionVariantIndexes[$option['key']] = $variantIndex;
            }
        }

        $signatures = [];
        foreach ($data['combinations'] as $combination) {
            $keys = $combination['option_keys'];
            $variantIndexes = array_map(
                fn ($key) => $optionVariantIndexes[$key] ?? null,
                $keys
            );
            if (
                in_array(null, $variantIndexes, true) ||
                count($keys) !== $variantCount ||
                count(array_unique($variantIndexes)) !== $variantCount
            ) {
                throw ValidationException::withMessages([
                    'combinations' => 'Setiap kombinasi harus memilih tepat satu opsi dari setiap variant.',
                ]);
            }

            sort($keys);
            $signature = implode('|', $keys);
            if (isset($signatures[$signature])) {
                throw ValidationException::withMessages([
                    'combinations' => 'Kombinasi opsi tidak boleh duplikat.',
                ]);
            }
            $signatures[$signature] = true;
        }

        $existingVariantIds = $product->productVariants()->pluck('id');
        $existingOptionIds = ProductVariantOption::whereIn(
            'product_variant_id',
            $existingVariantIds
        )->pluck('id');
        $existingCombinationIds = $product->variantCombinations()->pluck('id');
        $incomingVariantIds = collect($data['variants'])->pluck('id')->filter();
        $incomingCombinationIds = collect($data['combinations'])->pluck('id')->filter();

        if (
            $incomingVariantIds->diff($existingVariantIds)->isNotEmpty() ||
            $incomingCombinationIds->diff($existingCombinationIds)->isNotEmpty()
        ) {
            throw ValidationException::withMessages([
                'variants' => 'Variant atau kombinasi bukan milik produk ini.',
            ]);
        }

        foreach (array_keys($optionVariantIndexes) as $optionKey) {
            if (ctype_digit((string) $optionKey) && !$existingOptionIds->contains((int) $optionKey)) {
                throw ValidationException::withMessages([
                    'variants' => 'Opsi variant bukan milik produk ini.',
                ]);
            }
        }

        $obsoleteCombinationIds = $existingCombinationIds->diff($incomingCombinationIds);
        if (
            $obsoleteCombinationIds->isNotEmpty() &&
            DB::table('order_details')
                ->whereIn('variant_combination_id', $obsoleteCombinationIds)
                ->exists()
        ) {
            throw ValidationException::withMessages([
                'combinations' => 'Kombinasi yang sudah dipakai dalam pesanan tidak dapat dihapus.',
            ]);
        }

        DB::transaction(function () use (
            $product,
            $data,
            $existingVariantIds,
            $existingOptionIds,
            $existingCombinationIds
        ) {
            $optionIds = [];
            $retainedVariantIds = [];
            $retainedOptionIds = [];
            foreach ($data['variants'] as $variantData) {
                $variant = !empty($variantData['id'])
                    ? ProductVariant::where('product_id', $product->id)
                        ->findOrFail($variantData['id'])
                    : new ProductVariant(['product_id' => $product->id]);
                $variant->name = $variantData['name'];
                $variant->save();
                $retainedVariantIds[] = $variant->id;

                foreach ($variantData['options'] as $optionData) {
                    $option = ctype_digit((string) $optionData['key'])
                        ? ProductVariantOption::findOrFail((int) $optionData['key'])
                        : new ProductVariantOption();
                    $option->product_variant_id = $variant->id;
                    $option->name = $optionData['name'];
                    $option->save();
                    $optionIds[$optionData['key']] = $option->id;
                    $retainedOptionIds[] = $option->id;
                }
            }

            $retainedCombinationIds = [];
            foreach ($data['combinations'] as $combinationData) {
                $combination = !empty($combinationData['id'])
                    ? VariantCombination::where('product_id', $product->id)
                        ->findOrFail($combinationData['id'])
                    : new VariantCombination(['product_id' => $product->id]);
                $combination->sku = $combinationData['sku'] ?: null;
                $combination->price = $combinationData['price'];
                $combination->stock = $combinationData['stock'];
                $combination->save();
                $retainedCombinationIds[] = $combination->id;
                $combination->values()->delete();
                foreach ($combinationData['option_keys'] as $optionKey) {
                    VariantCombinationValue::create([
                        'variant_combination_id' => $combination->id,
                        'product_variant_option_id' => $optionIds[$optionKey],
                    ]);
                }
            }

            $obsoleteCombinationIds = $existingCombinationIds->diff($retainedCombinationIds);
            VariantCombinationValue::whereIn(
                'variant_combination_id',
                $obsoleteCombinationIds
            )->delete();
            VariantCombination::whereIn('id', $obsoleteCombinationIds)->delete();
            ProductVariantOption::whereIn(
                'id',
                $existingOptionIds->diff($retainedOptionIds)
            )->delete();
            ProductVariant::whereIn(
                'id',
                $existingVariantIds->diff($retainedVariantIds)
            )->delete();
        });

        return response()->json([
            'message' => 'Variant produk berhasil disimpan.',
            'data' => $product->load([
                'productVariants.productVariantOption',
                'variantCombinations.values.productVariantOption.productVariant',
            ]),
        ]);
    }

    public function store(StoreVariantCombinationRequest $request)
    {
        $combination = VariantCombination::create($request->only(['product_id', 'sku', 'price', 'stock']));

        foreach ($request->option_ids as $optionId) {
            VariantCombinationValue::create([
                'variant_combination_id' => $combination->id,
                'product_variant_option_id' => $optionId,
            ]);
        }

        return response()->json($combination->load('values'), 201);
    }

    public function show($id)
    {
        return VariantCombination::with('values')->findOrFail($id);
    }

    public function update(StoreVariantCombinationRequest $request, $id)
    {
        $combination = VariantCombination::findOrFail($id);
        $combination->update($request->only(['sku', 'price', 'stock']));

        $combination->values()->delete();
        foreach ($request->option_ids as $optionId) {
            VariantCombinationValue::create([
                'variant_combination_id' => $combination->id,
                'product_variant_option_id' => $optionId,
            ]);
        }

        return response()->json($combination->load('values'));
    }

    public function destroy($id)
    {
        $combination = VariantCombination::findOrFail($id);
        $combination->values()->delete();
        $combination->delete();

        return response()->json(null, 204);
    }
}

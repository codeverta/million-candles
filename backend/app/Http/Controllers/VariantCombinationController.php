<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVariantCombinationRequest;
use App\Models\VariantCombination;
use App\Models\VariantCombinationValue;
use Illuminate\Http\Request;

class VariantCombinationController extends Controller
{
    public function index()
    {
        return VariantCombination::with('values')->get();
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
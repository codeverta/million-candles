<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductVariantRequest;
use App\Models\ProductVariant;

class ProductVariantController extends Controller
{
    public function index()
    {
        return ProductVariant::with('options')->get();
    }

    public function store(StoreProductVariantRequest $request)
    {
        $variant = ProductVariant::create($request->validated());
        return response()->json($variant->load('options'), 201);
    }

    public function show($id)
    {
        return ProductVariant::with('options')->findOrFail($id);
    }

    public function update(StoreProductVariantRequest $request, $id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->update($request->validated());
        return response()->json($variant->load('options'));
    }

    public function destroy($id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->options()->delete(); // delete all related options first
        $variant->delete();
        return response()->json(null, 204);
    }
}

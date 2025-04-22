<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductVariantRequest;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductVariant::with('productVariantOption');
        
        // Filter by product_id if provided
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }
        
        return $query->get();    
    }

    public function store(StoreProductVariantRequest $request)
    {
        $variant = ProductVariant::create($request->validated());
        return response()->json($variant->load('productVariantOption'), 201);
    }

    public function show($id)
    {

        return ProductVariant::with('productVariantOption')->findOrFail($id);
    }

    public function update(StoreProductVariantRequest $request, $id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->update($request->validated());
        return response()->json($variant->load('productVariantOption'));
    }

    public function destroy($id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->productVariantOption()->delete(); // delete all related options first
        $variant->delete();
        return response()->json(null, 204);
    }
}

<?php

// app/Http/Controllers/API/ProductVariantOptionController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductVariantOptionRequest;
use App\Models\ProductVariantOption;
use Illuminate\Http\Request;

class ProductVariantOptionController extends Controller
{
    public function index()
    {
        return ProductVariantOption::all();
    }

    public function store(StoreProductVariantOptionRequest $request)
    {
        $option = ProductVariantOption::create($request->validated());
        return response()->json($option, 201);
    }

    public function show($id)
    {
        return ProductVariantOption::findOrFail($id);
    }

    public function update(StoreProductVariantOptionRequest $request, $id)
    {
        $option = ProductVariantOption::findOrFail($id);
        $option->update($request->validated());
        return response()->json($option);
    }

    public function destroy($id)
    {
        $option = ProductVariantOption::findOrFail($id);
        $option->delete();
        return response()->json(null, 204);
    }
}

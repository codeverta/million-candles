<?php

// app/Http/Controllers/API/MaterialController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index()
    {
        return Material::with('supplier')->get()->map(function ($item) {
            $item->is_low_stock = $item->stock < $item->minimum_stock;
            return $item;
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:materials',
            'name' => 'required|string',
            'unit' => 'required|string',
            'stock' => 'numeric',
            'minimum_stock' => 'numeric',
            'price_per_unit' => 'numeric',
            'supplier_id' => 'nullable|exists:users,id'
        ]);

        return Material::create($validated);
    }

    public function show(Material $material)
    {
        return $material->load('stockMovements');
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'name' => 'string',
            'unit' => 'string',
            'stock' => 'numeric',
            'minimum_stock' => 'numeric',
            'price_per_unit' => 'numeric',
            'supplier_id' => 'nullable|exists:users,id'
        ]);

        $material->update($validated);
        return $material;
    }

    public function destroy(Material $material)
    {
        $material->delete();
        return response()->noContent();
    }
}

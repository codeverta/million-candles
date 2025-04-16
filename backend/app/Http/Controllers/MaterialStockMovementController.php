<?php

// app/Http/Controllers/API/MaterialStockMovementController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialStockMovement;
use Illuminate\Http\Request;

class MaterialStockMovementController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'type' => 'required|in:masuk,keluar',
            'quantity' => 'required|numeric|min:0.01',
            'note' => 'nullable|string'
        ]);

        $material = Material::findOrFail($validated['material_id']);
        $movement = MaterialStockMovement::create($validated);

        // Update stock
        if ($validated['type'] === 'masuk') {
            $material->stock += $validated['quantity'];
        } else {
            $material->stock -= $validated['quantity'];
        }

        $material->save();

        return response()->json(['message' => 'Stock updated', 'material' => $material]);
    }
}

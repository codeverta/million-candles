<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the stock movements.
     */
    public function index(Request $request): View
    {
        $query = StockMovement::with('product');
        
        // Date filtering
        if ($request->filled('start_date') || $request->filled('end_date')) {
            $startDate = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
            $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date)->endOfDay() : null;
            
            $query->dateBetween($startDate, $endDate);
        }
        
        // Type filtering
        if ($request->filled('type') && in_array($request->type, ['in', 'out', 'adjustment'])) {
            $query->where('type', $request->type);
        }
        
        // Product filtering
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }
        
        // Order the stock movements by date, newest first
        $query->orderBy('date', 'desc')->orderBy('id', 'desc');
        
        $stockMovements = $query->paginate(15)->appends($request->all());
        
        // Get products for filter dropdown
        $products = Product::orderBy('name')->get();
        
        return view('inventory.stock-movements.index', compact('stockMovements', 'products'));
    }

    /**
     * Show the form for creating a new stock movement.
     */
    public function create(): View
    {
        $products = Product::orderBy('name')->get();
        
        return view('inventory.stock-movements.create', compact('products'));
    }

    /**
     * Store a newly created stock movement in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,adjustment',
            'qty' => 'required|integer',
            'reason' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Additional validation based on type
        $product = Product::findOrFail($request->product_id);
        $currentStock = $product->current_stock ?? 0;
        
        if ($request->type === 'out' && $request->qty > $currentStock) {
            return back()
                ->withErrors(['qty' => 'Not enough stock available.'])
                ->withInput();
        }

        // Create the stock movement
        StockMovement::create($request->all());
        
        // Update the product stock
        if ($request->type === 'in') {
            $product->current_stock = $currentStock + $request->qty;
        } elseif ($request->type === 'out') {
            $product->current_stock = $currentStock - $request->qty;
        } elseif ($request->type === 'adjustment') {
            $product->current_stock = $request->qty; // Direct adjustment to specified value
        }
        
        $product->save();

        return redirect()->route('stock-movements.index')
            ->with('success', 'Stock movement recorded successfully.');
    }

    /**
     * Display the specified stock movement.
     */
    public function show(StockMovement $stockMovement): View
    {
        return view('inventory.stock-movements.show', compact('stockMovement'));
    }

    /**
     * Show the form for editing the specified stock movement.
     */
    public function edit(StockMovement $stockMovement): View
    {
        $products = Product::orderBy('name')->get();
        
        return view('inventory.stock-movements.edit', compact('stockMovement', 'products'));
    }

    /**
     * Update the specified stock movement in storage.
     */
    public function update(Request $request, StockMovement $stockMovement): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,adjustment',
            'qty' => 'required|integer',
            'reason' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Get the product
        $product = Product::findOrFail($request->product_id);
        $currentStock = $product->current_stock ?? 0;
        
        // Calculate stock adjustment needed
        // First remove the effect of the original movement
        if ($stockMovement->type === 'in') {
            $currentStock -= $stockMovement->qty;
        } elseif ($stockMovement->type === 'out') {
            $currentStock += $stockMovement->qty;
        } elseif ($stockMovement->type === 'adjustment') {
            // Complicated case - need to reset to pre-adjustment stock
            // This is simplified and might need adjustment in a real system
            $previousMovements = StockMovement::where('product_id', $product->id)
                ->where('id', '<', $stockMovement->id)
                ->orderBy('date', 'desc')
                ->orderBy('id', 'desc')
                ->first();
                
            if ($previousMovements) {
                $currentStock = $previousMovements->qty;
            } else {
                $currentStock = 0; // Default if no previous adjustment
            }
        }
        
        // Now apply the new movement
        if ($request->type === 'in') {
            $currentStock += $request->qty;
        } elseif ($request->type === 'out') {
            // Check if we have enough stock
            if ($request->qty > $currentStock) {
                return back()
                    ->withErrors(['qty' => 'Not enough stock available.'])
                    ->withInput();
            }
            $currentStock -= $request->qty;
        } elseif ($request->type === 'adjustment') {
            $currentStock = $request->qty; // Direct adjustment
        }
        
        // Update the stock movement
        $stockMovement->update($request->all());
        
        // Update the product stock
        $product->current_stock = $currentStock;
        $product->save();

        return redirect()->route('stock-movements.index')
            ->with('success', 'Stock movement updated successfully.');
    }

    /**
     * Remove the specified stock movement from storage.
     */
    public function destroy(StockMovement $stockMovement): RedirectResponse
    {
        // Get the product
        $product = $stockMovement->product;
        $currentStock = $product->current_stock ?? 0;
        
        // Reverse the effect of this stock movement
        if ($stockMovement->type === 'in') {
            $product->current_stock = $currentStock - $stockMovement->qty;
        } elseif ($stockMovement->type === 'out') {
            $product->current_stock = $currentStock + $stockMovement->qty;
        } elseif ($stockMovement->type === 'adjustment') {
            // For adjustment, this is complicated and might require recalculating the entire stock history
            // This is a simplified approach
            $previousMovement = StockMovement::where('product_id', $product->id)
                ->where('id', '<', $stockMovement->id)
                ->orderBy('date', 'desc')
                ->orderBy('id', 'desc')
                ->first();
                
            if ($previousMovement) {
                $product->current_stock = $previousMovement->qty;
            } else {
                $product->current_stock = 0; // Default if no previous adjustment
            }
        }
        
        $product->save();
        $stockMovement->delete();

        return redirect()->route('stock-movements.index')
            ->with('success', 'Stock movement deleted successfully.');
    }
    
    /**
     * Display inventory report with filters
     */
    public function report(Request $request): View
    {
        // Date filtering
        $startDate = $request->filled('start_date') 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::now()->subMonth()->startOfDay();
            
        $endDate = $request->filled('end_date') 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::now()->endOfDay();
        
        // Get product list
        $products = Product::orderBy('name')->get();
        
        // Product filtering
        $selectedProductId = $request->filled('product_id') ? $request->product_id : null;
        
        // Get stock movements for the selected period and product
        $query = StockMovement::with('product')
            ->dateBetween($startDate, $endDate);
            
        if ($selectedProductId) {
            $query->where('product_id', $selectedProductId);
        }
        
        $stockMovements = $query->orderBy('date')
            ->orderBy('id')
            ->get();
            
        // Calculate stock movement summary
        $summary = [];
        
        foreach ($products as $product) {
            if ($selectedProductId && $product->id != $selectedProductId) {
                continue;
            }
            
            $productMovements = $stockMovements->where('product_id', $product->id);
            
            // Calculate totals for this product
            $totalIn = $productMovements->where('type', 'in')->sum('qty');
            $totalOut = $productMovements->where('type', 'out')->sum('qty');
            $adjustments = $productMovements->where('type', 'adjustment');
            $lastAdjustment = $adjustments->last();
            
            $summary[] = [
                'product' => $product,
                'total_in' => $totalIn,
                'total_out' => $totalOut,
                'adjustments_count' => $adjustments->count(),
                'last_adjustment' => $lastAdjustment,
                'current_stock' => $product->current_stock ?? 0
            ];
        }
        
        return view('inventory.stock-movements.report', compact(
            'stockMovements',
            'products',
            'startDate',
            'endDate',
            'selectedProductId',
            'summary'
        ));
    }

    /**
     * Get stock movements with filters
     */
    public function getStockMovements(Request $request): JsonResponse
    {
        $query = StockMovement::with('product');
        
        // Date filtering
        if ($request->filled('start_date') || $request->filled('end_date')) {
            $startDate = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
            $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date)->endOfDay() : null;
            
            $query->dateBetween($startDate, $endDate);
        }
        
        // Type filtering
        if ($request->filled('type') && in_array($request->type, ['in', 'out', 'adjustment'])) {
            $query->where('type', $request->type);
        }
        
        // Product filtering
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }
        
        // Order the stock movements by date, newest first
        $query->orderBy('date', 'desc')->orderBy('id', 'desc');
        
        // Pagination
        $perPage = $request->per_page ?? 15;
        $stockMovements = $query->paginate($perPage);
        
        return response()->json($stockMovements);
    }
    
    /**
     * Get product stock levels
     */
    public function getStockLevels(Request $request): JsonResponse
    {
        // Product filtering
        $query = Product::query();
        
        if ($request->filled('product_id')) {
            $query->where('id', $request->product_id);
        }
        
        $products = $query->get();
        
        $result = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku ?? '',
                'current_stock' => $product->current_stock ?? 0,
            ];
        });
        
        return response()->json($result);
    }
    
    /**
     * Create a new stock movement
     */
    public function storeStockMovement(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,adjustment',
            'qty' => 'required|integer',
            'reason' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        // Get the product
        $product = Product::findOrFail($request->product_id);
        $currentStock = $product->current_stock ?? 0;
        
        // Validate stock levels for outgoing movements
        if ($request->type === 'out' && $request->qty > $currentStock) {
            return response()->json([
                'message' => 'Not enough stock available',
                'errors' => [
                    'qty' => ['Not enough stock available.']
                ]
            ], 422);
        }

        // Create the stock movement
        $stockMovement = StockMovement::create($validatedData);
        
        // Update the product stock
        if ($request->type === 'in') {
            $product->current_stock = $currentStock + $request->qty;
        } elseif ($request->type === 'out') {
            $product->current_stock = $currentStock - $request->qty;
        } elseif ($request->type === 'adjustment') {
            $product->current_stock = $request->qty; // Direct adjustment
        }
        
        $product->save();
        
        return response()->json([
            'message' => 'Stock movement created successfully',
            'stock_movement' => $stockMovement,
            'product_stock' => $product->current_stock
        ], 201);
    }
}
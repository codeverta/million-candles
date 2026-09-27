<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|min:10',
            'author_name' => 'nullable|string|max:255',
        ]);

        if (
            !empty($validated['author_name']) &&
            !$request->user()->hasRole('merchant')
        ) {
            return response()->json([
                'message' => 'Only merchants can enter a review author name.',
            ], 403);
        }

        $review = ProductReview::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'rating' => $validated['rating'],
            'review' => $validated['review'],
            'author_name' => $validated['author_name'] ?? null,
            'is_approved' => true, // or false if admin approval is required
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'data' => $review
        ], 201);
    }

    public function index()
    {
        $reviews = ProductReview::with(['product', 'user'])->latest()->paginate(20);

        return response()->json([
            'data' => $reviews
        ]);
    }

    public function approve(ProductReview $review)
    {
        $review->update(['is_approved' => true]);

        return response()->json([
            'message' => 'Review approved.',
            'data' => $review
        ]);
    }

    public function destroy(ProductReview $review)
    {
        $review->delete();

        return response()->json([
            'message' => 'Review deleted.'
        ]);
    }
}

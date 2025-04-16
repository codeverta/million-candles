<?php

namespace App\Http\Controllers;

use App\Models\FinancialCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class FinancialCategoryController extends Controller
{
    /**
     * Display a listing of the financial categories.
     */
    public function index(): View
    {
        $categories = FinancialCategory::orderBy('name')->paginate(15);
        
        return view('financial.categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new financial category.
     */
    public function create(): View
    {
        return view('financial.categories.create');
    }

    /**
     * Store a newly created financial category in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:financial_categories',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        FinancialCategory::create($request->all());

        return redirect()->route('financial-categories.index')
            ->with('success', 'Financial category created successfully.');
    }

    /**
     * Display the specified financial category.
     */
    public function show(FinancialCategory $financialCategory): View
    {
        return view('financial.categories.show', compact('financialCategory'));
    }

    /**
     * Show the form for editing the specified financial category.
     */
    public function edit(FinancialCategory $financialCategory): View
    {
        return view('financial.categories.edit', compact('financialCategory'));
    }

    /**
     * Update the specified financial category in storage.
     */
    public function update(Request $request, FinancialCategory $financialCategory): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:financial_categories,name,' . $financialCategory->id,
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $financialCategory->update($request->all());

        return redirect()->route('financial-categories.index')
            ->with('success', 'Financial category updated successfully.');
    }

    /**
     * Remove the specified financial category from storage.
     */
    public function destroy(FinancialCategory $financialCategory): RedirectResponse
    {
        // Check if the category is used by any transactions
        if ($financialCategory->transactions()->exists()) {
            return back()->with('error', 
                'Cannot delete this category because it is associated with transactions.');
        }
        
        $financialCategory->delete();

        return redirect()->route('financial-categories.index')
            ->with('success', 'Financial category deleted successfully.');
    }
}
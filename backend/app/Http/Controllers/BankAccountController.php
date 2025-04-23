<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class BankAccountController extends Controller
{
    /**
     * Display a listing of the bank accounts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = BankAccount::with('bank');
        
        // Apply filters if provided
        if ($request->filled('bank_id')) {
            $query->where('bank_id', $request->bank_id);
        }
        
        $bankAccounts = $query->paginate($request->input('per_page', 15));
        
        return response()->json([
            'data' => $bankAccounts->items(),
            'meta' => [
                'current_page' => $bankAccounts->currentPage(),
                'per_page' => $bankAccounts->perPage(),
                'total' => $bankAccounts->total(),
                'last_page' => $bankAccounts->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created bank account in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'bank_id' => 'exists:banks,id',
            'name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255|unique:bank_accounts',
            'starting_balance' => 'required|numeric',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $bankAccount = BankAccount::create([
            'bank_id' => $request->bank_id,
            'name' => $request->name,
            'account_number' => $request->account_number,
            'starting_balance' => $request->starting_balance,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bank account created successfully',
            'data' => $bankAccount
        ], 201);
    }

    /**
     * Display the specified bank account.
     */
    public function show(BankAccount $bankAccount): JsonResponse
    {
        // Load bank relationship
        $bankAccount->load('bank');
        
        // Calculate current balance (you need to implement this method in your model)
        $currentBalance = $bankAccount->getCurrentBalance();
        
        // Add the balance to the JSON response
        $bankAccount->current_balance = $currentBalance;
        
        return response()->json([
            'data' => $bankAccount
        ]);
    }

    /**
     * Update the specified bank account in storage.
     */
    public function update(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'bank_id' => 'nullable|exists:banks,id',
            'name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255|unique:bank_accounts,account_number,' . $bankAccount->id,
            'starting_balance' => 'required|numeric',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $bankAccount->update([
            'bank_id' => $request->bank_id,
            'name' => $request->name,
            'account_number' => $request->account_number,
            'starting_balance' => $request->starting_balance,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bank account updated successfully',
            'data' => $bankAccount
        ]);
    }

    /**
     * Remove the specified bank account from storage.
     */
    public function destroy(BankAccount $bankAccount): JsonResponse
    {
        // Check if the account is used by any transactions
        if ($bankAccount->transactions()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete this bank account because it is associated with transactions.'
            ], 400);
        }
        
        $bankAccount->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bank account deleted successfully'
        ]);
    }
    
    /**
     * Get transactions for a specific bank account
     */
    public function getTransactions(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $query = $bankAccount->transactions();
        
        // Apply date filters if provided
        if ($request->filled('start_date')) {
            $query->whereDate('transaction_date', '>=', $request->start_date);
        }
        
        if ($request->filled('end_date')) {
            $query->whereDate('transaction_date', '<=', $request->end_date);
        }
        
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        
        $transactions = $query->paginate($request->input('per_page', 15));
        
        return response()->json([
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }
}
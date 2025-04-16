<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use App\Models\FinancialCategory;
use App\Models\FinancialTransaction;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class FinancialTransactionController extends Controller
{
    /**
     * Display a listing of the financial transactions.
     */
    public function index(Request $request): View
    {
        $query = FinancialTransaction::with(['category', 'bankAccount', 'bankAccount.bank']);
        
        // Date filtering
        if ($request->filled('start_date') || $request->filled('end_date')) {
            $startDate = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
            $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date)->endOfDay() : null;
            
            $query->dateBetween($startDate, $endDate);
        }
        
        // Type filtering
        if ($request->filled('type') && in_array($request->type, ['income', 'expense'])) {
            $query->where('type', $request->type);
        }
        
        // Category filtering
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        // Bank account filtering
        if ($request->filled('bank_account_id')) {
            $query->where('bank_account_id', $request->bank_account_id);
        }
        
        // Order the transactions by date, newest first
        $query->orderBy('date', 'desc')->orderBy('id', 'desc');
        
        $transactions = $query->paginate(15)->appends($request->all());
        
        // Get data for filter dropdowns
        $categories = FinancialCategory::orderBy('name')->get();
        $bankAccounts = BankAccount::with('bank')->orderBy('account_name')->get();
        
        return view('financial.transactions.index', compact(
            'transactions', 
            'categories', 
            'bankAccounts'
        ));
    }

    /**
     * Show the form for creating a new financial transaction.
     */
    public function create(): View
    {
        $categories = FinancialCategory::orderBy('name')->get();
        $bankAccounts = BankAccount::with('bank')->orderBy('account_name')->get();
        $orders = Order::orderBy('id', 'desc')->limit(100)->get();
        
        return view('financial.transactions.create', compact('categories', 'bankAccounts', 'orders'));
    }

    /**
     * Store a newly created financial transaction in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:financial_categories,id',
            'amount' => 'required|numeric|decimal:0,2|min:0.01',
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'related_order_id' => 'nullable|exists:orders,id',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        FinancialTransaction::create($request->all());

        return redirect()->route('financial-transactions.index')
            ->with('success', 'Financial transaction created successfully.');
    }

    /**
     * Display the specified financial transaction.
     */
    public function show(FinancialTransaction $financialTransaction): View
    {
        return view('financial.transactions.show', compact('financialTransaction'));
    }

    /**
     * Show the form for editing the specified financial transaction.
     */
    public function edit(FinancialTransaction $financialTransaction): View
    {
        $categories = FinancialCategory::orderBy('name')->get();
        $bankAccounts = BankAccount::with('bank')->orderBy('account_name')->get();
        $orders = Order::orderBy('id', 'desc')->limit(100)->get();
        
        return view('financial.transactions.edit', compact(
            'financialTransaction', 
            'categories', 
            'bankAccounts', 
            'orders'
        ));
    }

    /**
     * Update the specified financial transaction in storage.
     */
    public function update(Request $request, FinancialTransaction $financialTransaction): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:financial_categories,id',
            'amount' => 'required|numeric|decimal:0,2|min:0.01',
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'related_order_id' => 'nullable|exists:orders,id',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $financialTransaction->update($request->all());

        return redirect()->route('financial-transactions.index')
            ->with('success', 'Financial transaction updated successfully.');
    }

    /**
     * Remove the specified financial transaction from storage.
     */
    public function destroy(FinancialTransaction $financialTransaction): RedirectResponse
    {
        $financialTransaction->delete();

        return redirect()->route('financial-transactions.index')
            ->with('success', 'Financial transaction deleted successfully.');
    }
    
    /**
     * Display a dashboard/summary of financial transactions.
     */
    public function dashboard(Request $request): View
    {
        // Default to current month if no dates provided
        $startDate = $request->filled('start_date') 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::now()->startOfMonth();
            
        $endDate = $request->filled('end_date') 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::now()->endOfMonth();
        
        // Get total income
        $totalIncome = FinancialTransaction::where('type', 'income')
            ->dateBetween($startDate, $endDate)
            ->sum('amount');
            
        // Get total expenses
        $totalExpenses = FinancialTransaction::where('type', 'expense')
            ->dateBetween($startDate, $endDate)
            ->sum('amount');
            
        // Get balance (profit/loss)
        $balance = $totalIncome - $totalExpenses;
        
        // Get income by category
        $incomeByCategory = FinancialTransaction::where('type', 'income')
            ->dateBetween($startDate, $endDate)
            ->with('category')
            ->get()
            ->groupBy('category.name')
            ->map(function ($transactions) {
                return $transactions->sum('amount');
            });
            
        // Get expenses by category
        $expensesByCategory = FinancialTransaction::where('type', 'expense')
            ->dateBetween($startDate, $endDate)
            ->with('category')
            ->get()
            ->groupBy('category.name')
            ->map(function ($transactions) {
                return $transactions->sum('amount');
            });
            
        // Bank account balances
        $bankAccounts = BankAccount::with('bank')->get();
        
        return view('financial.dashboard', compact(
            'startDate',
            'endDate',
            'totalIncome',
            'totalExpenses',
            'balance',
            'incomeByCategory',
            'expensesByCategory',
            'bankAccounts'
        ));
    }

    /**
     * Get financial transactions with filters
     */
    public function getTransactions(Request $request): JsonResponse
    {
        $query = FinancialTransaction::with(['category', 'bankAccount', 'bankAccount.bank']);
        
        // Date filtering
        if ($request->filled('start_date') || $request->filled('end_date')) {
            $startDate = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
            $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date)->endOfDay() : null;
            
            $query->dateBetween($startDate, $endDate);
        }
        
        // Type filtering
        if ($request->filled('type') && in_array($request->type, ['income', 'expense'])) {
            $query->where('type', $request->type);
        }
        
        // Category filtering
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        // Bank account filtering
        if ($request->filled('bank_account_id')) {
            $query->where('bank_account_id', $request->bank_account_id);
        }
        
        // Order the transactions by date, newest first
        $query->orderBy('date', 'desc')->orderBy('id', 'desc');
        
        // Pagination
        $perPage = $request->per_page ?? 15;
        $transactions = $query->paginate($perPage);
        
        return response()->json($transactions);
    }
    
    /**
     * Get bank accounts with their current balances
     */
    public function getBankAccounts(): JsonResponse
    {
        $bankAccounts = BankAccount::with('bank')->get();
        
        $result = $bankAccounts->map(function ($account) {
            return [
                'id' => $account->id,
                'bank_name' => $account->bank->name ?? 'Unknown Bank',
                'account_name' => $account->account_name,
                'account_number' => $account->account_number,
                'starting_balance' => $account->starting_balance,
                'current_balance' => $account->getCurrentBalance(),
            ];
        });
        
        return response()->json($result);
    }
    
    /**
     * Get financial summary with date range
     */
    public function getSummary(Request $request): JsonResponse
    {
        // Date filtering
        $startDate = $request->filled('start_date') 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::now()->startOfMonth();
            
        $endDate = $request->filled('end_date') 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::now()->endOfMonth();
        
        // Get total income
        $totalIncome = FinancialTransaction::where('type', 'income')
            ->dateBetween($startDate, $endDate)
            ->sum('amount');
            
        // Get total expenses
        $totalExpenses = FinancialTransaction::where('type', 'expense')
            ->dateBetween($startDate, $endDate)
            ->sum('amount');
            
        // Get balance (profit/loss)
        $balance = $totalIncome - $totalExpenses;
        
        // Get income by category
        $incomeByCategory = FinancialTransaction::where('type', 'income')
            ->dateBetween($startDate, $endDate)
            ->with('category')
            ->get()
            ->groupBy('category.name')
            ->map(function ($transactions) {
                return $transactions->sum('amount');
            });
            
        // Get expenses by category
        $expensesByCategory = FinancialTransaction::where('type', 'expense')
            ->dateBetween($startDate, $endDate)
            ->with('category')
            ->get()
            ->groupBy('category.name')
            ->map(function ($transactions) {
                return $transactions->sum('amount');
            });
        
        return response()->json([
            'period' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'summary' => [
                'total_income' => $totalIncome,
                'total_expenses' => $totalExpenses,
                'balance' => $balance,
            ],
            'income_by_category' => $incomeByCategory,
            'expenses_by_category' => $expensesByCategory,
        ]);
    }
    
    /**
     * Create a new financial transaction
     */
    public function storeTransaction(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:financial_categories,id',
            'amount' => 'required|numeric|decimal:0,2|min:0.01',
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'related_order_id' => 'nullable|exists:orders,id',
        ]);

        $transaction = FinancialTransaction::create($validatedData);
        
        return response()->json([
            'message' => 'Transaction created successfully',
            'transaction' => $transaction
        ], 201);
    }
}
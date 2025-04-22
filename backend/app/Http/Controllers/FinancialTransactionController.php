<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\FinancialCategory;
use App\Models\FinancialTransaction;
use App\Models\{Order, Bank};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

class FinancialTransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = FinancialTransaction::with(['category', 'bankAccount', 'bankAccount.bank']);

        if ($request->filled('start_date') || $request->filled('end_date')) {
            $startDate = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
            $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date)->endOfDay() : null;
            $query->dateBetween($startDate, $endDate);
        }

        if ($request->filled('type') && in_array($request->type, ['income', 'expense'])) {
            $query->where('type', $request->type);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('bank_account_id')) {
            $query->where('bank_account_id', $request->bank_account_id);
        }

        $query->orderBy('date', 'desc')->orderBy('id', 'desc');

        $transactions = $query->paginate($request->get('per_page', 15));

        return response()->json($transactions);
    }

    public function store(Request $request)
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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $transaction = FinancialTransaction::create($request->all());

        return response()->json(['message' => 'Transaction created successfully', 'data' => $transaction], 201);
    }

    public function show($id)
    {
        $transaction = FinancialTransaction::with(['category', 'bankAccount.bank'])->findOrFail($id);

        return response()->json($transaction);
    }

    public function update(Request $request, $id)
    {
        $transaction = FinancialTransaction::findOrFail($id);

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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $transaction->update($request->all());

        return response()->json(['message' => 'Transaction updated successfully', 'data' => $transaction]);
    }

    public function destroy($id)
    {
        $transaction = FinancialTransaction::findOrFail($id);
        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully']);
    }

    public function summary(Request $request)
    {
        $startDate = $request->filled('start_date') 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::now()->startOfMonth();

        $endDate = $request->filled('end_date') 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::now()->endOfMonth();

        $totalIncome = FinancialTransaction::where('type', 'income')
            ->dateBetween($startDate, $endDate)
            ->sum('amount');

        $totalExpenses = FinancialTransaction::where('type', 'expense')
            ->dateBetween($startDate, $endDate)
            ->sum('amount');

        $incomeByCategory = FinancialTransaction::where('type', 'income')
            ->dateBetween($startDate, $endDate)
            ->with('category')
            ->get()
            ->groupBy('category.name')
            ->map->sum('amount');

        $expensesByCategory = FinancialTransaction::where('type', 'expense')
            ->dateBetween($startDate, $endDate)
            ->with('category')
            ->get()
            ->groupBy('category.name')
            ->map->sum('amount');

        return response()->json([
            'total_income' => $totalIncome,
            'total_expenses' => $totalExpenses,
            'balance' => $totalIncome - $totalExpenses,
            'income_by_category' => $incomeByCategory,
            'expenses_by_category' => $expensesByCategory,
        ]);
    }

    public function bankAccounts()
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

    public function dropdownData()
    {
        return response()->json([
            'categories' => FinancialCategory::orderBy('name')->get(),
            'bank_accounts' => BankAccount::with('bank')->orderBy('account_name')->get(),
            'orders' => Order::orderBy('id', 'desc')->limit(100)->get(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class BankAccountController extends Controller
{
    /**
     * Display a listing of the bank accounts.
     */
    public function index(): View
    {
        $bankAccounts = BankAccount::with('bank')->paginate(15);
        
        return view('financial.bank-accounts.index', compact('bankAccounts'));
    }

    /**
     * Show the form for creating a new bank account.
     */
    public function create(): View
    {
        $banks = Bank::orderBy('name')->get();
        
        return view('financial.bank-accounts.create', compact('banks'));
    }

    /**
     * Store a newly created bank account in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'bank_id' => 'required|exists:banks,id',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255|unique:bank_accounts',
            'starting_balance' => 'required|numeric|decimal:0,2',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        BankAccount::create($request->all());

        return redirect()->route('bank-accounts.index')
            ->with('success', 'Bank account created successfully.');
    }

    /**
     * Display the specified bank account.
     */
    public function show(BankAccount $bankAccount): View
    {
        // Get the current balance
        $currentBalance = $bankAccount->getCurrentBalance();
        
        return view('financial.bank-accounts.show', compact('bankAccount', 'currentBalance'));
    }

    /**
     * Show the form for editing the specified bank account.
     */
    public function edit(BankAccount $bankAccount): View
    {
        $banks = Bank::orderBy('name')->get();
        
        return view('financial.bank-accounts.edit', compact('bankAccount', 'banks'));
    }

    /**
     * Update the specified bank account in storage.
     */
    public function update(Request $request, BankAccount $bankAccount): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'bank_id' => 'required|exists:banks,id',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255|unique:bank_accounts,account_number,' . $bankAccount->id,
            'starting_balance' => 'required|numeric|decimal:0,2',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $bankAccount->update($request->all());

        return redirect()->route('bank-accounts.index')
            ->with('success', 'Bank account updated successfully.');
    }

    /**
     * Remove the specified bank account from storage.
     */
    public function destroy(BankAccount $bankAccount): RedirectResponse
    {
        // Check if the account is used by any transactions
        if ($bankAccount->transactions()->exists()) {
            return back()->with('error', 
                'Cannot delete this bank account because it is associated with transactions.');
        }
        
        $bankAccount->delete();

        return redirect()->route('bank-accounts.index')
            ->with('success', 'Bank account deleted successfully.');
    }
}
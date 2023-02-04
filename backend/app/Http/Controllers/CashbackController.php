<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCashbackRequest;
use App\Http\Requests\UpdateCashbackRequest;
use App\Models\Cashback;

class CashbackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreCashbackRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCashbackRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Cashback  $cashback
     * @return \Illuminate\Http\Response
     */
    public function show(Cashback $cashback)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Cashback  $cashback
     * @return \Illuminate\Http\Response
     */
    public function edit(Cashback $cashback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateCashbackRequest  $request
     * @param  \App\Models\Cashback  $cashback
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCashbackRequest $request, Cashback $cashback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Cashback  $cashback
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cashback $cashback)
    {
        //
    }
}

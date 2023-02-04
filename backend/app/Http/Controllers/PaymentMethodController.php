<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayment_MethodRequest;
use App\Http\Requests\UpdatePayment_MethodRequest;
use App\Models\Payment_Method;

class PaymentMethodController extends Controller
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
     * @param  \App\Http\Requests\StorePayment_MethodRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePayment_MethodRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payment_Method  $payment_Method
     * @return \Illuminate\Http\Response
     */
    public function show(Payment_Method $payment_Method)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Payment_Method  $payment_Method
     * @return \Illuminate\Http\Response
     */
    public function edit(Payment_Method $payment_Method)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdatePayment_MethodRequest  $request
     * @param  \App\Models\Payment_Method  $payment_Method
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePayment_MethodRequest $request, Payment_Method $payment_Method)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Payment_Method  $payment_Method
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payment_Method $payment_Method)
    {
        //
    }
}

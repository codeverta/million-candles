<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrder_PaymentRequest;
use App\Http\Requests\UpdateOrder_PaymentRequest;
use App\Models\Order_Payment;

class OrderPaymentController extends Controller
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
     * @param  \App\Http\Requests\StoreOrder_PaymentRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrder_PaymentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order_Payment  $order_Payment
     * @return \Illuminate\Http\Response
     */
    public function show(Order_Payment $order_Payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order_Payment  $order_Payment
     * @return \Illuminate\Http\Response
     */
    public function edit(Order_Payment $order_Payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateOrder_PaymentRequest  $request
     * @param  \App\Models\Order_Payment  $order_Payment
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateOrder_PaymentRequest $request, Order_Payment $order_Payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order_Payment  $order_Payment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order_Payment $order_Payment)
    {
        //
    }
}

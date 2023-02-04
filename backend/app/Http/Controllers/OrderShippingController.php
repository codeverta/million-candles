<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrder_ShippingRequest;
use App\Http\Requests\UpdateOrder_ShippingRequest;
use App\Models\Order_Shipping;

class OrderShippingController extends Controller
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
     * @param  \App\Http\Requests\StoreOrder_ShippingRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrder_ShippingRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order_Shipping  $order_Shipping
     * @return \Illuminate\Http\Response
     */
    public function show(Order_Shipping $order_Shipping)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order_Shipping  $order_Shipping
     * @return \Illuminate\Http\Response
     */
    public function edit(Order_Shipping $order_Shipping)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateOrder_ShippingRequest  $request
     * @param  \App\Models\Order_Shipping  $order_Shipping
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateOrder_ShippingRequest $request, Order_Shipping $order_Shipping)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order_Shipping  $order_Shipping
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order_Shipping $order_Shipping)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShipping_MethodRequest;
use App\Http\Requests\UpdateShipping_MethodRequest;
use App\Models\Shipping_Method;

class ShippingMethodController extends Controller
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
     * @param  \App\Http\Requests\StoreShipping_MethodRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreShipping_MethodRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Shipping_Method  $shipping_Method
     * @return \Illuminate\Http\Response
     */
    public function show(Shipping_Method $shipping_Method)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Shipping_Method  $shipping_Method
     * @return \Illuminate\Http\Response
     */
    public function edit(Shipping_Method $shipping_Method)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateShipping_MethodRequest  $request
     * @param  \App\Models\Shipping_Method  $shipping_Method
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateShipping_MethodRequest $request, Shipping_Method $shipping_Method)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Shipping_Method  $shipping_Method
     * @return \Illuminate\Http\Response
     */
    public function destroy(Shipping_Method $shipping_Method)
    {
        //
    }
}

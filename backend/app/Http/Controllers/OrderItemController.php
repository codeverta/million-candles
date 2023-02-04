<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrder_ItemRequest;
use App\Http\Requests\UpdateOrder_ItemRequest;
use App\Models\Order_Item;

class OrderItemController extends Controller
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
     * @param  \App\Http\Requests\StoreOrder_ItemRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrder_ItemRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order_Item  $order_Item
     * @return \Illuminate\Http\Response
     */
    public function show(Order_Item $order_Item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order_Item  $order_Item
     * @return \Illuminate\Http\Response
     */
    public function edit(Order_Item $order_Item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateOrder_ItemRequest  $request
     * @param  \App\Models\Order_Item  $order_Item
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateOrder_ItemRequest $request, Order_Item $order_Item)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order_Item  $order_Item
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order_Item $order_Item)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProduct_PromotionRequest;
use App\Http\Requests\UpdateProduct_PromotionRequest;
use App\Models\Product_Promotion;

class ProductPromotionController extends Controller
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
     * @param  \App\Http\Requests\StoreProduct_PromotionRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProduct_PromotionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product_Promotion  $product_Promotion
     * @return \Illuminate\Http\Response
     */
    public function show(Product_Promotion $product_Promotion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product_Promotion  $product_Promotion
     * @return \Illuminate\Http\Response
     */
    public function edit(Product_Promotion $product_Promotion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateProduct_PromotionRequest  $request
     * @param  \App\Models\Product_Promotion  $product_Promotion
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProduct_PromotionRequest $request, Product_Promotion $product_Promotion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product_Promotion  $product_Promotion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product_Promotion $product_Promotion)
    {
        //
    }
}

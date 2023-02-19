<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('product_detail_order', function (Blueprint $table) {
            $table->foreignId('product_details_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('orders_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->primary(['product_details_id', 'orders_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_details');
        Schema::dropIfExists('product_detail_order');
    }
};

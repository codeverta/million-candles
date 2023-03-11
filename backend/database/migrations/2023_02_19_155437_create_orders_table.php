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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->string('airwaybill')->nullable();
            $table->string('snap_token')->nullable();
            $table->string('buyer_name')->nullable();
            $table->enum('payments_type', ['cash', 'transfer', 'midtrans'])->nullable();
            $table->boolean('is_validate_buyer')->default(false);
            $table->boolean('is_validate_seller')->default(false);
            $table->boolean('is_shipping')->default(false);
            $table->boolean('is_shipped')->default(false);
            $table->boolean('is_received')->default(false);
            $table->string('address')->nullable();
            $table->bigInteger('price_amount')->default(0);
            $table->unsignedBigInteger('origin_user_id');
            $table->unsignedBigInteger('destination_user_id')->nullable();

            $table->foreign('origin_user_id')->references('id')->on('users');
            $table->foreign('destination_user_id')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};

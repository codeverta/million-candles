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
            $table->string('airwaybills');
            $table->boolean('is_validate')->default(false);
            $table->boolean('is_shipping')->default(false);
            $table->boolean('is_shipped')->default(false);
            $table->boolean('is_received')->default(false);
            $table->unsignedBigInteger('origin_user_id');
            $table->unsignedBigInteger('destination_user_id');

            $table->foreignId('villages_id')->constrained();
            $table->foreign('origin_user_id')->references('id')->on('users');
            $table->foreign('destination_user_id')->references('id')->on('users');
            $table->timestamps();
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

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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('discount', 8, 2)->nullable();
            $table->decimal('shipping_cost', 10, 2)->nullable();
            $table->string('discount_type')->nullable();
            $table->decimal('down_payment', 15, 2)->nullable();
            $table->decimal('remaining_payment', 15, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('discount');
            $table->dropColumn('shipping_cost');
            $table->dropColumn('discount_type');
            $table->dropColumn('down_payment');
            $table->dropColumn('remaining_payment');
        });
    }
};

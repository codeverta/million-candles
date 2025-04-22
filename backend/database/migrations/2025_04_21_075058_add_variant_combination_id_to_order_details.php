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
        Schema::table('order_details', function (Blueprint $table) {
            $table->foreignId('variant_combination_id')->nullable()->constrained('variant_combinations')->after('products_id')->nullable();
            $table->string('variant_sku')->nullable()->after('variant_combination_id');
            // add total price
            $table->decimal('total_price', 15, 2)->after('variant_sku')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropForeign(['variant_combination_id']);
            $table->dropColumn('variant_combination_id');
            $table->dropColumn('variant_sku');
            $table->dropColumn('total_price');
        });
    }
};

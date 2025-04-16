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
        Schema::create('financial_transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['income', 'expense']);
            $table->unsignedBigInteger('category_id');
            $table->decimal('amount', 15, 2);
            $table->unsignedBigInteger('bank_account_id');
            $table->date('date');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('related_order_id')->nullable();
            $table->timestamps();
            
            $table->foreign('category_id')->references('id')->on('financial_categories');
            $table->foreign('bank_account_id')->references('id')->on('bank_accounts');
            // Assuming you have an orders table
            $table->foreign('related_order_id')->references('id')->on('orders')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('financial_transactions');
    }
};

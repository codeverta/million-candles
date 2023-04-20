<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add a UUID column to the given table.
     *
     * @param string $table
     * @return void
     */
    protected function addUuidColumnToTable(string $table)
    {
        Schema::table($table, function (Blueprint $table) {
            $table->uuid('uuid')->after('id')->nullable();
        });
    }
    /**
     * Add a UUID column to the given table.
     *
     * @param string $table
     * @return void
     */
    protected function dropUuidColumnToTable(string $table)
    {
        Schema::table($table, function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->addUuidColumnToTable('users');
        $this->addUuidColumnToTable('orders');
        $this->addUuidColumnToTable('products');
        $this->addUuidColumnToTable('order_details');
        $this->addUuidColumnToTable('carts');
        $this->addUuidColumnToTable('documents');
        $this->addUuidColumnToTable('banks');
        $this->addUuidColumnToTable('notifications');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $this->dropUuidColumnToTable('users');
        $this->dropUuidColumnToTable('orders');
        $this->dropUuidColumnToTable('products');
        $this->dropUuidColumnToTable('order_details');
        $this->dropUuidColumnToTable('carts');
        $this->dropUuidColumnToTable('documents');
        $this->dropUuidColumnToTable('banks');
        $this->dropUuidColumnToTable('notifications');
    }
};

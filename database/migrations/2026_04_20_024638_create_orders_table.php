<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained();
            $table->integer('total_amount');
            $table->integer('shipping_cost');
            $table->string('courier');
            $table->string('service');
            $table->string('waybill')->nullable();

            $table->enum('status', ['pending', 'paid', 'packing', 'shipping', 'completed', 'cancelled'])->default('pending');

            $table->text('snap_token')->nullable();
            $table->string('payment_type')->nullable();

            $table->text('shipping_address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

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
        Schema::dropIfExists('carts');

        Schema::create('carts', function (Blueprint $blueprint) {
            $blueprint->id();

            $blueprint->foreignId('user_id')->constrained()->onDelete('cascade');

            $blueprint->foreignId('product_id')->constrained()->onDelete('cascade');

            $blueprint->integer('quantity')->default(1);

            $blueprint->integer('negotiated_price')->nullable();

            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};

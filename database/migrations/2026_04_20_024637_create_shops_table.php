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
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('shop_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            $table->integer('province_id')->nullable();
            $table->integer('city_id')->nullable();
            $table->text('address_detail')->nullable();

            $table->string('ktp_image')->nullable();
            $table->string('selfie_image')->nullable();
            $table->text('pickup_address')->nullable();
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');

            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(false); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};

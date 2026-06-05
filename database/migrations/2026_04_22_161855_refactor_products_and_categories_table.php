<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Membuat tabel categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // 2. Mengubah struktur tabel products
        Schema::table('products', function (Blueprint $table) {
            // Mengubah gender dan condition menjadi ENUM
            $table->enum('gender', ['pria', 'wanita', 'unisex'])->default('unisex')->change();
            $table->enum('condition', ['new', 'like_new', 'good', 'fair'])->default('good')->change();

            // Mengubah category menjadi string yang merujuk ke nama di tabel categories
            // (Atau bisa menggunakan foreignId jika ingin menggunakan ID)
            $table->string('category')->change();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

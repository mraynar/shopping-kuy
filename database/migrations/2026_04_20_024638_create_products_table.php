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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->integer('price');
            $table->integer('stock')->default(1);

            // DETAIL FISIK (Penting untuk Preloved/Thrift)
            $table->string('size')->nullable(); // Contoh: L, XL, atau EU 42 seperti di UI
            $table->string('brand')->nullable(); // Untuk filter Brand Paling Top
            $table->integer('weight'); // Dalam gram untuk hitung ongkir

            // KONDISI
            $table->enum('condition', ['new', 'like_new', 'good', 'fair']);
            $table->text('minus_detail')->nullable(); // Penjelasan lecet/minus barang preloved

            // KATEGORI & MEDIA
            $table->string('category');
            $table->json('images'); // Menyimpan array path gambar
            $table->string('thumbnail')->nullable(); // Gambar utama untuk grid depat agar loading cepat

            // STATUS & FITUR
            $table->boolean('is_available')->default(true);
            $table->boolean('is_negotiable')->default(true); // Untuk tombol "Nego"
            $table->boolean('is_featured')->default(false); // Untuk masuk ke "Koleksi Pilihan"

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

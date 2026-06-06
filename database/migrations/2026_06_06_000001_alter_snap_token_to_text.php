<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Mengubah kolom snap_token dari string (VARCHAR 255) ke TEXT
     * agar dapat menampung Midtrans snap token yang bisa > 255 karakter.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->text('snap_token')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('snap_token')->nullable()->change();
        });
    }
};

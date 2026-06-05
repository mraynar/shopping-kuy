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
        Schema::table('shops', function (Blueprint $table) {
            // Hapus ktp_number jika ada
            if (Schema::hasColumn('shops', 'ktp_number')) {
                $table->dropColumn('ktp_number');
            }

            // Tambahkan kolom statistik jika belum ada
            if (!Schema::hasColumn('shops', 'total_products')) {
                $table->integer('total_products')->default(0);
                $table->integer('total_sold')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            //
        });
    }
};

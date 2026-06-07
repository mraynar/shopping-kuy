<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Mengubah tipe kolom rajaongkir_destination_id dari unsignedBigInteger ke string
     * agar bisa menyimpan ID format string dari RajaOngkir Komerce API.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('rajaongkir_destination_id', 50)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('rajaongkir_destination_id')->nullable()->change();
        });
    }
};

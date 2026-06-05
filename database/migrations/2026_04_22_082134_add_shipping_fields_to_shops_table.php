<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('shops', function (Blueprint $table) {
            // Kolom penting untuk identifikasi RajaOngkir
            if (!Schema::hasColumn('shops', 'province_id')) {
                $table->string('province_id')->after('description')->nullable();
            }
            if (!Schema::hasColumn('shops', 'city_id')) {
                $table->string('city_id')->after('province_id')->nullable();
            }
            if (!Schema::hasColumn('shops', 'postal_code')) {
                $table->string('postal_code')->after('city_id')->nullable();
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

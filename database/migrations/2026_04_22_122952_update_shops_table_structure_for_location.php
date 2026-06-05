<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $blueprint) {
            $blueprint->integer('district_id')->nullable()->after('city_id');
            $blueprint->integer('subdistrict_id')->nullable()->after('district_id');

            $blueprint->text('address_note')->nullable()->after('pickup_address');

            if (Schema::hasColumn('shops', 'address_detail')) {
                $blueprint->dropColumn('address_detail');
            }
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $blueprint) {
            // Kebalikan dari fungsi up (untuk rollback)
            $blueprint->dropColumn(['district_id', 'subdistrict_id', 'address_note']);
            $blueprint->text('address_detail')->nullable()->after('pickup_address');
        });
    }
};

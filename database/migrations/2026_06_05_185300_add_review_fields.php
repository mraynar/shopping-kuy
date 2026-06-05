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
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'rating')) {
                $table->integer('rating')->default(5);
            }
            if (!Schema::hasColumn('reviews', 'body')) {
                $table->text('body')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'rating')) {
                $table->dropColumn('rating');
            }
            if (Schema::hasColumn('reviews', 'body')) {
                $table->dropColumn('body');
            }
        });
    }
};

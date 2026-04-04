<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voznje', function (Blueprint $table) {
            $table->decimal('departure_lat', 10, 8)->nullable()->after('mestoDo');
            $table->decimal('departure_lng', 11, 8)->nullable()->after('departure_lat');
            $table->decimal('arrival_lat', 10, 8)->nullable()->after('departure_lng');
            $table->decimal('arrival_lng', 11, 8)->nullable()->after('arrival_lat');
            $table->decimal('distance_km', 8, 2)->nullable()->after('arrival_lng');
            $table->decimal('fuel_price_per_liter', 6, 2)->nullable()->after('distance_km');
            $table->decimal('price_per_seat', 8, 2)->nullable()->default(0)->after('fuel_price_per_liter');
        });
    }

    public function down(): void
    {
        Schema::table('voznje', function (Blueprint $table) {
            $table->dropColumn([
                'departure_lat', 'departure_lng',
                'arrival_lat', 'arrival_lng',
                'distance_km', 'fuel_price_per_liter', 'price_per_seat',
            ]);
        });
    }
};

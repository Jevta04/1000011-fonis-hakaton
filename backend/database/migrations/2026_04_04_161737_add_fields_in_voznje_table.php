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
        Schema::table('voznje', function (Blueprint $table) {
            $table->string('brojTablica');
            $table->string('marka');
            $table->string('boja');
            $table->boolean('muzika')->default(false);
            $table->boolean('klima')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('voznje', function (Blueprint $table) {
            $table->dropColumns(['brojTablica','marka','boja','muzika','klima']);
        });
    }
};

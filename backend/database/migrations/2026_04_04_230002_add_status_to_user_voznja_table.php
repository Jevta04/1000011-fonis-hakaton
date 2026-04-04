<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_voznja', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'rejected', 'cancelled'])
                  ->default('pending')
                  ->after('uloga');
        });

        // Existing vozac entries are always confirmed
        \DB::table('user_voznja')->where('uloga', 'vozac')->update(['status' => 'confirmed']);
    }

    public function down(): void
    {
        Schema::table('user_voznja', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};

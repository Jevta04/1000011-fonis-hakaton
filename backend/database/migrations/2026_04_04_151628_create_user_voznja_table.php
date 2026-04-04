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
        Schema::create('user_voznja', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('voznja_id')
                ->constrained('voznje')
                ->cascadeOnDelete();

            // uloga u vožnji
            $table->enum('uloga', ['vozac', 'putnik']);

            $table->timestamps();

            // sprečava duplikate (isti user u istoj vožnji više puta)
            $table->unique(['user_id', 'voznja_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_voznja');
    }
};

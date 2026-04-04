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
        Schema::create('voznje', function (Blueprint $table) {
            $table->id();
            $table->string('mestoOd');
            $table->string('mestoDo');
            $table->dateTime('datumVreme');
            $table->boolean('smoking')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voznje');
    }
};

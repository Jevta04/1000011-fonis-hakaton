<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voznje', function (Blueprint $table) {
            $table->unsignedTinyInteger('seats')->default(4);
        });
    }

    public function down(): void
    {
        Schema::table('voznje', function (Blueprint $table) {
            $table->dropColumn('seats');
        });
    }
};

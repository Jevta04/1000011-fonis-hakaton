<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // dodaj odmah posle id
            $table->string('ime')->after('id');
            $table->string('prezime')->after('ime');

            // ostala polja
            $table->string('uloga')->after('password');
            $table->string('brojTelefona')->after('uloga');

            // FK ka kompaniji
            $table->foreignId('kompanija_id')
                  ->after('brojTelefona')
                  ->constrained('kompanije')
                  ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropForeign(['kompanija_id']);
            $table->dropColumn([
                'ime',
                'prezime',
                'uloga',
                'brojTelefona',
                'kompanija_id'
            ]);
        });
    }
};
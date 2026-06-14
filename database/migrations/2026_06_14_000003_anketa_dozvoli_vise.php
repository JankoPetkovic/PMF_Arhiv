<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('anketa', 'dozvoli_vise')) {
            Schema::table('anketa', function (Blueprint $table) {
                $table->boolean('dozvoli_vise')->default(false);
            });
        }

        // Na MySQL-u FK na anketa_id koristi composite unique (anketa_id, email)
        // kao svoj indeks, pa pre brisanja unique-a moramo dati anketa_id zaseban indeks.
        try {
            Schema::table('anketa_odgovor', function (Blueprint $table) {
                $table->index('anketa_id', 'anketa_odgovor_anketa_id_idx');
            });
        } catch (\Throwable $e) { /* indeks već postoji */ }

        // Tvrdi unique sprečava više popunjavanja; enforcement ide u aplikaciju
        // (uslovno, samo kad dozvoli_vise = false).
        try {
            Schema::table('anketa_odgovor', function (Blueprint $table) {
                $table->dropUnique('anketa_odgovor_anketa_id_email_unique');
            });
        } catch (\Throwable $e) { /* unique već uklonjen */ }
    }

    public function down(): void
    {
        try {
            Schema::table('anketa_odgovor', function (Blueprint $table) {
                $table->unique(['anketa_id', 'email']);
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('anketa_odgovor', function (Blueprint $table) {
                $table->dropIndex('anketa_odgovor_anketa_id_idx');
            });
        } catch (\Throwable $e) {}

        if (Schema::hasColumn('anketa', 'dozvoli_vise')) {
            Schema::table('anketa', function (Blueprint $table) {
                $table->dropColumn('dozvoli_vise');
            });
        }
    }
};

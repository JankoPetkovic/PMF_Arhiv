<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // Tipovi koje je kod već koristio ('Import') ili koji nedostaju za pun audit log.
    // Bez njih zabeleziAkciju() tiho ne radi (vraća null kad tip ne postoji).
    private array $tipovi = [
        9  => 'Import',
        10 => 'Reset šifre',
        11 => 'Dodela uloge',
    ];

    public function up(): void
    {
        foreach ($this->tipovi as $id => $naziv) {
            DB::table('tip_korisnicke_akcije')->updateOrInsert(['id' => $id], ['naziv' => $naziv]);
        }
    }

    public function down(): void
    {
        DB::table('tip_korisnicke_akcije')->whereIn('id', array_keys($this->tipovi))->delete();
    }
};

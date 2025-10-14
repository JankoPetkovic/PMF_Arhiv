<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipKorisnickeAkcijeSeeder extends Seeder
{

    public function run(): void
    {
        DB::table('tip_korisnicke_akcije')->insert([
            ['naziv' => 'Čitanje'],
            ['naziv' => 'Brisanje'],
            ['naziv' => 'Ažuriranje'],
            ['naziv' => 'Kreiranje'],
            ['naziv' => 'Verifikacija'],
            ['naziv' => 'Prijavljivanje'],
            ['naziv' => 'Odjavljivanje'],
            ['naziv' => 'Eksport'],
        ]);
    }
}

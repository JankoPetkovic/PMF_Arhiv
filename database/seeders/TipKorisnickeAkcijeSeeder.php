<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipKorisnickeAkcijeSeeder extends Seeder
{

    public function run(): void
    {
        DB::table('tip_korisnicke_akcije')->insert([
            ['id' => 1, 'naziv' => 'Čitanje'],
            ['id' => 2, 'naziv' => 'Brisanje'],
            ['id' => 3, 'naziv' => 'Ažuriranje'],
            ['id' => 4, 'naziv' => 'Kreiranje'],
            ['id' => 5, 'naziv' => 'Verifikacija'],
            ['id' => 6, 'naziv' => 'Prijavljivanje'],
            ['id' => 7, 'naziv' => 'Odjavljivanje'],
            ['id' => 8, 'naziv' => 'Eksport'],
        ]);
    }
}

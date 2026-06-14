<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipKorisnickeAkcijeSeeder extends Seeder
{

    public function run(): void
    {
        // insertOrIgnore: data-migracije su možda već ubacile neke tipove (9–11),
        // pa preskačemo duplikate umesto da pucamo na fresh migrate --seed.
        DB::table('tip_korisnicke_akcije')->insertOrIgnore([
            ['id' => 1, 'naziv' => 'Čitanje'],
            ['id' => 2, 'naziv' => 'Brisanje'],
            ['id' => 3, 'naziv' => 'Ažuriranje'],
            ['id' => 4, 'naziv' => 'Kreiranje'],
            ['id' => 5, 'naziv' => 'Verifikacija'],
            ['id' => 6, 'naziv' => 'Prijavljivanje'],
            ['id' => 7, 'naziv' => 'Odjavljivanje'],
            ['id' => 8, 'naziv' => 'Eksport'],
            ['id' => 9, 'naziv' => 'Import'],
            ['id' => 10, 'naziv' => 'Reset šifre'],
            ['id' => 11, 'naziv' => 'Dodela uloge'],
        ]);
    }
}

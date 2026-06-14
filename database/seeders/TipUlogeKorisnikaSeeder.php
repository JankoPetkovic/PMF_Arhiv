<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipUlogeKorisnikaSeeder extends Seeder
{
    public function run(): void
    {
        // insertOrIgnore: migracija add_predstavnik_parlamenta_uloga je možda već
        // ubacila id=4, pa preskačemo duplikate na fresh migrate --seed.
        DB::table('tip_uloge_korisnika')->insertOrIgnore([
            ['id' => 1, 'naziv' => 'Gost'],
            ['id' => 2, 'naziv' => 'Admin'],
            ['id' => 3, 'naziv' => 'Menadžer'],
            ['id' => 4, 'naziv' => 'Predstavnik parlamenta'],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipUlogeKorisnikaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tip_uloge_korisnika')->insert([
            ['id' => 1, 'naziv' => 'Gost'],
            ['id' => 2, 'naziv' => 'Admin'],
            ['id' => 3, 'naziv' => 'Menadžer'],
            ['id' => 4, 'naziv' => 'Predstavnik parlamenta'],
        ]);
    }
}

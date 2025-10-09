<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipUlogeKorisnikaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tip_uloge_korisnika')->insert([
            ['naziv' => 'Gost'],
            ['naziv' => 'Admin'],
            ['naziv' => 'Menadžer'],
        ]);
    }
}

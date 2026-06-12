<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipProblemaSeeder extends Seeder
{

    public function run(): void
    {
        DB::table('tip_problema')->insert([
            ['id' => 1, 'naziv' => 'Nevalidan materijal'],
            ['id' => 2, 'naziv' => 'Korisnički problem'],
            ['id' => 3, 'naziv' => 'Serverski problem'],
        ]);
    }
}
